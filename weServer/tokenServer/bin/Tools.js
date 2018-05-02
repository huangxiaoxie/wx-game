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
import * as path from "path";
export function debugLog(msg) {
    if (global.Debug) {
        var d = new Date();
        console.log(d.toTimeString() + ":" + msg + "\r\n");
    }
}
var logCache = [];
var errorCache = [];
export function getLogTool(type, isError = false) {
    return function (content) {
        var d = new Date();
        var log = "[" + d.toLocaleString() + "]" + "[" + type + "]" + content;
        if (isError) {
            global.Debug && console.error(log);
            errorCache.push(log);
        }
        else {
            global.Debug && console.log(log);
            logCache.push(log);
        }
    };
}
function DateToLogStr(date) {
    if (typeof date == 'number') {
        date = new Date(date);
    }
    else if (typeof date == 'string') {
        date = new Date(parseInt(date));
    }
    return TeDate.Date_Format(date, "yyyyMMdd_hh");
}
const fs = require("fs");
setInterval(() => {
    if (logCache.length > 0) {
        mkdirsSync(__dirname + "\/log");
        var fileName = __dirname + "\/log\/" + TeDate.DateToLogStr(Date.now()) + ".log";
        fs.writeFile(fileName, "\r\n" + logCache.join("\r\n"), { flag: 'a+' }, () => { });
        logCache = [];
    }
    if (errorCache.length) {
        mkdirsSync(__dirname + "\/error");
        var fileName = __dirname + "\/error\/" + TeDate.DateToLogStr(Date.now()) + ".log";
        fs.writeFile(fileName, "\r\n" + errorCache.join("\r\n"), { flag: 'a+' }, () => { });
        errorCache = [];
    }
}, 3 * 1000);
function mkdirsSync(dirpath, mode) {
    mode = mode || 511;
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        if (dirpath[0] == '/')
            pathtmp = '/';
        var dirs = dirpath.split(path.sep);
        for (var i = 0; i < dirs.length; i++) {
            var dirname = dirs[i];
            if (dirname.length == 0)
                continue;
            if (pathtmp) {
                pathtmp = path.join(pathtmp, dirname);
            }
            else {
                pathtmp = dirname;
            }
            if (!fs.existsSync(pathtmp)) {
                if (!fs.mkdirSync(pathtmp, mode)) {
                    return false;
                }
            }
        }
    }
    return true;
}
export class TeDate extends Date {
    constructor(arg) {
        super(arg);
    }
    static Date_Format(date, fmt) {
        var o = {
            "M+": date.getMonth() + 1,
            "d+": date.getDate(),
            "h+": date.getHours(),
            "m+": date.getMinutes(),
            "s+": date.getSeconds(),
            "q+": Math.floor((date.getMonth() + 3) / 3),
            "S": date.getMilliseconds()
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
    static DateToStr(date) {
        if (typeof date == 'number') {
            date = new Date(date);
        }
        else if (typeof date == 'string') {
            date = new Date(parseInt(date));
        }
        return TeDate.Date_Format(date, "yyyy-MM-dd hh:mm:ss");
    }
    static DateToLogStr(date) {
        if (typeof date == 'number') {
            date = new Date(date);
        }
        else if (typeof date == 'string') {
            date = new Date(parseInt(date));
        }
        return TeDate.Date_Format(date, "yyyyMMdd_hh");
    }
    static isYesterday(leftTime, rightTime = Date.now()) {
        var oneday = 1000 * 60 * 60 * 24;
        if (rightTime - leftTime > oneday) {
            return false;
        }
        return true;
    }
    static isdiffday(leftTime, rightTime = Date.now()) {
        var nowDate = new Date(rightTime);
        var checkDate = new Date(leftTime);
        if (checkDate.getFullYear() != nowDate.getFullYear() ||
            checkDate.getMonth() != nowDate.getMonth() ||
            checkDate.getDate() != nowDate.getDate()) {
            return true;
        }
        return false;
    }
    static daydiff(leftTime, rightTime = Date.now()) {
        var nowDate = new Date(rightTime);
        var checkDate = new Date(leftTime);
        nowDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return Math.floor(nowDate.getTime() - checkDate.getTime()) / (24 * 3600 * 1000);
    }
    static ToDate0(time) {
        var nowDate = new Date(time);
        nowDate.setHours(0, 0, 0, 0);
        return nowDate.getTime();
    }
    static ToDate24(time) {
        var nowDate = new Date(time);
        nowDate.setHours(23, 59, 59, 999);
        return nowDate.getTime();
    }
    static isdiffweek(leftTime, rightTime = Date.now()) {
        var rightDate = new Date(rightTime);
        var leftDate = new Date(leftTime);
        var diffTime = 0;
        var weekDay = 0;
        var diffDay = 0;
        if (leftTime > rightTime) {
            diffTime = leftTime - rightTime;
            if (leftDate.getDay() < rightDate.getDay()) {
                return true;
            }
        }
        else {
            diffTime = rightTime - leftTime;
            if (rightDate.getDay() < leftDate.getDay()) {
                return true;
            }
        }
        if (diffTime / (1000 * 60 * 60 * 24) >= 7) {
            return true;
        }
        return false;
    }
    static isdiffmonth(leftTime, rightTime = Date.now()) {
        var nowDate = new Date(rightTime);
        var checkDate = new Date(leftTime);
        if (checkDate.getFullYear() != nowDate.getFullYear() ||
            checkDate.getMonth() != nowDate.getMonth()) {
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=Tools.js.map