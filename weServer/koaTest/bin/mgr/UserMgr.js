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
const SeUser_1 = require("../user/SeUser");
const TePlayerLoader_1 = require("./TePlayerLoader");
class UserMgr {
    constructor() {
        this._userHash = {};
        this._sessionKeyHash = {};
        setTimeout((() => {
            var now = Date.now();
            for (var key in this._userHash) {
                var seUser = this._userHash[key];
                if (now - seUser.updateTime > 120000) {
                    seUser.leaveGame();
                    delete this._userHash[key];
                }
            }
        }).bind(this), global.heartTime);
    }
    addUser(openId, seUser) {
        this._userHash[openId] = seUser;
        this._sessionKeyHash[openId] = seUser.sessionKey;
        seUser.updateTime = Date.now();
    }
    heart(openId) {
        var seUser = this.getUser(openId);
        if (seUser) {
            seUser.updateTime = Date.now();
            return true;
        }
        else {
            return false;
        }
    }
    updateSessionKey(openId, key) {
        this._sessionKeyHash[openId] = key;
    }
    getSessionKey(openId) {
        return this._sessionKeyHash[openId];
    }
    getUser(openId) {
        return this._userHash[openId];
    }
}
exports.UserMgr = UserMgr;
function loginUser(user, userInfo) {
    return __awaiter(this, void 0, void 0, function* () {
        var seUser = global.userMgr.getUser(user.openId);
        if (!seUser) {
            var dbLoader = TePlayerLoader_1.mysqlLoaderInst.getLoader(user.openId);
            var success = yield dbLoader.asyncLoad();
            seUser = new SeUser_1.SeUser(user.openId, dbLoader, success);
        }
    });
}
exports.loginUser = loginUser;
//# sourceMappingURL=UserMgr.js.map