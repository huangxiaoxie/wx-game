import { Sender, sendToUser, sendUrlRequest } from "./../mgr/NetMgr";
import { debuglog } from "util";
import { iApp } from "../app";
import { debugLog, getLogTool } from "../Tools";
import { refreshToken } from "../mgr/TokenMgr";
declare var global: iApp;

interface MidasBaseVo {
    openid: string,		//用户唯一标识符
    appid: string,		//小程序 appId
    offer_id: string,	//米大师分配的offer_id
    ts: number,			//UNIX 时间戳，单位是秒
    zone_id: string,		//游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
    pf: string,			//平台 安卓：android
    user_ip?: string,	//用户外网 IP
    pay_item?: string,	//道具名称
    sig?: string,			//以上所有参数（含可选最多9个）+uri+米大师密钥，用 HMAC-SHA256签名，详见 米大师支付签名算法
    access_token?: string,//接口调用凭证
    mp_sig?: string,		//以上所有参数（含可选最多11个）+uri+session_key，用 HMAC-SHA256签名，详见 米大师支付签名算法
}

interface ICanCelVo extends MidasBaseVo {
    bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
}

interface IGetBalanceVo extends MidasBaseVo {
}

interface IPayVo extends MidasBaseVo {
    amt: number,			//扣除游戏币数量，不能为 0
    bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
    app_remark?: string,	//备注。会写到账户流水
}

interface IPresentVo extends MidasBaseVo {
    bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
    present_counts: number,	//赠送游戏币的个数，不能为0
}

interface IBalanceVo {
    errcode?: number,				//错误码
    errmsg?: string,				//错误信息
    balance: number,				//游戏币个数(包含赠送)
    gen_balance: number,			//赠送游戏币数量（赠送游戏币数量）
    first_save: boolean,			//是否满足历史首次充值
    save_amt: number,			//累计充值金额的游戏币数量
    save_num: number,			//历史总游戏币金额
    cost_sum: number,			//历史总消费游戏币金额
    present_sum: number,			//历史累计收到赠送金额
}

const crypto = require("crypto");
var writeLog = getLogTool("pay");
var errorLog = getLogTool("pay", true);
async function getBalance(ctx, next) {
    var openid = ctx.request.body.openId;
    var sessionKey=global.userMgr.getSessionKey(openid);
    if (openid && sessionKey) {
        var methodName: string = "getbalance";
        var balanceVo = _getBlanceData(openid, methodName);
        var url = global.PayUrl + methodName + "?access_token=" + global.Token;
        var data: any = await sendUrlRequest(url, balanceVo, "POST");
        var d = <IBalanceVo>data;
        var retry = 0;
        while (d.errcode == 40001 && retry < 5) {
            retry++;
            await refreshToken();
            balanceVo = _getBlanceData(openid, methodName);
            url = global.PayUrl + methodName + "?access_token=" + global.Token;
            data = await sendUrlRequest(url, balanceVo, "POST");
            d = <IBalanceVo>data;
        }
        if (d.errcode == 0) {
            writeLog("查询成功:" + JSON.stringify(d))
            sendToUser(ctx.response, { success: true, data: d });
        } else {
            sendToUser(ctx.response, { success: false, data: d });
            errorLog(d.errmsg + "---" + d.errcode);
        }
    } else {
        ctx.response.body = "错误了";
    }
}

function _getBlanceData(openid, methodName): any {
    var balanceVo: any = {
        openid: openid,
        appid: global.APPID,
        offer_id: global.midasId,
        ts: Math.round(Date.now() / 1000),
        zone_id: "1",
        pf: "android",
    }
    balanceVo.sig = getSig(balanceVo, methodName);
    balanceVo.access_token = global.Token;
    balanceVo.mp_sig = getMpSig(balanceVo, methodName);
    return balanceVo;
}

