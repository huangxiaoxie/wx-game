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
var app;
(function (app) {
    var ball;
    (function (ball) {
        var MagicItem = /** @class */ (function (_super) {
            __extends(MagicItem, _super);
            function MagicItem() {
                var _this = _super.call(this) || this;
                _this._isTimeRun = false;
                return _this;
            }
            MagicItem.prototype.constructFromResource = function () {
                _super.prototype.constructFromResource.call(this);
                var _self = this;
                this.m_buyBtn.onClick(this, function () {
                    framework.mvc.Facade.getInstance().sendNotification(EnumCommond.share, { callBack: function () {
                            dataMgr.skillProxy.addBuffer(_self._magicRes.kId);
                            _self.update();
                        }, title: "欢乐球球大作战，一起来玩吧~", imageUrl: Laya.URL.formatURL(app.coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share")) });
                });
            };
            MagicItem.prototype.setData = function (kId) {
                this._magicRes = dataMgr.sys_skill.getData(kId);
                this.m_nameTxt.text = this._magicRes.kName;
                this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, this._magicRes.kIcon);
                this.m_timeTxt.text = "时间:" + this._magicRes.kTime;
                this.update();
            };
            MagicItem.prototype.update = function () {
                var bufferVo = dataMgr.skillProxy.getBuffer(this._magicRes.kId);
                this._buffVo = bufferVo;
                if (bufferVo && bufferVo.endTime != -1 && this._buffVo.endTime > Laya.Browser.now()) {
                    if (!this._isTimeRun) {
                        this._isTimeRun = true;
                        Laya.timer.loop(1000, this, this._updateTime);
                    }
                    this.m_state.setSelectedPage("get");
                }
                else {
                    this.m_state.setSelectedPage("normal");
                    if (this._isTimeRun) {
                        this._isTimeRun = false;
                        Laya.timer.clear(this, this._updateTime);
                    }
                }
            };
            MagicItem.prototype._updateTime = function () {
                var remaidTime = Math.round((this._buffVo.endTime - Laya.Browser.now()) / 1000);
                if (remaidTime <= 0) {
                    this._isTimeRun = false;
                    Laya.timer.clear(this, this._updateTime);
                    this.m_timeTxt.text = "时间:" + this._magicRes.kTime;
                    this.m_state.setSelectedPage("normal");
                }
                else {
                    this.m_timeTxt.text = app.timeTools.format(remaidTime);
                }
            };
            MagicItem.prototype.dispose = function () {
                this._isTimeRun = false;
                this._magicRes = null;
                this._buffVo = null;
                Laya.timer.clearAll(this);
                _super.prototype.dispose.call(this);
            };
            return MagicItem;
        }(ui.ball.UI_MagicItem));
        ball.MagicItem = MagicItem;
    })(ball = app.ball || (app.ball = {}));
})(app || (app = {}));
//# sourceMappingURL=MagicItem.js.map