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
        var EnumChargeItemType;
        (function (EnumChargeItemType) {
            EnumChargeItemType[EnumChargeItemType["Recharge"] = 0] = "Recharge";
            EnumChargeItemType[EnumChargeItemType["Cost"] = 1] = "Cost";
        })(EnumChargeItemType = ball.EnumChargeItemType || (ball.EnumChargeItemType = {}));
        var RechargeItem = /** @class */ (function (_super) {
            __extends(RechargeItem, _super);
            function RechargeItem() {
                return _super.call(this) || this;
            }
            RechargeItem.prototype.constructFromResource = function () {
                var _this = this;
                _super.prototype.constructFromResource.call(this);
                this.m_rechargeBtn.onClick(this, function () {
                    var rechargeRes = dataMgr.sys_recharge.getData(_this._kid);
                    if (!rechargeRes)
                        return;
                    payMgr.buyMoney(rechargeRes.iPrice * 10);
                });
                this.m_buyBtn.onClick(this, function () {
                    var skillRes = dataMgr.sys_skill.getData(_this._kid);
                    if (!skillRes)
                        return;
                    payMgr.pay(skillRes.iPrice, function () {
                        dataMgr.skillProxy.addBuffer(_this._kid);
                        storageMgr.saveData();
                    }, function () {
                        appMgr.showMsg("钻石不足");
                    });
                });
            };
            RechargeItem.prototype.setData = function (d) {
                this._type = d.type;
                this._kid = d.kId;
                if (this._type == EnumChargeItemType.Cost) {
                    var bufferVo = dataMgr.skillProxy.getBuffer(d.kId);
                    if (bufferVo) {
                        this.m_type.setSelectedPage("get");
                    }
                    else {
                        this.m_type.setSelectedPage("cost");
                    }
                    var skillRes = dataMgr.sys_skill.getData(d.kId);
                    this.m_nameTxt.text = skillRes.kName;
                    this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, skillRes.kIcon);
                    this.m_buyBtn.text = skillRes.iPrice.toString();
                }
                else {
                    this.m_type.setSelectedPage("recharge");
                    var rechargeRes = dataMgr.sys_recharge.getData(d.kId);
                    this.m_moneyTxt.text = (rechargeRes.iPrice * 10).toString();
                    this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, rechargeRes.kIcon);
                    this.m_rechargeBtn.text = "￥	" + rechargeRes.iPrice;
                }
                this.update();
            };
            RechargeItem.prototype.update = function () {
            };
            RechargeItem.prototype.dispose = function () {
            };
            return RechargeItem;
        }(ui.ball.UI_RechargeItem));
        ball.RechargeItem = RechargeItem;
    })(ball = app.ball || (app.ball = {}));
})(app || (app = {}));
//# sourceMappingURL=RechargeItem.js.map