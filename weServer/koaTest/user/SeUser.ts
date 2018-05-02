import { DBLoader, mysqlLoaderInst } from "../mgr/TePlayerLoader";
import { ReHash, ReList } from "../lib/TeRedis";
import { SeDBInfoHead, iUserInfo } from "../SeDefine";
import { iApp } from "../app";
declare var global: iApp;
export class SeBaseInfo {
    openId: string = null;
    seesionKey: string = null;
    userInfo: iUserInfo = null;
    public constructor(obj = null) {
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
export class SeUser {
    private _openId: string;
    private _dbLoader: DBLoader;

    private _baseInfo: SeBaseInfo;
    public updateTime: number = 0;
    constructor(openId: string, db?: DBLoader, dbLoaded?: boolean) {
        this._openId = openId;
        if (!db) {
            this._dbLoader = mysqlLoaderInst.getLoader(openId);
        } else {
            this._dbLoader = db;
            this._loaderComplete(dbLoaded);
        }
    }

    public loadReload() {
        this._dbLoader.load();
        this._dbLoader.once('complete', this._loaderComplete.bind(this));
    }

    getDBValue(type: string) {
        var vvv = null;
        var r = this._dbLoader.getDB<ReHash | ReList>(type);
        if (r) {
            vvv = r.value;
        }
        return vvv;
    }

    public saveUserInfo(userInfo: iUserInfo, session_key: string) {
        var userHash: ReHash = this.getDBValue(SeDBInfoHead.baseInfo);
        this._baseInfo.seesionKey = session_key;
        this._baseInfo.userInfo = userInfo;
        global.userMgr.updateSessionKey(this._openId, session_key);
        this.saveBaseInfo();
    }

    public saveBaseInfo(savekey: string | string[] = null) {
        var userHash: ReHash = this._dbLoader.getDB(SeDBInfoHead.baseInfo);
        if (!userHash) return;
        if (savekey) {
            if (savekey instanceof Array) {
                var lists: Array<{ k: string, v: any }> = [];
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
            var lists: Array<{ k: string, v: any }> = [];
            for (var key in this._baseInfo) {
                var rkValue = this._baseInfo[key];
                if (rkValue) {
                    lists.push({ k: key, v: this._baseInfo[key] })
                }
                else {
                    userHash.del(key);
                }
            }
            userHash.msave(lists);
        }
    }

    public get sessionKey(): string {
        return this._baseInfo && this._baseInfo.seesionKey;
    }

    public leaveGame() {
        // 离开的时候再保存一次数据
        this.saveBaseInfo();
    }

    private _loaderComplete(success: boolean) {
        if (success) {
            var userHash: ReHash = this._dbLoader.getDB(SeDBInfoHead.baseInfo);
            this._baseInfo = new SeBaseInfo(userHash.value);
            if (!this._baseInfo.openId) {
                this._baseInfo.openId = this._openId;
            }
        } else {
            this._baseInfo = new SeBaseInfo({ openId: this._openId });
        }
    }
}