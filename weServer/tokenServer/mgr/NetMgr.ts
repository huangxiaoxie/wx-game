import { debugLog, getLogTool } from "../Tools";
import { IResponse } from "../app";
import { request } from "http";

var http = require("http");
var https = require("https");
var urlTool = require("url");
var qs = require('querystring');
var writeLog=getLogTool("netmgr");
var errorLog=getLogTool("netmgr",true);
export class Sender {
    private _url: string;
    private _data: any;
    private _method: string;
    private _callBack: Function;
    constructor(url: string, data: any, method: string, callBack: Function) {
        this._url = url;
        this._data = data;
        this._method = method;
        this._callBack = callBack;
        this._tryCount=0;
        this._send();
    }

    private _timeId: any;
    private _tryCount:number=0;
    private _send() {
        this._timeId = setTimeout(this._send.bind(this), 1000);
        this._tryCount++;
        if(this._tryCount>5){
            errorLog("重试超时----"+this._url);
            return;
        }
        this.send(this._url, this._data, this._method, (str) => {
            clearTimeout(this._timeId);
            this._timeId = null;
            this._callBack(JSON.parse(str));
        })
    }

    send(url: string, data: any, method: string, callback: Function) {
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
        }
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

export function sendToUser(response:any,d:IResponse){
    response.body=JSON.stringify(d);
}


export async function sendUrlRequest(url: string, data: any, method: string){
    return new Promise((resolve,reject)=>{
        new Sender(url,data,method,(res)=>{
            resolve(res);
        });
    });
}

