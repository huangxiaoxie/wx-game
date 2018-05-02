"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = require("events");
const TeRedis_1 = require("../lib/TeRedis");
const SeDefine_1 = require("../SeDefine");
class dbUnit {
    constructor() {
        this.dbID = 0;
        this.uid = 0;
        this.type = '';
        this.plt = 'sdw';
        this.data = {};
    }
}
function createBindInfo(name, t) {
    var obj = (t && new t()) || {};
    var cmdstr_h = 'var ' + name + ' = (function () {\nfunction ' + name + '() {';
    var cmdstr_c = '';
    var cmdstr_e = '}\nreturn ' + name + ';}());\nexports=' + name + ';';
    for (var key in obj) {
        var value = {};
        if (obj[key] instanceof Array) {
            value = JSON.stringify(obj[key]);
        }
        else if (typeof obj[key] == 'string') {
            value = "'" + obj[key] + "'" || "''";
        }
        else if (typeof obj[key] == 'number') {
            value = obj[key] || 0;
        }
        else {
            value = JSON.stringify(obj[key]);
        }
        cmdstr_c += "this." + key + "=" + value + ";\n";
    }
    var s = cmdstr_h + cmdstr_c + cmdstr_e;
    var o = eval(s);
    return o;
}
class DBBindUnit extends events_1.EventEmitter {
    constructor(mgr, uid, table, name, hashType) {
        super();
        this._checkKeys = [];
        this._loaded = false;
        this._mgr = mgr;
        uid = uid.toString();
        this._name = name;
        switch (hashType) {
            case "ReHashList":
            case "ReHash":
                this._redis = TeRedis_1.redistInst.getHash(name + uid);
                break;
            case "ReList":
                this._redis = TeRedis_1.redistInst.getList(name + uid);
                break;
        }
    }
    get db() {
        return this._redis;
    }
    load(checkKey) {
        this._checkKeys.push(checkKey);
        this._redis.isExist(this.check_redis.bind(this));
    }
    check_redis(bExist) {
        if (bExist) {
            this._redis.load(this._loadRedis.bind(this));
        }
        else {
            this._finish_(true);
        }
    }
    _loadRedis(bsucc) {
        this._finish_(bsucc);
    }
    _finish_(bsucc) {
        var checkKey = this._checkKeys.pop() || '';
        this.emit("complete", bsucc, this._name, checkKey);
    }
}
class DBLoader extends events_1.EventEmitter {
    constructor(uid, mgr) {
        super();
        this._loadList = [];
        this._DBList = {};
        this._bSucc = true;
        uid = uid.toString();
        this.uid = uid;
        this._mgr = mgr;
        this._loadList = [];
        this.addDB('userinfo', SeDefine_1.SeDBInfoHead.baseInfo, "ReHash");
    }
    addDB(table, type, hashOrList) {
        var obj = new DBBindUnit(this._mgr, this.uid, table, type, hashOrList);
        obj.on("complete", this.onLoadFinish.bind(this));
        this._DBList[type] = obj;
        return obj;
    }
    load() {
        this._checkKey = Date.now().toString();
        this._bSucc = true;
        this._loadList = [];
        for (var key in this._DBList) {
            var rkDB = this._DBList[key];
            if (rkDB) {
                this._loadList.push(key);
                rkDB.load(this._checkKey);
            }
        }
    }
    asyncLoad() {
        var _self = this;
        return new Promise((resolve, reject) => {
            _self.load();
            _self.once("complete", (bSucc) => {
                resolve(bSucc);
            });
        });
    }
    onLoadFinish(bsucc, flag, checkKey) {
        if (this._checkKey != checkKey)
            return;
        var index = this._loadList.indexOf(flag);
        if (index < 0)
            return;
        this._loadList.splice(index, 1);
        if (!bsucc)
            this._bSucc = false;
        if (this._loadList.length == 0) {
            this._finish(this._bSucc);
        }
    }
    _finish(bSucc) {
        this.emit('complete', bSucc);
    }
    saveInfo() {
        for (var key in this._DBList) {
            var rkDB = this._DBList[key];
            rkDB && rkDB.syncToMysql();
        }
    }
    getDB(type) {
        if (this._DBList.hasOwnProperty(type)) {
            return this._DBList[type].db;
        }
        return null;
    }
}
exports.DBLoader = DBLoader;
class LoaderMgr {
    constructor() {
    }
    getLoader(uid) {
        return new DBLoader(uid, this);
    }
}
exports.mysqlLoaderInst = new LoaderMgr();
//# sourceMappingURL=TePlayerLoader.js.map