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
    var notice;
    (function (notice) {
        var NoticePanel = /** @class */ (function (_super) {
            __extends(NoticePanel, _super);
            function NoticePanel() {
                return _super.call(this) || this;
            }
            NoticePanel.prototype.start = function (d) {
                _super.prototype.start.call(this, d);
            };
            NoticePanel.prototype.override_startInitMvc = function () {
                _super.prototype.override_startInitMvc.call(this);
                this._registMediator(new NoticeMediator(EnumMediatorName.NoticePanel, this));
            };
            return NoticePanel;
        }(core.uiLib.AppBase));
        notice.NoticePanel = NoticePanel;
        var NoticeMediator = /** @class */ (function (_super) {
            __extends(NoticeMediator, _super);
            function NoticeMediator(name, viewCompoment) {
                var _this = _super.call(this, name, viewCompoment) || this;
                _this._leaveEnergy = 0;
                return _this;
            }
            NoticeMediator.prototype.onRegist = function () {
                _super.prototype.onRegist.call(this);
                this._panel = fairygui.UIPackage.createObject(EnumUIPackage.ball, "NoticePanel");
                this._viewCompoment.addChild(this._panel);
                this._viewCompoment.bindWH(this._panel);
                var d = this._viewCompoment.getData();
                this._panel.m_msgTxt.text = d.msg;
                this._panel.m_titleTxt.text = d.title;
                var btnArr = d.btnArr;
                if (!btnArr) {
                    btnArr = ["确定"];
                }
                if (btnArr.length < 2) {
                    this._panel.m_type.setSelectedIndex(0);
                }
                else {
                    this._panel.m_type.setSelectedIndex(1);
                    this._panel.m_noBtn.text = btnArr[1];
                }
                this._panel.m_okBtn.text = btnArr[0];
                var okMethod = d.success;
                var noMethod = d.fail;
                this._panel.m_okBtn.onClick(this, function () {
                    appMgr.close(3 /* NoticePanel */);
                    okMethod && okMethod.call(null);
                });
                this._panel.m_noBtn.onClick(this, function () {
                    appMgr.close(3 /* NoticePanel */);
                    noMethod && noMethod.call(null);
                });
            };
            return NoticeMediator;
        }(framework.mvc.Mediator));
    })(notice = app.notice || (app.notice = {}));
})(app || (app = {}));
//# sourceMappingURL=NoticePanel.js.map