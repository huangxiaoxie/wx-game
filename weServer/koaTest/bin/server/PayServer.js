"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const NetMgr_1 = require("./../mgr/NetMgr");
const Tools_1 = require("../Tools");
const TokenMgr_1 = require("../mgr/TokenMgr");
const crypto = require("crypto");
var writeLog = Tools_1.getLogTool("pay");
var errorLog = Tools_1.getLogTool("pay", true);
function getBalance(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var openid = ctx.request.body.openId;
        var sessionKey = global.userMgr.getSessionKey(openid);
        if (openid && sessionKey) {
            var methodName = "getbalance";
            var balanceVo = _getBlanceData(openid, methodName);
            var url = global.PayUrl + methodName + "?access_token=" + global.Token;
            var data = yield NetMgr_1.sendUrlRequest(url, balanceVo, "POST");
            var d = data;
            var retry = 0;
            while (d.errcode == 40001 && retry < 5) {
                retry++;
                yield TokenMgr_1.refreshToken();
                balanceVo = _getBlanceData(openid, methodName);
                url = global.PayUrl + methodName + "?access_token=" + global.Token;
                data = yield NetMgr_1.sendUrlRequest(url, balanceVo, "POST");
                d = data;
            }
            if (d.errcode == 0) {
                writeLog("查询成功:" + JSON.stringify(d));
                NetMgr_1.sendToUser(ctx.response, { success: true, data: d });
            }
            else {
                NetMgr_1.sendToUser(ctx.response, { success: false, data: d });
                errorLog(d.errmsg + "---" + d.errcode);
            }
        }
        else {
            ctx.response.body = "错误了";
        }
    });
}
function _getBlanceData(openid, methodName) {
    var balanceVo = {
        openid: openid,
        appid: global.APPID,
        offer_id: global.midasId,
        ts: Math.round(Date.now() / 1000),
        zone_id: "1",
        pf: "android",
    };
    balanceVo.sig = getSig(balanceVo, methodName);
    balanceVo.access_token = global.Token;
    balanceVo.mp_sig = getMpSig(balanceVo, methodName);
    return balanceVo;
}
function pay(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var price = ctx.request.body.price;
        var openid = ctx.request.body.openId;
        var sessionKey = global.userMgr.getSessionKey(openid);
        if (!price || !openid || !sessionKey) {
            ctx.response.body = "错误了";
            return;
        }
        var methodName = "pay";
        var ts = Math.round(Date.now() / 1000);
        var payVo = {
            openid: openid,
            appid: global.APPID,
            offer_id: global.midasId,
            ts: ts,
            zone_id: "1",
            pf: "android",
            amt: price,
            bill_no: _getBillNo(openid),
            app_remark: "测试扣费",
        };
        payVo.sig = getSig(payVo, methodName);
        payVo.access_token = global.Token;
        payVo.mp_sig = getMpSig(payVo, methodName);
        Tools_1.debugLog("订单号:" + payVo.bill_no);
        var url = global.PayUrl + methodName + "?access_token=" + global.Token;
        var data = yield NetMgr_1.sendUrlRequest(url, payVo, "POST");
        var d = data;
        if (d.errcode == 0) {
            writeLog("订单" + payVo.bill_no + "扣费成功" + JSON.stringify(d));
            NetMgr_1.sendToUser(ctx.response, { success: true, data: d });
        }
        else {
            NetMgr_1.sendToUser(ctx.response, { success: false, data: d });
            errorLog(d.errmsg + "---" + d.errcode);
        }
    });
}
function present(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var methodName = "present";
        var ts = Math.round(Date.now() / 1000);
        var openId = ctx.request.body.openId;
        var num = ctx.request.body.num;
        var userVo = global.userMgr.getUser(openId);
        if (!userVo) {
            NetMgr_1.sendToUser(ctx.response, { success: false, data: "目标不在线" });
            return;
        }
        var payVo = {
            openid: openId,
            appid: global.APPID,
            offer_id: global.midasId,
            ts: ts,
            zone_id: "1",
            pf: "android",
            present_counts: num,
            bill_no: _getBillNo(openId),
        };
        payVo.sig = getSig(payVo, methodName);
        payVo.access_token = global.Token;
        payVo.mp_sig = getMpSig(payVo, methodName);
        var url = global.PayUrl + methodName + "?access_token=" + global.Token;
        Tools_1.debugLog("订单号:" + payVo.bill_no);
        var data = yield NetMgr_1.sendUrlRequest(url, payVo, "POST");
        var d = data;
        if (d.errcode == 0) {
            writeLog("订单" + payVo.bill_no + "赠送成功" + JSON.stringify(d));
            NetMgr_1.sendToUser(ctx.response, { success: true, data: d });
        }
        else {
            errorLog(d.errmsg + "---" + d.errcode);
            NetMgr_1.sendToUser(ctx.response, { success: true, data: d });
        }
    });
}
function _getBillNo(openid) {
    return "billNo_" + openid + "_" + Date.now();
}
function getSig(midasVo, methodName) {
    var stringA = _getKeyStr(midasVo);
    var stringSignTemp = stringA + `&org_loc=${global.midasUri + methodName}&method=POST&secret=${global.midasKey}`;
    var sig = crypto.createHmac('sha256', global.midasKey).update(stringSignTemp).digest('hex');
    return sig;
}
function getMpSig(midasVo, methodName) {
    var sig = midasVo.sig;
    var stringA = _getKeyStr(midasVo);
    var sessionKey = global.userMgr.getSessionKey(midasVo.openid);
    var stringSignTemp = stringA + `&org_loc=${global.midasUri + methodName}&method=POST&session_key=${sessionKey}`;
    let mp_sig = crypto.createHmac('sha256', sessionKey).update(stringSignTemp).digest('hex');
    return mp_sig;
}
function _getKeyStr(d) {
    var keyList = [];
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
//# sourceMappingURL=PayServer.js.map