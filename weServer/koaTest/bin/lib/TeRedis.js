"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const IORedis = require("ioredis");
const events_1 = require("events");
const fs_1 = require("fs");
const crypto_1 = require("crypto");
class RedisSyncType {
}
RedisSyncType.set = "set";
RedisSyncType.hdel = "hdel";
RedisSyncType.hset = "hset";
RedisSyncType.hmset = "hmset";
RedisSyncType.splice = "splice";
RedisSyncType.pop = "pop";
RedisSyncType.push = "push";
RedisSyncType.lset = "lset";
RedisSyncType.ltrim = 'ltrim';
exports.RedisSyncType = RedisSyncType;
var debug = require('debug')('TeRedis');
function func_copy(obj, bFunc = false, dValue) {
    dValue = dValue || {};
    var out = {};
    if (obj instanceof Array) {
        out = [];
    }
    if (typeof obj == 'object') {
        for (var key in obj) {
            var v = obj[key] || dValue[key];
            if (key == 'clone') {
                continue;
            }
            if (typeof v == 'function' && !bFunc) {
                continue;
            }
            if (v == null) {
                out[key] = null;
            }
            else if (typeof v == 'object') {
                out[key] = func_copy(v, false, dValue[key]);
            }
            else {
                out[key] = v;
            }
        }
    }
    else {
        out = obj || dValue;
    }
    return out;
}
class TeRedis extends events_1.EventEmitter {
    constructor() {
        super();
        this._dbnum = 0;
        this.ready = false;
        this._switchIndex = 0;
        this.dbLinkCfgPool = { list: [], dbnum: 0, flags: {} };
        this._redisScripts = [];
    }
    get redisTime() {
        return (Date.now() + this._redisTimeDiff);
    }
    init(ports, dbnum, flags) {
        flags = flags || {};
        if (flags && flags.auth_pass) {
            flags.password = flags.auth_pass;
        }
        flags.db = dbnum;
        this.dbLinkCfgPool.list = ports;
        this.dbLinkCfgPool.dbnum = dbnum;
        this.dbLinkCfgPool.flags = flags;
        this.connect(this.dbLinkCfgPool.list, this.dbLinkCfgPool.dbnum, this.dbLinkCfgPool.flags);
        this.on('ready', () => { });
        this.on('error', (err) => { debug('TeRedis' + err); });
    }
    onready(err) {
        if (err) {
            this.emit('error', err);
        }
        else if (this._dbnum) {
            this._redisClient.select(this._dbnum, (function (err, res) {
                if (!err) {
                    this.ready = true;
                    this._redisClient.send_command('time', [], ((err, data) => {
                        if (err) {
                            this.emit('error', err);
                        }
                        else {
                            this._redisTimeDiff = Date.now() - (data[0] || 0) * 1000;
                            this.emit('ready', err);
                        }
                    }).bind(this));
                }
                else {
                    this.emit('error', err);
                }
            }).bind(this));
        }
        else {
            this.ready = true;
            this.emit('ready', err);
        }
    }
    connect(list, dbnum, flags) {
        flags = flags || { connect_timeout: 10000 };
        if (flags && flags.auth_pass) {
            flags.password = flags.auth_pass;
        }
        this._dbnum = dbnum || this._dbnum;
        flags.db = dbnum;
        if (list.length > 1) {
            this._redisClient = new IORedis.Cluster(list, { redisOptions: flags });
        }
        else {
            var one = list[0];
            this._redisClient = new IORedis(one.port, one.host, flags);
        }
        this._redisClient.on('ready', this.onready.bind(this));
        this._redisClient.on('reconnecting', function (err, reply) {
            debug('reconnecting' + err + '|' + reply);
        });
        this._redisClient.on('disconnect', (function () {
            this._switchIndex++;
            this.connect(this.dbLinkCfgPool.list, this.dbLinkCfgPool.dbnum, this.dbLinkCfgPool.flags);
            debug('disconnect');
        }).bind(this));
        this._redisClient.on('error', (function (err) {
            debug(err);
        }).bind(this));
    }
    get redisClient() {
        return this._redisClient;
    }
    getHash(key, bindClass) {
        var newQuery = new ReHash(this, key, bindClass);
        return newQuery;
    }
    getString(key) {
        var newQuery = new ReString(this, key);
        return newQuery;
    }
    getList(key) {
        var newQuery = new ReList(this, key);
        return newQuery;
    }
    getHashMember(key, subKey) {
        subKey = JSON.stringify(subKey);
        var newQuery = new ReHashMember(this, key, subKey);
        return newQuery;
    }
    getSet(key) {
        var newQuery = new ReSet(this, key);
        return newQuery;
    }
    getSortedSet(key, maxNum) {
        var newQuery = new ReSortedSet(this, key, maxNum);
        return newQuery;
    }
    eval(file, args, callback) {
        var rkScrpt = this._getScript(file);
        rkScrpt.eval(args, callback);
    }
    _getScript(file) {
        for (var key in this._redisScripts) {
            var obj = this._redisScripts[key];
            if (obj.filename == file) {
                return obj;
            }
        }
        var newScrpt = new ReScript(this, file);
        this._redisScripts.push(newScrpt);
        return newScrpt;
    }
    _pub_ret(err, reply) {
        if (err) {
            debug(err);
        }
    }
    publish(chanel, data) {
        this._redisClient.publish(chanel, data, this._pub_ret.bind(this));
    }
}
exports.TeRedis = TeRedis;
class ReScript {
    constructor(redisClient, file) {
        this._redisClient = redisClient.redisClient;
        this.filename = file;
        this._cache = [];
        fs_1.readFile(this.filename, 'utf8', this._onLoadText.bind(this));
    }
    eval(args, cb) {
        if (this.err) {
            cb(this.err);
        }
        else {
            if (this.sha1) {
                var oprArgs = [this.sha1].concat(args);
                this._redisClient.evalsha(oprArgs, cb);
            }
            else {
                this._cache.push({ ag: args, cb: cb });
            }
        }
    }
    _onLoadText(err, data) {
        if (err) {
            this._finish('file err');
            return;
        }
        this._luaText = data;
        this._redisClient.script("EXISTS", this._makeSha1(), this._onRedisExists.bind(this));
    }
    _finish(err) {
        this.err = err;
        if (this.err) {
            for (var key in this._cache) {
                var obj = this._cache[key];
                obj.cb(this.err);
            }
        }
        else {
            for (var key in this._cache) {
                var obj = this._cache[key];
                this.eval(obj.ag, obj.cb);
            }
        }
        this._cache = [];
        this._sha1 = null;
        this._luaText = null;
    }
    _makeSha1() {
        if (!this._sha1) {
            var sha1 = crypto_1.createHash('sha1');
            sha1.update(this._luaText);
            this._sha1 = sha1.digest('hex');
        }
        return this._sha1;
    }
    _onRedisExists(err, rep) {
        if (err) {
            this._finish('exists err');
        }
        else {
            if (rep && rep[0]) {
                this.sha1 = this._makeSha1();
                this._finish();
            }
            else {
                this._redisClient.script("LOAD", this._luaText, this._onRedisLoad.bind(this));
            }
        }
    }
    _onRedisLoad(err, rep) {
        if (err) {
            this._finish('load faild');
        }
        else {
            this.sha1 = rep;
            this._finish();
        }
    }
}
exports.ReScript = ReScript;
class ReBase {
    constructor(redisClient, key, _bindClass) {
        this.bNoSave = false;
        this._isArray = false;
        this._redisClient = redisClient.redisClient;
        this.key = key;
        this._bindClass = _bindClass;
    }
    get redisClient() {
        return this._redisClient;
    }
    set timeOut(time) {
        if (this._redisClient) {
            this._redisClient.expire(this.key, time, () => { });
        }
    }
    send_command(cmd, arg, callback) {
        if (!this._redisClient) {
            return false;
        }
        if (!this.bNoSave) {
            this.redisClient.send_command(cmd, arg, callback);
        }
        return true;
    }
    onError(err) {
        if (err) {
            debug(err);
        }
    }
    saveCb(type, ...args) { }
    ;
    load(cb) { }
    isExist(cb) {
        this.redisClient.exists(this.key, (function (_cb, err, reply) {
            if (_cb) {
                _cb(reply == 1);
            }
        }).bind(this, cb));
    }
    clearAll() {
        this.redisClient.del(this.key);
        if (this._isArray) {
            this._value = [];
        }
        else {
            this._value = {};
        }
    }
}
exports.ReBase = ReBase;
class ReString extends ReBase {
    constructor(redisClient, key) {
        super(redisClient, key);
        this._value = 0;
    }
    load(callback) {
        this.send_command('get', [this.key], this.onload.bind(this, callback));
    }
    onload(callback, err, reply) {
        this._value = 0;
        if (!err && reply) {
            this._value = func_copy(reply);
        }
        if (callback) {
            callback(!err, this);
        }
    }
    set(value) {
        value = JSON.stringify(value);
        if (this._value == value) {
            return;
        }
        this._value = value;
        this.send_command('set', [this.key, this._value], this.onError);
        this.saveCb(RedisSyncType.set, value);
    }
    get value() {
        return JSON.parse(this._value);
    }
}
exports.ReString = ReString;
class ReList extends ReBase {
    constructor(redisClient, key) {
        super(redisClient, key);
        this._value = [];
        this._isArray = true;
    }
    load(callback) {
        this.redisClient.lrange(this.key, 0, -1, this.onload.bind(this, callback));
    }
    onload(callback, err, reply) {
        this._value = [];
        if (!err && reply) {
            this._value = func_copy(reply);
        }
        if (callback) {
            callback(!err, this);
        }
    }
    push_back(...values) {
        var dbV = [this.key];
        for (var key in values) {
            var vv = JSON.stringify(values[key]);
            dbV.push(vv);
            this._value.push(vv);
        }
        this.send_command('RPUSH', dbV, this.onError);
        this.saveCb(RedisSyncType.push, dbV.slice(1, dbV.length));
    }
    find(key, findValue) {
        var values = this.value;
        for (var i = 0; i < values.length; i++) {
            if (values[i][key] == findValue) {
                return { index: i, value: values[i] };
            }
        }
        return null;
    }
    pop_front() {
        this.send_command('LPOP', [this.key], this.onError);
        this.saveCb(RedisSyncType.pop);
        return JSON.parse(this._value.shift());
    }
    set(index, value) {
        if (index >= this._value.length) {
            return false;
        }
        value = JSON.stringify(value);
        if (this._value[index] == value) {
            return true;
        }
        this._value[index] = value;
        this.send_command('LSET', [this.key, index, value], this.onError);
        this.saveCb(RedisSyncType.lset, index, value);
        return true;
    }
    Del(value) {
        value = JSON.stringify(value);
        for (var key in this._value) {
            if (this._value[key] == value) {
                this._value.splice(key, 1);
                this.saveCb(RedisSyncType.splice, key, 1);
                this.send_command('LREM', [this.key, 1, value], this.onError);
                break;
            }
        }
    }
    get value() {
        var out = [];
        for (var key in this._value) {
            out[key] = JSON.parse(this._value[key]);
        }
        return out;
    }
}
exports.ReList = ReList;
class ReHashMember extends ReBase {
    constructor(redisClient, key, subKey) {
        super(redisClient, key);
        this.subKey = subKey;
        this._value = null;
    }
    load(callback) {
        this.send_command('hget', [this.key, this.subKey], this.onload.bind(this, callback));
    }
    onload(callback, err, reply) {
        this._value = null;
        if (!err && reply) {
            this._value = func_copy(reply);
        }
        if (callback) {
            callback(!err, this);
        }
    }
    save(value) {
        value = JSON.stringify(value);
        if (this._value == value) {
            return true;
        }
        this._value = value;
        this.send_command('hset', [this.key, this.subKey, value], this.onError);
        this.saveCb(RedisSyncType.hset, this.subKey, value);
        return true;
    }
    get value() {
        try {
            return JSON.parse(this._value);
        }
        catch (e) {
            return null;
        }
    }
    del() {
        this.send_command('hdel', [this.key, this.subKey], this.onError);
        this.saveCb(RedisSyncType.hdel, this.subKey);
    }
}
exports.ReHashMember = ReHashMember;
class SortedSetUnit {
    constructor() {
        this.score = 0;
        this.id = null;
    }
}
exports.SortedSetUnit = SortedSetUnit;
class ReSortedSet extends ReBase {
    constructor(redisClient, key, maxNum = 0, bDesc = true) {
        super(redisClient, key);
        this._maxNum = 0;
        this._bDesc = true;
        this._value = [];
        this._bDesc = bDesc;
        this._maxNum = maxNum;
        this._isArray = true;
    }
    load(callback) {
        if (this._bDesc) {
            if (this._maxNum > 0) {
                this.send_command('zrevrange', [this.key, 0, this._maxNum, 'withscores'], this.onload.bind(this, callback));
            }
            else {
                this.send_command('zrevrange', [this.key, 0, -1, 'withscores'], this.onload.bind(this, callback));
            }
        }
        else {
            if (this._maxNum > 0) {
                this.send_command('zrange', [this.key, 0, this._maxNum, 'withscores'], this.onload.bind(this, callback));
            }
            else {
                this.send_command('zrange', [this.key, 0, -1, 'withscores'], this.onload.bind(this, callback));
            }
        }
    }
    onload(callback, err, reply) {
        this._value = [];
        if (!err && reply) {
            var Unit = null;
            for (var key in reply) {
                if (!Unit) {
                    Unit = new SortedSetUnit();
                    var objValue = JSON.parse(reply[key]);
                    Unit.value = reply[key];
                    if (objValue.hasOwnProperty('id')) {
                        Unit.id = objValue.id;
                    }
                }
                else {
                    Unit.score = reply[key];
                    this._value.push(Unit);
                    Unit = null;
                }
            }
        }
        if (callback) {
            callback(!err, this);
        }
    }
    add(score, value) {
        if (this._bDesc) {
            if (this._maxNum > 0 && this._maxNum == this._value.length) {
                var rkLeastUnit = this._value[this._maxNum - 1];
                if (rkLeastUnit && rkLeastUnit.score > score) {
                    return false;
                }
            }
        }
        else {
            if (this._maxNum > 0 && this._maxNum == this._value.length) {
                var rkLeastUnit = this._value[this._maxNum - 1];
                if (rkLeastUnit && rkLeastUnit.score < score) {
                    return false;
                }
            }
        }
        var oldUnit = null;
        var id = value.id;
        value = JSON.stringify(value);
        for (var key in this._value) {
            var rkUnit = this._value[key];
            if (!rkUnit) {
                continue;
            }
            if (id && rkUnit.id != undefined && rkUnit.id) {
                if (id != rkUnit.id) {
                    continue;
                }
            }
            else {
                if (rkUnit.value != value) {
                    continue;
                }
            }
            if (rkUnit.score == score) {
                if (rkUnit.value == value) {
                    return false;
                }
                else {
                    var multi = this.redisClient.multi();
                    multi.zrem(this.key, rkUnit.value);
                    multi.zadd(this.key, score.toString(), value);
                    multi.exec(this.onError);
                    rkUnit.value = value;
                    return true;
                }
            }
            oldUnit = rkUnit;
            this._value.splice(key, 1);
            break;
        }
        if (oldUnit) {
            var multi = this.redisClient.multi();
            multi.zrem(this.key, rkUnit.value);
            multi.zadd(this.key, score.toString(), value);
            multi.exec(this.onError);
        }
        else {
            this.send_command('zadd', [this.key, score, value], this.onError);
        }
        var newUnit = new SortedSetUnit();
        newUnit.id = id;
        newUnit.score = score;
        newUnit.value = value;
        var index = orderListFind(this._value, 'score', newUnit.score + (this._bDesc ? 1 : -1), this._bDesc);
        if (this._bDesc) {
            for (var i = index; i < this._value.length; i++) {
                var rkUnit = this._value[i];
                if (!rkUnit)
                    continue;
                if (rkUnit.score > newUnit.score) {
                    continue;
                }
                if (rkUnit.score < newUnit.score) {
                    this._value.splice(i, 0, newUnit);
                    newUnit = null;
                    break;
                }
                if (newUnit.id && rkUnit.id) {
                    if (newUnit.id < rkUnit.id) {
                        continue;
                    }
                }
                else {
                    if (newUnit.value < rkUnit.value) {
                        continue;
                    }
                }
                this._value.splice(i, 0, newUnit);
                newUnit = null;
                break;
            }
            if (newUnit) {
                this._value.push(newUnit);
            }
        }
        else {
            for (var i = index; index < this._value.length; i++) {
                var rkUnit = this._value[i];
                if (!rkUnit)
                    continue;
                if (rkUnit.score < newUnit.score) {
                    continue;
                }
                if (rkUnit.score > newUnit.score) {
                    this._value.splice(i, 0, newUnit);
                    newUnit = null;
                    break;
                }
                if (newUnit.id && rkUnit.id) {
                    if (newUnit.id > rkUnit.id) {
                        continue;
                    }
                }
                else {
                    if (newUnit.value > rkUnit.value) {
                        continue;
                    }
                }
                this._value.splice(i, 0, newUnit);
                newUnit = null;
                break;
            }
            if (newUnit) {
                this._value.push(newUnit);
            }
        }
        return true;
    }
    del(value) {
        var id;
        if (value) {
            id = value.id;
        }
        value = JSON.stringify(value);
        for (var key in this._value) {
            var rkUnit = this._value[key];
            if (!rkUnit) {
                continue;
            }
            if (id && rkUnit.id != undefined && rkUnit.id) {
                if (id != rkUnit.id) {
                    continue;
                }
            }
            else {
                if (rkUnit.value != value) {
                    continue;
                }
            }
            this.send_command('zrem', [this.key, rkUnit.value], this.onError);
            this._value.splice(key, 1);
            break;
        }
        return true;
    }
    get value() {
        var out = [];
        for (var key in this._value) {
            var rkUnit = this._value[key];
            if (rkUnit) {
                out.push({ score: rkUnit.score, value: JSON.parse(rkUnit.value) });
            }
        }
        return out;
    }
    get valueDesc() {
        var out = this.value;
        out.reverse();
        return out;
    }
    getRange(ibegin = 0, iend = -1) {
        if (this._value.length == 0) {
            return [];
        }
        ibegin = ((ibegin < 0) ? (this._value.length + ibegin) : ibegin);
        if (iend >= this._value.length && this._value.length > 0) {
            iend = this._value.length - 1;
        }
        iend = ((iend < 0) ? (this._value.length + iend) : iend);
        var out = [];
        if (ibegin == 0 && iend == this._value.length - 1) {
            return this.value;
        }
        if (ibegin > iend) {
            for (var i = ibegin; i < this._value.length; i++) {
                var rkUnit = this._value[i];
                if (rkUnit) {
                    out.push({ score: rkUnit.score, value: JSON.parse(rkUnit.value) });
                }
            }
            for (var i = 0; i < iend; i++) {
                var rkUnit = this._value[i];
                if (rkUnit) {
                    out.push({ score: rkUnit.score, value: JSON.parse(rkUnit.value) });
                }
            }
        }
        else if (ibegin < iend) {
            for (var i = ibegin; i < iend; i++) {
                var rkUnit = this._value[i];
                if (rkUnit) {
                    out.push({ score: rkUnit.score, value: JSON.parse(rkUnit.value) });
                }
            }
        }
        return out;
    }
    getRangeDesc(ibegin = 1, iend = 0) {
        var out = this.getRange(-iend, -ibegin);
        out.reverse();
        return out;
    }
}
exports.ReSortedSet = ReSortedSet;
function compareList(a, key, vlaue) {
    if (!a || !a.hasOwnProperty(key))
        return false;
    if (a[key] > vlaue)
        return true;
    return false;
}
function orderListFind(list, key, value, desc = false) {
    if (list.length == 0)
        return 0;
    var small = -1, big = list.length;
    while (true) {
        if (small >= big) {
            return compareList(list[big], key, value) ? small : small + 1;
        }
        else if (small + 1 == big) {
            return small;
        }
        else {
            var center = Math.round((small + big) / 2);
            if (desc) {
                compareList(list[center], key, value) ? small = center : big = center;
            }
            else {
                compareList(list[center], key, value) ? big = center : small = center;
            }
        }
    }
}
class ReSet extends ReBase {
    constructor(redisClient, key) {
        super(redisClient, key);
        this._value = {};
    }
    load(callback) {
        this.send_command('smembers', [this.key], this.onload.bind(this, callback));
    }
    onload(callback, err, reply) {
        this._value = {};
        if (!err && reply) {
            this._value = func_copy(reply);
        }
        if (callback) {
            callback(!err, this);
        }
    }
    add(value) {
        value = JSON.stringify(value);
        if (this._value.hasOwnProperty(value)) {
            return true;
        }
        this.send_command('sadd', [this.key, value], this.onError);
        this._value[value] = true;
        return true;
    }
    has(value) {
        value = JSON.stringify(value);
        if (this._value.hasOwnProperty(value)) {
            return true;
        }
        return false;
    }
    del(value) {
        if (!this._value.hasOwnProperty(value)) {
            return true;
        }
        this.send_command('srem', [this.key, value], this.onError);
        delete this._value[value];
        return true;
    }
    get value() {
        var out = {};
        for (var key in this._value) {
            out[JSON.parse[key]] = JSON.parse(this._value[key]);
        }
        return out;
    }
}
exports.ReSet = ReSet;
class ifReHash {
}
exports.ifReHash = ifReHash;
class ReHash extends ReBase {
    constructor(redisClient, key, bindClass) {
        super(redisClient, key, bindClass);
        this._value = {};
        if (bindClass) {
            var o = new bindClass();
            var keys = Object.keys(o);
            for (var ikey in keys) {
                var v_k = keys[ikey];
                Object.defineProperty(this, v_k, {
                    get: (function (v_v, d_v) {
                        return this.get(v_v) || d_v;
                    }).bind(this, v_k, o[v_k]),
                    set: (function (v_v, v) {
                        this.save(v_v, v);
                    }).bind(this, v_k),
                    enumerable: true,
                    configurable: true
                });
                var v = JSON.stringify(o[v_k]);
                this._value[JSON.stringify(v_k)] = v;
            }
        }
    }
    load(callback) {
        this.send_command('hgetall', [this.key], this.onload.bind(this, callback));
    }
    reload(key, callback, ...arg) {
        key = JSON.stringify(key);
        this.send_command('hget', [this.key, key], this.onreload.bind(this, callback, key, arg));
    }
    onreload(callback, key, arg, err, reply) {
        if (!err && reply) {
            this._value[key] = func_copy(reply);
        }
        if (callback) {
            callback(!err, this, arg);
        }
    }
    onload(callback, err, reply) {
        this._value = {};
        var dv = this._bindClass ? (new this._bindClass()) : {};
        var o = {};
        for (var key in dv) {
            var vv = dv[key];
            if (typeof vv == 'function') {
                continue;
            }
            o[JSON.stringify(key)] = JSON.stringify(dv[key]);
        }
        if (!err && reply) {
            this._value = func_copy(reply, false, o);
        }
        else {
            this._value = o;
        }
        if (callback) {
            callback(!err, this);
        }
    }
    msave(a) {
        var list = [this.key];
        for (var i = 0; i < a.length; i++) {
            var value = JSON.stringify(a[i].v);
            var key = JSON.stringify(a[i].k);
            if (this._value.hasOwnProperty(key) && this._value[key] == value) {
                continue;
            }
            this._value[key] = value;
            list.push(key);
            list.push(value);
        }
        if (list.length <= 0)
            return;
        this.send_command('hmset', list, this.onError);
        list.splice(0, 1);
        this.saveCb(RedisSyncType.hmset, ...list);
        return true;
    }
    save(key, value) {
        value = JSON.stringify(value);
        key = JSON.stringify(key);
        if (this._value.hasOwnProperty(key) && this._value[key] == value) {
            return false;
        }
        this._value[key] = value;
        this.send_command('hset', [this.key, key, value], this.onError);
        this.saveCb(RedisSyncType.hset, key, value);
        return true;
    }
    del(key) {
        var delKeys = [];
        if (key instanceof Array) {
            for (var i = 0; i < key.length; i++) {
                var skey = JSON.stringify(key[i]);
                if (!this._value.hasOwnProperty(skey)) {
                    continue;
                }
                delete this._value[skey];
                delKeys.push(skey);
            }
        }
        else {
            key = JSON.stringify(key);
            if (!this._value.hasOwnProperty(key)) {
                return;
            }
            delete this._value[key];
            delKeys.push(key);
        }
        this.send_command('hdel', [this.key, ...delKeys], this.onError);
        this.saveCb(RedisSyncType.hdel, ...delKeys);
    }
    get(key) {
        key = JSON.stringify(key);
        if (this._value.hasOwnProperty(key)) {
            return JSON.parse(this._value[key]);
        }
        return null;
    }
    get value() {
        var out = {};
        for (var key in this._value) {
            try {
                out[JSON.parse(key)] = JSON.parse(this._value[key]);
            }
            catch (e) {
            }
        }
        return out;
    }
}
exports.ReHash = ReHash;
class TeChannel extends events_1.EventEmitter {
    constructor(port, host, flags) {
        super();
        this.listenChannels = [];
        var a = {
            host: host,
            port: port,
        };
        this.connect([a], flags);
    }
    get isListener() {
        if (this.listenChannels.length > 0) {
            return true;
        }
        return false;
    }
    connect(links, flags) {
        flags = flags || { connect_timeout: 10000 };
        if (links.length > 1) {
            this._redisClient = new IORedis.Cluster(links, flags);
        }
        else {
            var one = links[0];
            this._redisClient = new IORedis(one.port, one.host, flags);
        }
        this._redisClient.on('ready', this.onready.bind(this));
        this._redisClient.on('reconnecting', function (err, reply) {
            debug('reconnecting' + err + '|' + reply);
        });
        this._redisClient.on('disconnect', (function () {
            debug('disconnect');
        }).bind(this));
        this._redisClient.on('message', this._onMessage.bind(this));
        this._redisClient.on('pmessage', this._onPMessage.bind(this));
        this._redisClient.on('error', (function (err) {
            this.emit('error', err);
            debug(err);
        }).bind(this));
        this._redisClient.on('subscribe', this._sub_.bind(this));
        this._redisClient.on('psubscribe', this._sub_.bind(this));
        this._redisClient.on('unsubscribe', this._unsub_.bind(this));
        this._redisClient.on('punsubscribe', this._unsub_.bind(this));
    }
    _onMessage(channel, data) {
        this.emit('message', channel, channel, data);
    }
    _onPMessage(channel, rchannel, data) {
        this.emit('message', channel, rchannel, data);
    }
    onready(err) {
        if (err) {
            this.emit('error', err);
            debug(err);
        }
        else {
            this.ready = true;
            this.emit('ready', err);
        }
    }
    _sub_(channel, count) {
        this.listenChannels.push(channel);
    }
    _unsub_(channel, count) {
        var index = this.listenChannels.indexOf(channel);
        if (index >= 0) {
            this.listenChannels.splice(index, 1);
        }
    }
    _sub_unsub_ret(sub, err, reply) {
        if (err) {
            debug(err);
        }
    }
    subscribe(chanel) {
        if (typeof chanel == 'string') {
            if (chanel.indexOf('*') >= 0) {
                this._redisClient.psubscribe(chanel, this._sub_unsub_ret.bind(this, true));
            }
            else {
                this._redisClient.subscribe(chanel, this._sub_unsub_ret.bind(this, true));
            }
        }
        else if (chanel instanceof Array) {
            var sub = [], psub = [];
            for (var i = 0; i < chanel.length; i++) {
                var aChannel = chanel[i];
                if (!aChannel || aChannel.length == 0)
                    continue;
                if (aChannel.indexOf('*') >= 0) {
                    psub.push(aChannel);
                }
                else {
                    sub.push(aChannel);
                }
            }
            if (sub.length > 0) {
                this._redisClient.subscribe(...chanel);
            }
            if (psub.length > 0) {
                this._redisClient.psubscribe(...chanel);
            }
        }
    }
    unsubscribe(chanel) {
        if (typeof chanel == 'string') {
            if (chanel.indexOf('*') >= 0) {
                this._redisClient.punsubscribe(chanel);
            }
            else {
                this._redisClient.unsubscribe(chanel);
            }
        }
        else if (chanel instanceof Array) {
            var sub = [], psub = [];
            for (var i = 0; i < chanel.length; i++) {
                var aChannel = chanel[i];
                if (!aChannel || aChannel.length == 0)
                    continue;
                if (aChannel.indexOf('*') >= 0) {
                    psub.push(aChannel);
                }
                else {
                    sub.push(aChannel);
                }
            }
            if (sub.length > 0) {
                this._redisClient.unsubscribe(...chanel);
            }
            if (psub.length > 0) {
                this._redisClient.punsubscribe(...chanel);
            }
        }
    }
    _pub_ret(err, reply) {
        if (err) {
            debug(err);
        }
    }
    quit() {
        this._redisClient.quit((err, state) => {
            if (err) {
                debug(err);
            }
            else {
                this.listenChannels = [];
            }
        });
    }
    publish(chanel, data) {
        if (this.isListener) {
            return false;
        }
        return this._redisClient.publish(chanel, data, this._pub_ret.bind(this));
    }
}
exports.TeChannel = TeChannel;
exports.redistInst = new TeRedis();
//# sourceMappingURL=TeRedis.js.map