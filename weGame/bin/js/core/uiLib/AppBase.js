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
    var uiLib;
    (function (uiLib) {
        var Facade = framework.mvc.Facade;
        var debug = framework.native.DebugTool;
        var AppBase = /** @class */ (function (_super) {
            __extends(AppBase, _super);
            function AppBase() {
                var _this = _super.call(this) || this;
                _this._init();
                return _this;
            }
            AppBase.prototype._init = function () {
                this._commandList = [];
                this._mediatorList = [];
                this._proxyList = [];
            };
            AppBase.prototype.start = function (d) {
                this._data = d;
                this.override_initRes();
                this._onStartLoadRes();
            };
            AppBase.prototype.reStart = function (d) {
                this._data = d;
            };
            AppBase.prototype.close = function () {
                this.dispose();
            };
            AppBase.prototype.getData = function () {
                return this._data;
            };
            AppBase.prototype.bindWH = function (d) {
                d.width = this.width;
                d.height = this.height;
                d.addRelation(this, fairygui.RelationType.Width);
                d.addRelation(this, fairygui.RelationType.Height);
            };
            AppBase.prototype.override_initRes = function () {
            };
            AppBase.prototype._onStartLoadRes = function () {
                if (this._resList && this._resList.length > 0) {
                    Laya.loader.load(this._resList, Laya.Handler.create(this, this._onLoadResComplete));
                }
                else {
                    this._onLoadResComplete();
                }
            };
            AppBase.prototype._onLoadResComplete = function () {
                this.override_startInitMvc();
            };
            //这个方法是需要重写的。app在这里初始化
            AppBase.prototype.override_startInitMvc = function () {
            };
            AppBase.prototype._registMediator = function (mediator) {
                this._mediatorList.push(mediator.name);
                var facade = Facade.getInstance();
                facade.registMediator(mediator);
            };
            AppBase.prototype._registCommand = function (cmd, cmdCls) {
                this._commandList.push(cmd);
                var facade = Facade.getInstance();
                facade.registCommand(cmd, cmdCls);
            };
            AppBase.prototype._registProxy = function (proxy) {
                this._proxyList.push(proxy.name);
                var facade = Facade.getInstance();
                facade.registProxy(proxy);
            };
            AppBase.prototype.dispose = function () {
                debug.log("关闭窗口");
                var facade = Facade.getInstance();
                while (this._mediatorList.length > 0) {
                    facade.removeMediator(this._mediatorList.shift());
                }
                this._mediatorList = null;
                while (this._commandList.length > 0) {
                    facade.removeCommand(this._commandList.shift());
                }
                this._commandList = null;
                while (this._proxyList.length > 0) {
                    facade.removeProxy(this._proxyList.shift());
                }
                this._proxyList = null;
                _super.prototype.dispose.call(this);
            };
            return AppBase;
        }(fairygui.GComponent));
        uiLib.AppBase = AppBase;
    })(uiLib = core.uiLib || (core.uiLib = {}));
})(core || (core = {}));
//# sourceMappingURL=AppBase.js.map