const Koa=require("koa");
const router=require("koa-router")();
const fs=require("fs");
const bodyParser = require('koa-bodyparser');
import Global = NodeJS.Global;
const app=new Koa();
import { redistInst } from "./lib/TeRedis";
import { debuglog } from "util";
import { debugLog, getLogTool } from "./Tools";
var writeLog=getLogTool("app");
var errorLog=getLogTool("app",true);
// 这个是负责处理单局开始这类的事情的
export interface iApp extends Global {
    ready: any;
    version: string;
    Debug:boolean;
}
declare var global: iApp;
export var config:IConfig=JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
global.Debug=config.debug;
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

// const debug=require("debug");
// debug.log=console.log;
// debug.enable("koa-router")
interface IConfig{
    debug:boolean,
    port:number,
}

export interface IResponse{
    success:boolean,
    data:any,
}
