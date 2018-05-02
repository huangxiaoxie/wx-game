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
const Koa = require("koa");
const router = require("koa-router")();
const fs = require("fs");
const bodyParser = require('koa-bodyparser');
const app = new Koa();
const UserMgr_1 = require("./mgr/UserMgr");
const TokenMgr_1 = require("./mgr/TokenMgr");
const TeRedis_1 = require("./lib/TeRedis");
const Tools_1 = require("./Tools");
var writeLog = Tools_1.getLogTool("app");
var errorLog = Tools_1.getLogTool("app", true);
global.userMgr = new UserMgr_1.UserMgr();
exports.config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
global.Debug = exports.config.debug;
global.heartTime = exports.config.heartTime;
global.APPID = "wxef0b425831a24d44";
global.SECRET = "9030ce8d27e72c900e810e035a9e0e05";
global.midasId = "1450014515";
if (global.Debug) {
    global.PayUrl = "https://api.weixin.qq.com/cgi-bin/midas/sandbox/";
    global.midasKey = "3RsERZyKXQIWErpu1Wf8jia9azgxHcZU";
    global.midasUri = "/cgi-bin/midas/sandbox/";
}
else {
    global.PayUrl = "https://api.weixin.qq.com/cgi-bin/midas/";
    global.midasKey = "GVVU978HFdY9oLFBKbzNkp4Bx7BoPP0b";
    global.midasUri = "/cgi-bin/midas/";
}
global.tokenMgr = new TokenMgr_1.TokenMgr();
global.tokenMgr.getToken();
global.userMgr = new UserMgr_1.UserMgr();
app.use((ctx, next) => __awaiter(this, void 0, void 0, function* () {
    writeLog(`Process ${ctx.request.method}${ctx.request.url}`);
    yield next();
}));
app.use(bodyParser());
var files = fs.readdirSync(__dirname + '/server');
var js_files = files.filter((f) => {
    return f.endsWith('.js');
});
for (var f of js_files) {
    writeLog(`process server: ${f}...`);
    let mapping = require(__dirname + '/server/' + f);
    for (var url in mapping) {
        if (url.startsWith('GET ')) {
            var path = url.substring(4);
            router.get(path, mapping[url]);
            writeLog(`register URL mapping: GET ${path}`);
        }
        else if (url.startsWith('POST ')) {
            var path = url.substring(5);
            router.post(path, mapping[url]);
            writeLog(`register URL mapping: POST ${path}`);
        }
        else {
            errorLog(`invalid URL: ${url}`);
        }
    }
}
router.get('/', (ctx, next) => __awaiter(this, void 0, void 0, function* () {
    ctx.response.body = '<h1>Index</h1>';
}));
app.use(router.routes());
app.listen(exports.config.port);
TeRedis_1.redistInst.init([{ port: exports.config.DBManager.port, host: exports.config.DBManager.ip }], exports.config.DBManager.select, exports.config.DBManager.flag);
TeRedis_1.redistInst.on("ready", () => {
    Tools_1.debugLog("redis连接成功");
});
//# sourceMappingURL=app.js.map