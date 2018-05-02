import {Sender, sendToUser,sendUrlRequest} from "./../mgr/NetMgr";
import { iApp } from "../app";
import { debugLog, getLogTool } from "../Tools";
import { mysqlLoaderInst } from "../mgr/TePlayerLoader";
import { SeUser } from "../user/SeUser";
import { SeDBInfoHead, iUserInfo } from "../SeDefine";
declare var global:iApp;
var writeLog=getLogTool("login");
var errorLog=getLogTool("login",true);
var codeCache:any={};

async function loginPost(ctx,next){
    var cmd=ctx.params.method;
    var code=ctx.request.body.code;
    var userInfo:iUserInfo=ctx.request.body.userInfo;
    if(code){
        var data=codeCache[code];
        if(!data){
            var d={appid:global.APPID,secret:global.SECRET,js_code:code,grant_type:"authorization_code"};
            data=await sendUrlRequest("https://api.weixin.qq.com/sns/jscode2session",d,"GET");
        }
        if(!data.errcode){
            codeCache[code]=data;
            var seUser=global.userMgr.getUser(data.openid);
            if(!seUser){
                var dbLoader=mysqlLoaderInst.getLoader(data.openid);
                var success=await dbLoader.asyncLoad();
                seUser=new SeUser(data.openid,dbLoader,<boolean>success);
                global.userMgr.addUser(data.openid,seUser);
            }
            seUser.saveUserInfo(userInfo,data.session_key);
            sendToUser(ctx.response,{success:true,data:data});
            writeLog(JSON.stringify(data));
        }else{
            errorLog(data.errMsg+"---"+data.errcode);
            sendToUser(ctx.response,{success:false,data:data});
        }
    }else{
        ctx.response.body="错误了";
    }
}


async function loginHeart(ctx,next){
    var openId=ctx.request.body.openId;
    var seUser=global.userMgr.getUser(openId);
    if(global.userMgr.heart(openId)){
        sendToUser(ctx,{success:true});
    }else{
        sendToUser(ctx,{success:false});
    }
}

module.exports = {
    'POST /login/:method': loginPost,
    'POST /login/':loginHeart,
};