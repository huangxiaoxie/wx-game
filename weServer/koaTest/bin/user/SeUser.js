"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const TePlayerLoader_1 = require("../mgr/TePlayerLoader");
const SeDefine_1 = require("../SeDefine");
class SeBaseInfo {
    constructor(obj = null) {
        this.openId = null;
        this.seesionKey = null;
        this.userInfo = null;
        var jsonObj = obj;
        if (!obj) {
            return;
        }
        for (var key in jsonObj) {
            if (this.hasOwnProperty(key)) {
                this[key] = jsonObj[key];
            }
        }
    }
}
exports.SeBaseInfo = SeBaseInfo;
class SeUser {
    constructor(openId, db, dbLoaded) {
        this.updateTime = 0;
        this._openId = openId;
        if (!db) {
            this._dbLoader = TePlayerLoader_1.mysqlLoaderInst.getLoader(openId);
        }
        else {
            this._dbLoader = db;
            this._loaderComplete(dbLoaded);
        }
    }
    loadReload() {
        this._dbLoader.load();
        this._dbLoader.once('complete', this._loaderComplete.bind(this));
    }
    getDBValue(type) {
        var vvv = null;
        var r = this._dbLoader.getDB(type);
        if (r) {
            vvv = r.value;
        }
        return vvv;
    }
    saveUserInfo(userInfo, session_key) {
        var userHash = this.getDBValue(SeDefine_1.SeDBInfoHead.baseInfo);
        this._baseInfo.seesionKey = session_key;
        this._baseInfo.userInfo = userInfo;
        global.userMgr.updateSessionKey(this._openId, session_key);
        this.saveBaseInfo();
    }
    saveBaseInfo(savekey = null) {
        var userHash = this._dbLoader.getDB(SeDefine_1.SeDBInfoHead.baseInfo);
        if (!userHash)
            return;
        if (savekey) {
            if (savekey instanceof Array) {
                var lists = [];
                for (var i = 0; i < savekey.length; i++) {
                    var rkey = savekey[i];
                    if (this._baseInfo.hasOwnProperty(rkey)) {
                        lists.push({ k: rkey, v: this._baseInfo[rkey] });
                    }
                }
                userHash.msave(lists);
            }
            else {
                if (this._baseInfo.hasOwnProperty(savekey)) {
                    userHash.save(savekey, this._baseInfo[savekey]);
                }
            }
        }
        else {
            var lists = [];
            for (var key in this._baseInfo) {
                var rkValue = this._baseInfo[key];
                if (rkValue) {
                    lists.push({ k: key, v: this._baseInfo[key] });
                }
                else {
                    userHash.del(key);
                }
            }
            userHash.msave(lists);
        }
    }
    get sessionKey() {
        return this._baseInfo && this._baseInfo.seesionKey;
    }
    leaveGame() {
        this.saveBaseInfo();
    }
    _loaderComplete(success) {
        if (success) {
            var userHash = this._dbLoader.getDB(SeDefine_1.SeDBInfoHead.baseInfo);
            this._baseInfo = new SeBaseInfo(userHash.value);
            if (!this._baseInfo.openId) {
                this._baseInfo.openId = this._openId;
            }
        }
        else {
            this._baseInfo = new SeBaseInfo({ openId: this._openId });
        }
    }
}
exports.SeUser = SeUser;
//# sourceMappingURL=SeUser.js.map