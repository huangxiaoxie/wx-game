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
const Koa = require("koa");
const router = require("koa-router")();
const fs = require("fs");
const bodyParser = require('koa-bodyparser');
const app = new Koa();
import { getLogTool } from "./Tools";
var writeLog = getLogTool("app");
var errorLog = getLogTool("app", true);
export var config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString());
global.Debug = config.debug;
app.use((ctx, next) => __awaiter(this, void 0, Promise, function* () {
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
router.get('/', (ctx, next) => __awaiter(this, void 0, Promise, function* () {
    ctx.response.body = '<h1>Index</h1>';
}));
app.use(router.routes());
app.listen(config.port);
//# sourceMappingURL=app.js.map