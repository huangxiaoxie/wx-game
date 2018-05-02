/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var LoadingModule = /** @class */ (function () {
            function LoadingModule() {
                this.showLoadingTime = 0;
            }
            LoadingModule.prototype.showLoading = function (msg) {
                if (Define.IsWeChat) {
                    if (this.showLoadingTime == 0) {
                        Laya.timer.loop(1000, this, this._checkLoading);
                    }
                    wx.showLoading({ title: msg, mask: true });
                }
                this.showLoadingTime = 5;
            };
            LoadingModule.prototype.hideLoading = function () {
                if (Define.IsWeChat) {
                    wx.hideLoading({});
                }
                Laya.timer.clear(this, this._checkLoading);
                this.showLoadingTime = 0;
            };
            LoadingModule.prototype._checkLoading = function () {
                this.showLoadingTime--;
                if (this.showLoadingTime <= 0) {
                    core.hideLoading();
                }
            };
            return LoadingModule;
        }());
        module.LoadingModule = LoadingModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=LoadingModule.js.map