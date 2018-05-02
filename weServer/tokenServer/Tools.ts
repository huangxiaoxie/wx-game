import { iApp } from "./app";
import * as path from "path";

declare var global: iApp;
export function debugLog(msg: string) {
    if (global.Debug) {
        var d = new Date();
        console.log(d.toTimeString() + ":" + msg + "\r\n");
    }
}


var logCache: Array<string> = [];
var errorCache: Array<string> = [];
// export function writeLog(type: string, content: string) {
//     var d = new Date();
//     logCache.push("[" + d.toLocaleString() + "]" + "[" + type + "]" + content);
// }

export function getLogTool(type: string,isError:boolean=false): Function {
    return function (content: string) {
        var d = new Date();
        var log="[" + d.toLocaleString() + "]" + "[" + type + "]" + content;
        if(isError){
            global.Debug && console.error(log);
            errorCache.push(log)
        }else{
            global.Debug && console.log(log);
            logCache.push(log);
        }
    };
}

function DateToLogStr(date: Date | number) {
    if (typeof date == 'number') {
        date = new Date(date);
    }
    else if (typeof date == 'string') {
        date = new Date(parseInt(date));
    }
    return TeDate.Date_Format(date, "yyyyMMdd_hh")
}

const fs = require("fs");
setInterval(() => {
    if (logCache.length > 0) {
        mkdirsSync(__dirname + "\/log");
        var fileName = __dirname + "\/log\/" + TeDate.DateToLogStr(Date.now()) + ".log";
        fs.writeFile(fileName, "\r\n"+logCache.join("\r\n"), { flag: 'a+' }, () => { })
        logCache = [];
    }
    if(errorCache.length){
        mkdirsSync(__dirname + "\/error");
        var fileName = __dirname + "\/error\/" + TeDate.DateToLogStr(Date.now()) + ".log";
        fs.writeFile(fileName, "\r\n"+errorCache.join("\r\n"), { flag: 'a+' }, () => { })
        errorCache = [];
    }
}, 3 * 1000);

function mkdirsSync(dirpath, mode?) {
    mode = mode || 511;
    if (!fs.existsSync(dirpath)) {
        var pathtmp;
        if (dirpath[0] == '/') pathtmp = '/';
        var dirs = dirpath.split(path.sep);
        for (var i = 0; i < dirs.length; i++) {
            var dirname = <string>dirs[i];
            if (dirname.length == 0) continue;
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
    static Date_Format(date: Date, fmt: string) { //author: meizz   
        // 对Date的扩展，将 Date 转化为指定格式的String   
        // 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，   
        // 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)   
        // 例子：   
        // (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423   
        // (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
        var o = {
            "M+": date.getMonth() + 1,                 //月份   
            "d+": date.getDate(),                    //日   
            "h+": date.getHours(),                   //小时   
            "m+": date.getMinutes(),                 //分   
            "s+": date.getSeconds(),                 //秒   
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度   
            "S": date.getMilliseconds()             //毫秒   
        };
        if (/(y+)/.test(fmt))
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt))
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }

    static DateToStr(date: Date | number) {
        if (typeof date == 'number') {
            date = new Date(date);
        }
        else if (typeof date == 'string') {
            date = new Date(parseInt(date));
        }
        return TeDate.Date_Format(date, "yyyy-MM-dd hh:mm:ss")
    }

    static DateToLogStr(date: Date | number) {
        if (typeof date == 'number') {
            date = new Date(date);
        }
        else if (typeof date == 'string') {
            date = new Date(parseInt(date));
        }
        return TeDate.Date_Format(date, "yyyyMMdd_hh")
    }

    constructor(arg) {
        super(arg);
    }

    static isYesterday(leftTime: number, rightTime: number = Date.now()): Boolean {
        // 判断时间是否是昨天的
        var oneday = 1000 * 60 * 60 * 24;
        if (rightTime - leftTime > oneday) {
            return false;
        }
        return true;
    }
    static isdiffday(leftTime: number, rightTime: number = Date.now()): Boolean {
        // 判断时间是否是今天的
        var nowDate: Date = new Date(rightTime);
        var checkDate: Date = new Date(leftTime);
        if (checkDate.getFullYear() != nowDate.getFullYear() ||
            checkDate.getMonth() != nowDate.getMonth() ||
            checkDate.getDate() != nowDate.getDate()) {
            return true;
        }

        return false;
    }

    /**
     * 判断两个时间相差多少天
     * @param leftTime 
     * @param rightTime 
     */
    static daydiff(leftTime: number, rightTime: number = Date.now()): number {
        // 判断时间是否是今天的
        var nowDate: Date = new Date(rightTime);
        var checkDate: Date = new Date(leftTime);
        nowDate.setHours(0, 0, 0, 0);
        checkDate.setHours(0, 0, 0, 0);
        return Math.floor(nowDate.getTime() - checkDate.getTime()) / (24 * 3600 * 1000);
    }

    /**
     * 转换成一天的开始
     * @param time 
     */
    static ToDate0(time: number) {
        var nowDate: Date = new Date(time);
        nowDate.setHours(0, 0, 0, 0);
        return nowDate.getTime();
    }

    /**
     * 转换成一天的最后
     * @param time 
     */
    static ToDate24(time: number) {
        var nowDate: Date = new Date(time);
        nowDate.setHours(23, 59, 59, 999);
        return nowDate.getTime();
    }

    static isdiffweek(leftTime: number, rightTime: number = Date.now()): Boolean {
        // 判断时间是否是今天的
        var rightDate: Date = new Date(rightTime);
        var leftDate: Date = new Date(leftTime);
        // 周判断的时候是有跨越的，所以先计算一下插值
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

    static isdiffmonth(leftTime: number, rightTime: number = Date.now()): Boolean {
        // 判断时间是否是今天的
        var nowDate: Date = new Date(rightTime);
        var checkDate: Date = new Date(leftTime);
        if (checkDate.getFullYear() != nowDate.getFullYear() ||
            checkDate.getMonth() != nowDate.getMonth()) {
            return true;
        }

        return false;
    }
}

