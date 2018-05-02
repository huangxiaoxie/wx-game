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
    var leave;
    (function (leave) {
        var LeavePanel = /** @class */ (function (_super) {
            __extends(LeavePanel, _super);
            function LeavePanel() {
                return _super.call(this) || this;
            }
            LeavePanel.prototype.start = function (d) {
                _super.prototype.start.call(this, d);
            };
            LeavePanel.prototype.override_startInitMvc = function () {
                _super.prototype.override_startInitMvc.call(this);
                this._registMediator(new LeavePanelMediator(EnumMediatorName.LeavePanel, this));
            };
            return LeavePanel;
        }(core.uiLib.AppBase));
        leave.LeavePanel = LeavePanel;
        var LeavePanelMediator = /** @class */ (function (_super) {
            __extends(LeavePanelMediator, _super);
            function LeavePanelMediator(name, viewCompoment) {
                var _this = _super.call(this, name, viewCompoment) || this;
                _this._leaveEnergy = 0;
                return _this;
            }
            LeavePanelMediator.prototype.onRegist = function () {
                var _this = this;
                _super.prototype.onRegist.call(this);
                this._panel = fairygui.UIPackage.createObject(EnumUIPackage.ball, "LeavePanel", ui.ball.UI_LeavePanel);
                this._viewCompoment.addChild(this._panel);
                this._viewCompoment.bindWH(this._panel);
                var d = this._viewCompoment.getData();
                this._panel.m_getBtn.onClick(this, function () {
                    dataMgr.userProxy.addEnergy(_this._leaveEnergy);
                    appMgr.close(2 /* LeavePanel */);
                });
                var _self = this;
                this._panel.m_shareBtn.onClick(this, function () {
                    _this.sendNotification(EnumCommond.share, {
                        callBack: function () {
                            dataMgr.userProxy.addEnergy(_self._leaveEnergy * 2);
                            appMgr.close(2 /* LeavePanel */);
                        }, title: "社会人推荐，猪猪佩奇最爱玩球球"
                    });
                });
                this._panel.m_native.setSelectedPage("hide");
                Laya.Tween.to(this, { energy: d }, 1000, null, Laya.Handler.create(this, function () {
                    _this._panel.m_native.setSelectedPage(Laya.Browser.onIOS ? "ios" : "android");
                }));
            };
            Object.defineProperty(LeavePanelMediator.prototype, "energy", {
                get: function () {
                    return this._leaveEnergy;
                },
                set: function (val) {
                    this._leaveEnergy = val;
                    this._panel.m_energyTxt.text = app.formula.numToShowStr(this._leaveEnergy);
                },
                enumerable: true,
                configurable: true
            });
            return LeavePanelMediator;
        }(framework.mvc.Mediator));
    })(leave = app.leave || (app.leave = {}));
})(app || (app = {}));
//# sourceMappingURL=LeavePanel.js.map