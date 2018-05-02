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
    var rank;
    (function (rank) {
        var RankPanel = /** @class */ (function (_super) {
            __extends(RankPanel, _super);
            function RankPanel() {
                return _super.call(this) || this;
            }
            RankPanel.prototype.start = function (d) {
                _super.prototype.start.call(this, d);
            };
            RankPanel.prototype.override_startInitMvc = function () {
                _super.prototype.override_startInitMvc.call(this);
                this._registMediator(new RankMediator(EnumMediatorName.RankPanel, this));
            };
            return RankPanel;
        }(core.uiLib.AppBase));
        rank.RankPanel = RankPanel;
        var RankMediator = /** @class */ (function (_super) {
            __extends(RankMediator, _super);
            function RankMediator(name, viewCompoment) {
                var _this = _super.call(this, name, viewCompoment) || this;
                _this._leaveEnergy = 0;
                return _this;
            }
            RankMediator.prototype.onRegist = function () {
                _super.prototype.onRegist.call(this);
                this._panel = fairygui.UIPackage.createObject(EnumUIPackage.ball, "RankPanel");
                this._viewCompoment.addChild(this._panel);
                this._viewCompoment.bindWH(this._panel);
                this._panel.m_closeBtn.onClick(this, function () {
                    appMgr.close(4 /* RankPanel */);
                });
                this._panel.m_powerTab.onClick(this, function () {
                    rankModule.show(EnumFriendKey.power, "能力:{value}");
                });
                this._panel.m_chapterTab.onClick(this, function () {
                    rankModule.show(EnumFriendKey.chapter, "关卡:{value}");
                });
                rankModule.show(EnumFriendKey.power, "能力:{value}");
                if (Define.IsWeChat) {
                    var openDataContext = wx.getOpenDataContext();
                    var sharedCanvas = openDataContext.canvas;
                    sharedCanvas.width = 625;
                    sharedCanvas.height = 756;
                    this._listSp = new Laya.Sprite();
                    this._panel.m_listCon.displayObject.addChild(this._listSp);
                    this._listSp.x = (this._panel.m_listCon.width - sharedCanvas.width) / 2;
                    Laya.timer.once(400, this, this._renderFunc);
                }
            };
            RankMediator.prototype._renderFunc = function () {
                if (Laya.Browser.onMiniGame && this._listSp && !this._listSp.destroyed) {
                    var rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
                    rankTexture.bitmap.alwaysChange = true; //小游戏使用，非常费，每帧刷新
                    this._listSp.graphics.drawTexture(rankTexture, 0, 0, rankTexture.width, rankTexture.height);
                }
            };
            RankMediator.prototype.onRemove = function () {
                rankModule.hide();
                Laya.timer.clear(this, this._renderFunc);
                this._listSp = null;
                _super.prototype.onRemove.call(this);
            };
            return RankMediator;
        }(framework.mvc.Mediator));
    })(rank = app.rank || (app.rank = {}));
})(app || (app = {}));
//# sourceMappingURL=RankPanel.js.map