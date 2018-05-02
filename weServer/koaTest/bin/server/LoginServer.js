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
const TePlayerLoader_1 = require("../mgr/TePlayerLoader");
const SeUser_1 = require("../user/SeUser");
var writeLog = Tools_1.getLogTool("login");
var errorLog = Tools_1.getLogTool("login", true);
var codeCache = {};
function loginPost(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var cmd = ctx.params.method;
        var code = ctx.request.body.code;
        var userInfo = ctx.request.body.userInfo;
        if (code) {
            var data = codeCache[code];
            if (!data) {
                var d = { appid: global.APPID, secret: global.SECRET, js_code: code, grant_type: "authorization_code" };
                data = yield NetMgr_1.sendUrlRequest("https://api.weixin.qq.com/sns/jscode2session", d, "GET");
            }
            if (!data.errcode) {
                codeCache[code] = data;
                var seUser = global.userMgr.getUser(data.openid);
                if (!seUser) {
                    var dbLoader = TePlayerLoader_1.mysqlLoaderInst.getLoader(data.openid);
                    var success = yield dbLoader.asyncLoad();
                    seUser = new SeUser_1.SeUser(data.openid, dbLoader, success);
                    global.userMgr.addUser(data.openid, seUser);
                }
                seUser.saveUserInfo(userInfo, data.session_key);
                NetMgr_1.sendToUser(ctx.response, { success: true, data: data });
                writeLog(JSON.stringify(data));
            }
            else {
                errorLog(data.errMsg + "---" + data.errcode);
                NetMgr_1.sendToUser(ctx.response, { success: false, data: data });
            }
        }
        else {
            ctx.response.body = "错误了";
        }
    });
}
function loginHeart(ctx, next) {
    return __awaiter(this, void 0, void 0, function* () {
        var openId = ctx.request.body.openId;
        var seUser = global.userMgr.getUser(openId);
        if (global.userMgr.heart(openId)) {
            NetMgr_1.sendToUser(ctx, { success: true });
        }
        else {
            NetMgr_1.sendToUser(ctx, { success: false });
        }
    });
}
module.exports = {
    'POST /login/:method': loginPost,
    'POST /login/': loginHeart,
};
//# sourceMappingURL=LoginServer.js.map