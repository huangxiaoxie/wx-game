/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var LoginModule = /** @class */ (function () {
            function LoginModule() {
                this._isReLogin = false;
            }
            LoginModule.prototype.login = function () {
                var _self = this;
                try {
                    wx.login({
                        success: function (res) {
                            _self._code = res.code;
                            debug.log("登录成功:" + res.code);
                            _self._getUserInfo();
                        },
                        fail: function (error) {
                            debug.log("登录失败", error);
                        }
                    });
                }
                catch (e) {
                    debug.log("不是微信环境");
                    initMgr.nextStep();
                }
            };
            Object.defineProperty(LoginModule.prototype, "code", {
                get: function () { return this._code; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoginModule.prototype, "openid", {
                get: function () { return this._openId; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoginModule.prototype, "session_key", {
                get: function () { return this._session_key; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(LoginModule.prototype, "token", {
                get: function () { return this._token; },
                enumerable: true,
                configurable: true
            });
            LoginModule.prototype._getUserInfo = function () {
                var _self = this;
                wx.getUserInfo({
                    withCredentials: false, lang: "zh_CN", success: function (res) {
                        debug.log("用户数据获取成功:", res.userInfo);
                        _self._userInfo = res.userInfo;
                        _self._startGetOpenId();
                    }, fail: function () {
                        _self._startGetOpenId();
                    }
                });
            };
            LoginModule.prototype._startGetOpenId = function () {
                var _this = this;
                netMgr.send("login", "login", { "code": this._code, userInfo: this._userInfo }, function (res) {
                    if (res.success) {
                        _this._session_key = res.data.session_key;
                        _this._openId = res.data.openid;
                        debug.log("openid获取成功", res.data);
                        if (!_this._isReLogin) {
                            initMgr.nextStep();
                            _this._startHeart();
                        }
                    }
                    else {
                        debug.error(res.data.errMsg + "---" + res.data.errcode);
                    }
                });
            };
            LoginModule.prototype._startHeart = function () {
                var _this = this;
                Laya.timer.loop(Define.heartTime, this, function () {
                    netMgr.send("login", "", { "openId": _this._openId }, function (res) {
                        if (res.success == false) {
                            _this._isReLogin = true;
                            _this.login();
                        }
                    });
                });
            };
            return LoginModule;
        }());
        module.LoginModule = LoginModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=LoginModule.js.map