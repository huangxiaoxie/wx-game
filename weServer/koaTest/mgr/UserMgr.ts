import { SeUser } from "../user/SeUser";
import { mysqlLoaderInst } from "./TePlayerLoader";
import { iApp } from "../app";
import { SeDBInfoHead, iUserInfo } from "../SeDefine";
declare var global:iApp;

export class UserMgr{
    private _userHash:any;
    private _sessionKeyHash:any;
    constructor(){
        this._userHash={};
        this._sessionKeyHash={};
        setTimeout((() => {
            var now=Date.now();
            for(var key in this._userHash){
                var seUser:SeUser=this._userHash[key];
                if(now-seUser.updateTime>120000){
                    seUser.leaveGame();
                    delete this._userHash[key];
                }
            }
        }).bind(this), global.heartTime);
    }

    public addUser(openId:string,seUser:SeUser){
        this._userHash[openId]=seUser;
        this._sessionKeyHash[openId]=seUser.sessionKey;
        seUser.updateTime=Date.now();
    }

    public heart(openId:string):boolean{
        var seUser=this.getUser(openId);
        if(seUser){
            seUser.updateTime=Date.now();
            return true;
        }else{
            return false;
        }
    }

    public updateSessionKey(openId:string,key:string){
        this._sessionKeyHash[openId]=key;
    }

    public getSessionKey(openId){
        return this._sessionKeyHash[openId];
    }

    public getUser(openId:string):SeUser{
        return this._userHash[openId];
    }
}

export async function loginUser(user:IUserVo,userInfo:iUserInfo){
    var seUser=global.userMgr.getUser(user.openId);
    if(!seUser){
        var dbLoader=mysqlLoaderInst.getLoader(user.openId);
        var success=await dbLoader.asyncLoad();
        seUser=new SeUser(user.openId,dbLoader,<boolean>success);
        
    }
}

interface IUserVo{
    openId:string;
    sessionKey:string;
}