const Koa=require("koa");
const router=require("koa-router")();
const fs=require("fs");
const bodyParser = require('koa-bodyparser');
import Global = NodeJS.Global;
const app=new Koa();
import {UserMgr} from "./mgr/UserMgr";
import { TokenMgr } from "./mgr/TokenMgr";
import { redistInst } from "./lib/TeRedis";
import { debuglog } from "util";
import { debugLog, getLogTool } from "./Tools";
var writeLog=getLogTool("app");
var errorLog=getLogTool("app",true);
// 这个是负责处理单局开始这类的事情的
export interface iApp extends Global {
    ready: any;
    userMgr:UserMgr;
    tokenMgr:TokenMgr;
    version: string;
    APPID:string;
    SECRET:string;
    Debug:boolean;
    Token:string;
    PayUrl:string;
    midasKey:string;
    midasUri:string;
    midasId:string;
    heartTime:number;
}
declare var global: iApp;


global.userMgr=new UserMgr();

export var config:IConfig=JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
global.Debug=config.debug;
global.heartTime=config.heartTime;
global.APPID="wxef0b425831a24d44";
global.SECRET="9030ce8d27e72c900e810e035a9e0e05";


//初始化支付信息
global.midasId="1450014515";
if(global.Debug){
    global.PayUrl = "https://api.weixin.qq.com/cgi-bin/midas/sandbox/";
    global.midasKey = "3RsERZyKXQIWErpu1Wf8jia9azgxHcZU";
    global.midasUri = "/cgi-bin/midas/sandbox/";
}else{
    global.PayUrl = "https://api.weixin.qq.com/cgi-bin/midas/";
    global.midasKey = "GVVU978HFdY9oLFBKbzNkp4Bx7BoPP0b";
    global.midasUri = "/cgi-bin/midas/";
}

global.tokenMgr=new TokenMgr();
global.tokenMgr.getToken();

global.userMgr=new UserMgr();

app.use(async (ctx,next)=>{
    writeLog(`Process ${ctx.request.method}${ctx.request.url}`);
    await next();
});
app.use(bodyParser());
var files = fs.readdirSync(__dirname + '/server');
var js_files = files.filter((f)=>{
    return f.endsWith('.js');
});

for (var f of js_files) {
    writeLog(`process server: ${f}...`);
    // 导入js文件:
    let mapping = require(__dirname + '/server/' + f);
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            // 如果url类似"GET xxx":
            var path = url.substring(4);
            router.get(path, mapping[url]);
            writeLog(`register URL mapping: GET ${path}`);
        } else if (url.startsWith('POST ')) {
            // 如果url类似"POST xxx":

            var path = url.substring(5);
            router.post(path, mapping[url]);
            writeLog(`register URL mapping: POST ${path}`);
        } else {
            // 无效的URL:
            errorLog(`invalid URL: ${url}`);
        }
    }
}


router.get('/', async (ctx, next) => {
    ctx.response.body = '<h1>Index</h1>';
});

// add router middleware:
app.use(router.routes());

app.listen(config.port);

redistInst.init([{port:config.DBManager.port,host:config.DBManager.ip}],config.DBManager.select,config.DBManager.flag);
redistInst.on("ready",()=>{
    debugLog("redis连接成功");
});

// const debug=require("debug");
// debug.log=console.log;
// debug.enable("koa-router")
interface IConfig{
    debug:boolean,
    port:number,
    heartTime:number,
    DBManager: {
        ip: string;
        port: number;
        select: number;
        flag: {
            auth_pass: string;
        }
    },
    tokenServer:{
        url:string,
    }
}

export interface IResponse{
    success:boolean,
    data?:any,
}
