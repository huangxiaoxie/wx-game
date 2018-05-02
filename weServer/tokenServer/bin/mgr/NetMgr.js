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
var http = require("http");
var https = require("https");
var urlTool = require("url");
var qs = require('querystring');
var writeLog = getLogTool("netmgr");
var errorLog = getLogTool("netmgr", true);
export class Sender {
    constructor(url, data, method, callBack) {
        this._tryCount = 0;
        this._url = url;
        this._data = data;
        this._method = method;
        this._callBack = callBack;
        this._tryCount = 0;
        this._send();
    }
    _send() {
        this._timeId = setTimeout(this._send.bind(this), 1000);
        this._tryCount++;
        if (this._tryCount > 5) {
            errorLog("重试超时----" + this._url);
            return;
        }
        this.send(this._url, this._data, this._method, (str) => {
            clearTimeout(this._timeId);
            this._timeId = null;
            this._callBack(JSON.parse(str));
        });
    }
    send(url, data, method, callback) {
        if (typeof data == "string") {
            data = JSON.parse(data);
        }
        if (method == "GET") {
            url += "?" + qs.stringify(data);
            https.get(url, function (res) {
                var alldata = "";
                res.on('data', function (chunk) {
                    alldata += chunk;
                });
                res.on('end', function () {
                    callback(alldata);
                });
            }).on('error', function (e) {
                errorLog("Got error: " + e.message);
            });
            return;
        }
        var postData = JSON.stringify(data);
        var opt = urlTool.parse(url);
        opt.method = "POST";
        opt.headers = {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(postData),
        };
        var req = https.request(opt, function (res) {
            writeLog('STATUS: ' + res.statusCode);
            writeLog('HEADERS: ' + JSON.stringify(res.headers));
            var alldata = "";
            res.on('data', function (chunk) {
                alldata += chunk;
            });
            res.on("end", function () {
                callback(alldata);
            });
            req.on('error', function (e) {
                errorLog('problem with request: ' + e.message);
            });
        });
        req.write(postData);
        req.end();
    }
}
export function sendToUser(response, d) {
    response.body = JSON.stringify(d);
}
export function sendUrlRequest(url, data, method) {
    return __awaiter(this, void 0, Promise, function* () {
        return new Promise((resolve, reject) => {
            new Sender(url, data, method, (res) => {
                resolve(res);
            });
        });
    });
}
//# sourceMappingURL=NetMgr.js.map