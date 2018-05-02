import { EventEmitter } from 'events';
import { ReHash, ReList, redistInst } from '../lib/TeRedis';
import { Hash } from 'crypto';
import { Map } from '../Tools';
import { SeDBInfoHead, iUserInfo } from "../SeDefine";

class dbUnit {
    dbID: number = 0;
    uid: number = 0;
    type: string = '';
    plt:string = 'sdw';
    data = {};
}

function createBindInfo(name: string, t?: any) {
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

class DBBindUnit<T> extends EventEmitter {
    private _redis: ReHash | ReList;
    private _name: string;

    private _checkKeys: Array<string> = [];
    private _loaded: boolean = false;
    private _mgr: LoaderMgr;

    constructor(mgr: LoaderMgr, uid: string | number, table: string, name: string, hashType: "ReHash" | "ReList" | "ReHashList") {
        super();
        this._mgr = mgr;
        uid = uid.toString();
        this._name = name;
        switch (hashType) {
            case "ReHashList":
            case "ReHash": this._redis = redistInst.getHash(name + uid); break;
            case "ReList": this._redis = redistInst.getList(name + uid); break;
        }
    }

    get db() {
        return this._redis;
    }

    load(checkKey: string) {
        this._checkKeys.push(checkKey);

        this._redis.isExist(this.check_redis.bind(this));
    }

    check_redis(bExist: boolean) {
        if (bExist) {
            this._redis.load(this._loadRedis.bind(this));
        }
        else {
            this._finish_(true);
        }
    }

    private _loadRedis(bsucc: boolean) {
        this._finish_(bsucc);
    }

    private _finish_(bsucc: boolean) {
        var checkKey = this._checkKeys.pop() || '';
        this.emit("complete", bsucc, this._name, checkKey);
    }
}


export class DBLoader extends EventEmitter {
    uid: string;

    /**
     * 待加载列表
     */
    private _loadList = [];
    /**
     * 存放所有数据的db对象
     */
    private _DBList: Object = {};

    /**
     * 判断加载是否成功
     */
    private _bSucc: boolean = true;

    /**
     * 加载调用的验证key
     */
    private _checkKey: string;

    private _mgr: LoaderMgr;

    constructor(uid: string | number, mgr: LoaderMgr) {
        super();
        uid = uid.toString();
        this.uid = uid;
        this._mgr = mgr;

        this._loadList = [];
        this.addDB<iUserInfo>('userinfo', SeDBInfoHead.baseInfo, "ReHash");
    }

    addDB<T>(table: string, type: string, hashOrList: "ReHash" | "ReList" | "ReHashList"): DBBindUnit<T> {
        var obj = new DBBindUnit<T>(this._mgr, this.uid, table, type, hashOrList);
        obj.on("complete", this.onLoadFinish.bind(this));
        this._DBList[type] = obj;
        return obj;
    }

    /**
     * 开始加载
     */
    load() {
        this._checkKey = Date.now().toString();
        this._bSucc = true;
        this._loadList = [];
        for (var key in this._DBList) {
            var rkDB = <DBBindUnit<any>>this._DBList[key];
            if (rkDB) {
                this._loadList.push(key);
                rkDB.load(this._checkKey);
            }
        }
    }

    asyncLoad(){
        var _self=this;
        return new Promise((resolve,reject)=>{
            _self.load();
            _self.once("complete",(bSucc)=>{
                resolve(bSucc);
            });
        });
    }

    onLoadFinish(bsucc: boolean, flag: string, checkKey: string) {
        if (this._checkKey != checkKey) return;
        var index = this._loadList.indexOf(flag);
        if (index < 0) return;

        this._loadList.splice(index, 1);
        if (!bsucc) this._bSucc = false;
        if (this._loadList.length == 0) {
            this._finish(this._bSucc);
        }
    }

    private _finish(bSucc: boolean) {
        this.emit('complete', bSucc);
    }

    public saveInfo() {
        for (var key in this._DBList) {
            var rkDB = this._DBList[key];
            rkDB && rkDB.syncToMysql();
        }
    }

    getDB<T>(type: string) {
        if (this._DBList.hasOwnProperty(type)) {
            return <T>this._DBList[type].db;
        }
        return null;
    }

    // // 操作数据库删除邮件
    // delMail(mailid: string) {

    // }
}

class LoaderMgr {
    constructor() {
    }

    getLoader(uid: number | string) {
        return new DBLoader(uid, this);
    }

}

export var mysqlLoaderInst = new LoaderMgr();