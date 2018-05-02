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
const Tools_1 = require("../Tools");
var http = require("http");
var https = require("https");
var urlTool = require("url");
var qs = require('querystring');
var writeLog = Tools_1.getLogTool("netmgr");
var errorLog = Tools_1.getLogTool("netmgr", true);
class Sender {
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
            try {
                this._callBack(str ? JSON.parse(str) : null);
            }
            catch (e) {
                this._callBack(str);
            }
        });
    }
    send(url, data, method, callback) {
        if (typeof data == "string") {
            data = JSON.parse(data);
        }
        var httpTarget = url.indexOf("https") != -1 ? https : http;
        if (method == "GET") {
            url += "?" + qs.stringify(data);
            httpTarget.get(url, function (res) {
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
        var req = httpTarget.request(opt, function (res) {
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
exports.Sender = Sender;
function sendToUser(response, d) {
    response.body = JSON.stringify(d);
}
exports.sendToUser = sendToUser;
function sendUrlRequest(url, data, method) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            new Sender(url, data, method, (res) => {
                resolve(res);
            });
        });
    });
}
exports.sendUrlRequest = sendUrlRequest;
//# sourceMappingURL=NetMgr.js.map