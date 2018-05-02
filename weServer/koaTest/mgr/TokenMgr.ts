import { Sender } from "./NetMgr";
import { iApp, config } from "../app";
import { debugLog, getLogTool } from "../Tools";
import { Z_DATA_ERROR } from "zlib";
declare var global: iApp;
var writeLog = getLogTool("login");
var errorLog = getLogTool("login", true);
interface iTokenVo {
    appid: string,
    secret: string,
    token: string,
    endTime: number,
}
export class TokenMgr {
    constructor() {

    }

    public getToken() {
        var sender = new Sender(config.tokenServer.url + "\/token\/getToken", { appid: global.APPID, secret: global.SECRET }, "POST", this._tokenBack.bind(this));
    }

    public refreshToken(callBack: Function) {
        var sender = new Sender(config.tokenServer.url + "\/token\/refreshToken", { appid: global.APPID, secret: global.SECRET, token: global.Token }, "POST", callBack);
    }

    private _tokenBack(data: iTokenVo) {
        if (data) {
            global.Token = data.token;
            setTimeout((this.getToken).bind(this), data.endTime - Date.now());
            writeLog("token获取成功" + data.token);
        } else {
            errorLog("token获取失败");
            // setTimeout((this.getToken).bind(this), 2000);
        }
    }
}

export async function refreshToken() {
    return new Promise((resolve, reject) => {
        global.tokenMgr.refreshToken((data:iTokenVo) => {
            if (data) {
                global.Token = data.token;
                setTimeout((global.tokenMgr.getToken).bind(global.tokenMgr), data.endTime - Date.now());
                writeLog("token获取成功" + data.token);
            } else {
                errorLog("token获取失败");
                setTimeout((global.tokenMgr.getToken).bind(global.tokenMgr), 2000);
                // setTimeout((this.getToken).bind(this), 2000);
            }
        })
    });
}