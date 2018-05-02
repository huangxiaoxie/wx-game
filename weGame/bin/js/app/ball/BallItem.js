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
        var BallItem = /** @class */ (function (_super) {
            __extends(BallItem, _super);
            function BallItem() {
                return _super.call(this) || this;
            }
            BallItem.prototype.constructFromResource = function () {
                _super.prototype.constructFromResource.call(this);
                this.m_upBtn.onClick(this, this._clickUpBtn);
                this.m_lockBtn.onClick(this, this._clickUnLock);
                this.m_upBtn.on(Laya.Event.MOUSE_DOWN, this, this._startUpLevel);
                this.m_upBtn.on(Laya.Event.MOUSE_UP, this, this._stopUpLevel);
                this.m_upBtn.on(Laya.Event.MOUSE_OUT, this, this._stopUpLevel);
            };
            BallItem.prototype.setData = function (kId) {
                this._ballRes = dataMgr.sys_ballHash.getData(kId);
                this.m_nameTxt.text = this._ballRes.kName;
                this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, this._ballRes.kIcon);
                this.update();
            };
            BallItem.prototype.update = function () {
                var ballVo = dataMgr.ballProxy.getBall(this._ballRes.kId);
                var cost = app.formula.getCost(this._ballRes.kId, ballVo ? ballVo.iLevel + 1 : 1);
                var isEnergyEnough = dataMgr.userProxy.userVo.iEnergy >= cost;
                if (ballVo) {
                    this.m_lvTxt.visible = true;
                    this.m_lvTxt.text = "Lv." + ballVo.iLevel.toString();
                    this.m_attackTxt.text = app.formula.numToShowStr(app.formula.getBallAttack(this._ballRes.kId, ballVo.iLevel));
                    this.m_upBtn.text = app.formula.numToShowStr(cost);
                    if (isEnergyEnough) {
                        this.m_lockState.setSelectedPage("normal");
                    }
                    else {
                        this.m_lockState.setSelectedPage("noEnough");
                    }
                }
                else {
                    this.m_lvTxt.visible = false;
                    this.m_attackTxt.text = app.formula.numToShowStr(this._ballRes.iAttack);
                    var isOpen = dataMgr.userProxy.userVo.iLevel >= this._ballRes.iOpenLevel;
                    this.m_lockBtn.text = isOpen ? app.formula.numToShowStr(cost) : "关卡" + this._ballRes.iOpenLevel;
                    if (isEnergyEnough && isOpen) {
                        this.m_lockState.setSelectedPage("canUnlock");
                    }
                    else {
                        this.m_lockState.setSelectedPage("lock");
                    }
                }
            };
            BallItem.prototype._startUpLevel = function () {
                Laya.timer.once(300, this, this._startLoop);
            };
            BallItem.prototype._startLoop = function () {
                Laya.timer.frameLoop(1, this, this._clickUpBtn);
            };
            BallItem.prototype._stopUpLevel = function () {
                Laya.timer.clear(this, this._startLoop);
                Laya.timer.clear(this, this._clickUpBtn);
            };
            BallItem.prototype._clickUpBtn = function () {
                dataMgr.ballProxy.levelUp(this._ballRes.kId);
            };
            BallItem.prototype._clickUnLock = function () {
                if (this._ballRes.eType == SeEnumBalleType.MoFaQiu) {
                    var _self = this;
                    appMgr.showMsg("解锁魔法球将重置所有等级，\n是否确认解锁？", ["确定", "取消"], function () {
                        dataMgr.ballProxy.levelUp(_self._ballRes.kId);
                    });
                }
                else {
                    dataMgr.ballProxy.levelUp(this._ballRes.kId);
                }
            };
            BallItem.prototype.dispose = function () {
                this._ballRes = null;
            };
            return BallItem;
        }(ui.ball.UI_BallItem));
        ball.BallItem = BallItem;
    })(ball = app.ball || (app.ball = {}));
})(app || (app = {}));
//# sourceMappingURL=BallItem.js.map