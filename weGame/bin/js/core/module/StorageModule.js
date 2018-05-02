/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var StorageModule = /** @class */ (function () {
            function StorageModule() {
            }
            StorageModule.prototype.init = function () {
                var _this = this;
                this._storageList = [];
                this._registFunc(EnumProxyName.Ball, function (d) {
                    _this._registProxy(new core.data.BallProxy(EnumProxyName.Ball, d));
                });
                this._registFunc(EnumProxyName.User, function (d) {
                    _this._registProxy(new core.data.UserProxy(EnumProxyName.User, d));
                });
                this._registFunc(EnumProxyName.ScoreUnit, function (d) {
                    _this._registProxy(new core.data.ScoreUnitProxy(EnumProxyName.ScoreUnit, d));
                });
                this._registFunc(EnumProxyName.SkillBuffer, function (d) {
                    _this._registProxy(new core.data.SkillProxy(EnumProxyName.SkillBuffer, d));
                });
                this._doNextFun();
            };
            StorageModule.prototype.save = function (key, d) {
                try {
                    debug.log(key + "---存储--", d);
                    wx.setStorageSync(key, d);
                }
                catch (e) {
                    localStorage.setItem(key, d ? JSON.stringify(d) : "");
                }
            };
            StorageModule.prototype.get = function (key) {
                try {
                    return wx.getStorageSync(key);
                }
                catch (e) {
                    var str = localStorage.getItem(key);
                    if (str) {
                        return JSON.parse(str);
                    }
                    return null;
                }
            };
            StorageModule.prototype._registFunc = function (key, method) {
                this._storageList.push([key, method]);
            };
            StorageModule.prototype._registProxy = function (proxy) {
                framework.mvc.Facade.getInstance().registProxy(proxy);
            };
            StorageModule.prototype._doNextFun = function () {
                var _this = this;
                if (this._storageList.length > 0) {
                    var key = this._storageList[0][0];
                    var _self = this;
                    var method = this._storageList[0][1];
                    this._storageList.shift();
                    try {
                        wx.getStorage({
                            key: key, success: function (res) {
                                method.call(_self, res.data);
                                _this._doNextFun();
                            }, fail: function () {
                                method.call(_self, null);
                                _this._doNextFun();
                            }
                        });
                    }
                    catch (e) {
                        var str = localStorage.getItem(key);
                        var obj = str ? JSON.parse(str) : null;
                        method.call(_self, obj);
                        this._doNextFun();
                    }
                }
                else {
                    initMgr.nextStep();
                }
            };
            StorageModule.prototype.saveData = function () {
                dataMgr.userProxy && dataMgr.userProxy.save();
                dataMgr.ballProxy && dataMgr.ballProxy.save();
                dataMgr.unitProxy && dataMgr.unitProxy.save();
                dataMgr.skillProxy && dataMgr.skillProxy.save();
            };
            return StorageModule;
        }());
        module.StorageModule = StorageModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=StorageModule.js.map