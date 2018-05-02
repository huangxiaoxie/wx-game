/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var ResModule = /** @class */ (function () {
            function ResModule() {
            }
            ResModule.prototype.loadPre = function () {
                this._preLoadList = [];
                var self = this;
                var addPreLoad = function (url, type) {
                    self._preLoadList.push({ url: url, type: type });
                };
                addPreLoad("res/ball@atlas0.png", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas0_1.png", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas0_2.png", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas2.png", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas3.png", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas_fddhq.jpg", Laya.Loader.IMAGE);
                Laya.loader.load(this._preLoadList, Laya.Handler.create(this, function () {
                    ui.ball.ballBinder.bindAll();
                    initMgr.nextStep();
                }));
            };
            ResModule.prototype.loadStart = function () {
                this._preLoadList = [];
                var self = this;
                var addPreLoad = function (url, type) {
                    self._preLoadList.push({ url: url, type: type });
                };
                addPreLoad("res/ball.fui", Laya.Loader.BUFFER);
                addPreLoad("res/ball@atlas_p4bd2r.jpg", Laya.Loader.IMAGE);
                addPreLoad("res/ball@atlas4.png", Laya.Loader.IMAGE);
                Laya.loader.load(this._preLoadList, Laya.Handler.create(this, function () {
                    fairygui.UIPackage.addPackage("res/ball");
                    initMgr.nextStep();
                }));
            };
            return ResModule;
        }());
        module.ResModule = ResModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=ResModule.js.map