async function pay(ctx, next) {
    var price = ctx.request.body.price;
    var openid = ctx.request.body.openId;
    var sessionKey=global.userMgr.getSessionKey(openid);
    if(!price || !openid || !sessionKey){
        ctx.response.body = "错误了";
        return;
    }
    var methodName: string = "pay";
    var ts = Math.round(Date.now() / 1000);
    var payVo: IPayVo = {
        openid: openid,
        appid: global.APPID,
        offer_id: global.midasId,
        ts: ts,
        zone_id: "1",
        pf: "android",
        amt: price,
        bill_no: _getBillNo(openid),
        app_remark: "测试扣费",
    }
    payVo.sig = getSig(payVo, methodName);
    payVo.access_token = global.Token;
    payVo.mp_sig = getMpSig(payVo, methodName);
    debugLog("订单号:" + payVo.bill_no);
    var url = global.PayUrl + methodName + "?access_token=" + global.Token;
    var data: any = await sendUrlRequest(url, payVo, "POST");
    var d = <IBalanceVo>data;
    if (d.errcode == 0) {
        writeLog("订单" + payVo.bill_no + "扣费成功" + JSON.stringify(d));
        sendToUser(ctx.response, { success: true, data: d });
    } else {
        sendToUser(ctx.response, { success: false, data: d });
        errorLog(d.errmsg + "---" + d.errcode);
    }

}

async function present(ctx, next) {
    var methodName: string = "present";
    var ts = Math.round(Date.now() / 1000);
    var openId = ctx.request.body.openId;
    var num = ctx.request.body.num;
    var userVo = global.userMgr.getUser(openId);
    if (!userVo) {
        sendToUser(ctx.response, { success: false, data: "目标不在线" });
        return;
    }
    var payVo: IPresentVo = {
        openid: openId,
        appid: global.APPID,
        offer_id: global.midasId,
        ts: ts,
        zone_id: "1",
        pf: "android",
        present_counts: num,
        bill_no: _getBillNo(openId),
    }
    payVo.sig = getSig(payVo, methodName);
    payVo.access_token = global.Token;
    payVo.mp_sig = getMpSig(payVo, methodName);
    var url = global.PayUrl + methodName + "?access_token=" + global.Token;
    debugLog("订单号:" + payVo.bill_no);
    var data: any = await sendUrlRequest(url, payVo, "POST");
    var d = <IBalanceVo>data;
    if (d.errcode == 0) {
        writeLog("订单" + payVo.bill_no + "赠送成功" + JSON.stringify(d));
        sendToUser(ctx.response, { success: true, data: d });
    } else {
        errorLog(d.errmsg + "---" + d.errcode);
        sendToUser(ctx.response, { success: true, data: d });
    }
}

function _getBillNo(openid: string): string {
    return "billNo_" + openid + "_" + Date.now();
}

function getSig(midasVo: MidasBaseVo, methodName: string): string {
    var stringA = _getKeyStr(midasVo);
    // var stringA = `appid=${midasVo.appid}&offer_id=${midasVo.offer_id}&openid=${midasVo.openid}&pf=${midasVo.pf}&ts=${midasVo.ts}&zone_id=${midasVo.zone_id}`;
    var stringSignTemp = stringA + `&org_loc=${global.midasUri + methodName}&method=POST&secret=${global.midasKey}`;
    var sig = crypto.createHmac('sha256', global.midasKey).update(stringSignTemp).digest('hex');
    return sig;
}

function getMpSig(midasVo: MidasBaseVo, methodName: string): string {
    var sig = midasVo.sig;
    var stringA = _getKeyStr(midasVo);
    var sessionKey=global.userMgr.getSessionKey(midasVo.openid);
    var stringSignTemp = stringA + `&org_loc=${global.midasUri + methodName}&method=POST&session_key=${sessionKey}`;
    let mp_sig = crypto.createHmac('sha256', sessionKey).update(stringSignTemp).digest('hex');
    return mp_sig;
}

function _getKeyStr(d: any): string {
    var keyList: Array<string> = [];
    for (var key in d) {
        keyList.push(key);
    }
    keyList.sort();
    var stringA = "";
    for (var i = 0; i < keyList.length - 1; i++) {
        stringA += keyList[i] + "=" + d[keyList[i]] + "&";
    }
    stringA += keyList[i] + "=" + d[keyList[i]];
    return stringA;
}


module.exports = {
    'POST /pay/getBalance': getBalance,
    'POST /pay/pay': pay,
    'POST /pay/present': present,
};