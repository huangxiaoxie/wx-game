var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, Promise, generator) {
    return new Promise(function (resolve, reject) {
        generator = generator.call(thisArg, _arguments);
        function cast(value) { return value instanceof Promise && value.constructor === Promise ? value : new Promise(function (resolve) { resolve(value); }); }
        function onfulfill(value) { try { step("next", value); } catch (e) { reject(e); } }
        function onreject(value) { try { step("throw", value); } catch (e) { reject(e); } }
        function step(verb, value) {
            var result = generator[verb](value);
            result.done ? resolve(result.value) : cast(result.value).then(onfulfill, onreject);
        }
        step("next", void 0);
    });
};
import { getLogTool } from "../Tools";
import { Sender } from "../mgr/NetMgr";
var writeLog = getLogTool("token");
var errorLog = getLogTool("token", true);
var tokenHash = {};
function getToken(ctx, next) {
    return __awaiter(this, void 0, Promise, function* () {
        var appId = ctx.request.body.appid;
        var secret = ctx.request.body.secret;
        var tokenVo = searchToken(appId, secret);
        if (!tokenVo || tokenVo.endTime < Date.now()) {
            yield _getToken(appId, secret);
            tokenVo = searchToken(appId, secret);
        }
        ctx.body = tokenVo;
    });
}
function refreshToken(ctx, next) {
    return __awaiter(this, void 0, Promise, function* () {
        var appId = ctx.request.body.appid;
        var secret = ctx.request.body.secret;
        var token = ctx.request.body.token;
        var tokenVo = searchToken(appId, secret);
        if (!tokenVo || tokenVo.token == token) {
            yield _getToken(appId, secret);
            tokenVo = searchToken(appId, secret);
        }
        ctx.body = tokenVo;
    });
}
function _getToken(appid, secret) {
    return __awaiter(this, void 0, Promise, function* () {
        return new Promise((resolve, reject) => {
            var sender = new Sender("https://api.weixin.qq.com/cgi-bin/token", { appid: appid, secret: secret, grant_type: "client_credential" }, "GET", (data) => {
                if (!data.errcode) {
                    writeLog(appid + "-----" + secret + "---" + "token获取成功" + JSON.stringify(data));
                    updateToken(data.access_token, appid, secret, data.expires_in);
                }
                else {
                    errorLog(data.errmsg + "---" + data.errcode);
                }
                resolve(data);
            });
        });
    });
}
function updateToken(token, appid, secret, expires_in) {
    var endTime = Date.now() + expires_in * 1000 - 60 * 1000;
    var tokenKey = appid + "_" + secret;
    var tokenVo = searchToken(appid, secret);
    if (!tokenVo) {
        tokenVo = { appid: appid, secret: secret, token: token, endTime: endTime };
    }
    else {
        tokenVo.token = token;
        tokenVo.endTime = endTime;
    }
    tokenHash[tokenKey] = tokenVo;
}
function searchToken(appid, secret) {
    var tokenKey = appid + "_" + secret;
    return tokenHash[tokenKey];
}
module.exports = {
    'POST /token/getToken': getToken,
    'POST /token/refreshToken': refreshToken,
};
//# sourceMappingURL=TokenServer.js.map