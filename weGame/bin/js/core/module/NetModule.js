/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var NetModule = /** @class */ (function () {
            function NetModule() {
            }
            /**
             *
             * @param url 开发者服务器接口地址
             * @param data 请求的参数
             * @param header 设置请求的 header , header 中不能设置 Referer
             * @param method 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
             * @param success 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
             * @param fail 接口调用失败的回调函数
             * @param complete 接口调用结束的回调函数（调用成功、失败都会执行）
             */
            NetModule.prototype.requrest = function (url, data, header, method, success, fail, complete) {
                if (method === void 0) { method = "GET"; }
                // var requestOps:wx.RequestOptions={url:url,data:data,method:method,success:success,fail:fail,complete:complete};
                // if(header){
                // 	requestOps.header=header;
                // }
                // wx.request(requestOps);
                var request = {
                    url: Define.ServerUrl, method: "POST", data: { url: url, data: data, method: method }, success: function (res) {
                        success(res);
                    }, fail: function (res) {
                        console.log("失败了", res);
                    }
                };
                wx.request(request);
            };
            NetModule.prototype.send = function (server, func, data, success, fail) {
                Request.send(server, func, data, success, fail);
            };
            NetModule.prototype.connect = function () {
                var socket = new framework.net.GeSocket("ws://193.168.2.120:6003");
            };
            return NetModule;
        }());
        module.NetModule = NetModule;
        var Request = /** @class */ (function () {
            function Request() {
                this._retryTime = 0;
            }
            Request.send = function (server, func, data, success, fail) {
                var request;
                if (this._pool && this._pool.length > 0) {
                    request = this._pool.shift();
                }
                else {
                    request = new Request();
                }
                request.setTo(server, func, data, success, fail);
                request.send();
            };
            Request.prototype.setTo = function (server, func, data, success, fail) {
                var _this = this;
                this._retryTime = 0;
                this._request = {
                    url: Define.ServerUrl + server + "/" + (func ? func + "/" : ""), method: "POST", data: data, success: function (res) {
                        success && success(res.data);
                        _this._recover();
                    }, fail: function (res) {
                        _this._retryTime++;
                        if (_this._retryTime > 5) {
                            debug.log("失败了", res);
                            fail && fail();
                            _this._recover();
                        }
                        else {
                            Laya.timer.once(1000, _this, _this.send);
                        }
                    }
                };
            };
            Request.prototype.send = function () {
                if (!this._request)
                    return;
                wx.request(this._request);
            };
            Request.prototype._recover = function () {
                if (!Request._pool)
                    Request._pool = [];
                this._request = null;
                Request._pool.push(this);
            };
            return Request;
        }());
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=NetModule.js.map