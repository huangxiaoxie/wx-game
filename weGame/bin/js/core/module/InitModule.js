/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var InitModule = /** @class */ (function () {
            function InitModule() {
                this._total = 0;
                this._curr = 0;
                this._index = -1;
                this._startShowTime = 0;
            }
            InitModule.prototype.startInit = function () {
                this._stepList = [];
                this._registStep(resMgr, resMgr.loadStart, 1, "", Laya.Handler.create(this, this._showStartPanel));
                this._registStep(resMgr, resMgr.loadPre, 1);
                this._registStep(loginMgr, loginMgr.login, 1);
                this._registStep(this, this._initShellCommond, 1);
                this._registStep(payMgr, payMgr.init, 1);
                this._registStep(dataMgr, dataMgr.loadStaticData, 1);
                this._registStep(storageMgr, storageMgr.init, 1);
                this.nextStep();
            };
            InitModule.prototype.nextStep = function () {
                var preStep = this._stepList[this._index];
                if (preStep) {
                    this._curr += preStep.pecent;
                    preStep.complete && preStep.complete.run();
                }
                this._index++;
                if (this._curr > this._total)
                    return;
                core.showLoading("资源加载中" + Math.floor((this._curr / this._total) * 100) + "%");
                if (this._stepList.length > this._index) {
                    var currStep = this._stepList[this._index];
                    var caller = currStep.caller;
                    var method = currStep.method;
                    method.call(caller);
                }
                else {
                    core.hideLoading();
                    this.initComplete();
                }
            };
            InitModule.prototype.initComplete = function () {
                var startRemindTime = this._startShowTime + 3000 - Laya.Browser.now();
                if (startRemindTime > 0) {
                    Laya.timer.once(startRemindTime, this, this.initComplete);
                }
                else {
                    this._startImg.dispose();
                    this._startImg = null;
                    appMgr.open(1 /* GamePanel */);
                }
            };
            InitModule.prototype._registStep = function (callter, method, pecent, msg, complete) {
                if (msg === void 0) { msg = ""; }
                this._stepList.push({ caller: callter, method: method, pecent: pecent, msg: msg, complete: complete });
                this._total += pecent;
            };
            InitModule.prototype._initShellCommond = function () {
                var facade = framework.mvc.Facade.getInstance();
                facade.registCommand(EnumCommond.share, core.controller.ShareCommond);
                this.nextStep();
            };
            InitModule.prototype._showStartPanel = function () {
                this._startImg = new fairygui.GLoader();
                this._startImg.fill = 4;
                this._startImg.width = Laya.stage.width;
                this._startImg.height = Laya.stage.height;
                this._startImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, "start");
                fairygui.GRoot.inst.addChild(this._startImg);
                this._startShowTime = Laya.Browser.now();
            };
            return InitModule;
        }());
        module.InitModule = InitModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=InitModule.js.map