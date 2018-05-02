var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var DataModule = /** @class */ (function () {
            function DataModule() {
                this._loadingNum = 0;
            }
            DataModule.prototype.loadStaticData = function () {
                this.sys_ballHash = this._addStaticData("res/table/Ball.json");
                this.sys_chapter = this._addStaticData("res/table/Chapter.json", "iLevel");
                this.sys_skill = this._addStaticData("res/table/Skill.json");
                this.sys_recharge = this._addStaticData("res/table/Recharge.json");
            };
            Object.defineProperty(DataModule.prototype, "userProxy", {
                get: function () {
                    return this._getProxy(EnumProxyName.User);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataModule.prototype, "ballProxy", {
                get: function () {
                    return this._getProxy(EnumProxyName.Ball);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataModule.prototype, "unitProxy", {
                get: function () {
                    return this._getProxy(EnumProxyName.ScoreUnit);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataModule.prototype, "skillProxy", {
                get: function () {
                    return this._getProxy(EnumProxyName.SkillBuffer);
                },
                enumerable: true,
                configurable: true
            });
            DataModule.prototype.checkLeaveTime = function () {
                if (this.userProxy) {
                    this.userProxy.getLeaveEnergy();
                }
            };
            DataModule.prototype.reStart = function () {
                framework.mvc.Facade.getInstance().sendNotification(EnumCommond.reStart);
                this.userProxy.reStart();
                this.unitProxy.reStart();
                this.ballProxy.reStart();
            };
            DataModule.prototype._addStaticData = function (url, keyName) {
                var dataHash = new DataHash(url, keyName);
                this._loadingNum++;
                dataHash.once("complete", this, this._dataInited);
                return dataHash;
            };
            DataModule.prototype._registProxy = function (proxy) {
                framework.mvc.Facade.getInstance().registProxy(proxy);
            };
            DataModule.prototype._getProxy = function (name) {
                return (framework.mvc.Facade.getInstance().getProxy(name));
            };
            DataModule.prototype._dataInited = function () {
                this._loadingNum--;
                if (this._loadingNum == 0) {
                    initMgr.nextStep();
                }
            };
            return DataModule;
        }());
        module.DataModule = DataModule;
        var DataHash = /** @class */ (function (_super) {
            __extends(DataHash, _super);
            function DataHash(d, keyName) {
                var _this = _super.call(this) || this;
                _this._keyName = keyName;
                _this._hash = {};
                if (typeof d == "string") {
                    Laya.loader.load(d, Laya.Handler.create(_this, _this._install));
                }
                else {
                    Laya.timer.callLater(_this, _this._install, [d]);
                }
                return _this;
            }
            DataHash.prototype._install = function (d) {
                for (var key in d) {
                    var realKey = this._keyName ? d[key][this._keyName] : key;
                    this._hash[realKey] = this._createItem(d[key]);
                }
                this.event("complete");
            };
            DataHash.prototype._createItem = function (d) {
                return d;
            };
            DataHash.prototype.getData = function (key) {
                return this._hash[key];
            };
            DataHash.prototype.getAllRes = function () {
                return this._hash;
            };
            return DataHash;
        }(Laya.EventDispatcher));
        module.DataHash = DataHash;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=DataModule.js.map