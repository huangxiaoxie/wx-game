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
const NetMgr_1 = require("./NetMgr");
const app_1 = require("../app");
const Tools_1 = require("../Tools");
var writeLog = Tools_1.getLogTool("login");
var errorLog = Tools_1.getLogTool("login", true);
class TokenMgr {
    constructor() {
    }
    getToken() {
        var sender = new NetMgr_1.Sender(app_1.config.tokenServer.url + "\/token\/getToken", { appid: global.APPID, secret: global.SECRET }, "POST", this._tokenBack.bind(this));
    }
    refreshToken(callBack) {
        var sender = new NetMgr_1.Sender(app_1.config.tokenServer.url + "\/token\/refreshToken", { appid: global.APPID, secret: global.SECRET, token: global.Token }, "POST", callBack);
    }
    _tokenBack(data) {
        if (data) {
            global.Token = data.token;
            setTimeout((this.getToken).bind(this), data.endTime - Date.now());
            writeLog("token获取成功" + data.token);
        }
        else {
            errorLog("token获取失败");
        }
    }
}
exports.TokenMgr = TokenMgr;
function refreshToken() {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            global.tokenMgr.refreshToken((data) => {
                if (data) {
                    global.Token = data.token;
                    setTimeout((global.tokenMgr.getToken).bind(global.tokenMgr), data.endTime - Date.now());
                    writeLog("token获取成功" + data.token);
                }
                else {
                    errorLog("token获取失败");
                    setTimeout((global.tokenMgr.getToken).bind(global.tokenMgr), 2000);
                }
            });
        });
    });
}
exports.refreshToken = refreshToken;
//# sourceMappingURL=TokenMgr.js.map