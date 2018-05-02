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
    var login;
    (function (login) {
        var Login = /** @class */ (function (_super) {
            __extends(Login, _super);
            function Login() {
                return _super.call(this) || this;
            }
            Login.prototype.start = function (d) {
                _super.prototype.start.call(this, d);
            };
            Login.prototype.override_startInitMvc = function () {
                _super.prototype.override_startInitMvc.call(this);
                this._registMediator(new LoginMediator(EnumMediatorName.Login, this));
            };
            return Login;
        }(core.uiLib.AppBase));
        login.Login = Login;
        var LoginMediator = /** @class */ (function (_super) {
            __extends(LoginMediator, _super);
            function LoginMediator(name, viewCompoment) {
                return _super.call(this, name, viewCompoment) || this;
            }
            LoginMediator.prototype.onRegist = function () {
                _super.prototype.onRegist.call(this);
                this._panel = fairygui.UIPackage.createObject("ball", "TestPage", TestPage);
                this._viewCompoment.addChild(this._panel);
            };
            return LoginMediator;
        }(framework.mvc.Mediator));
        var TestPage = /** @class */ (function (_super) {
            __extends(TestPage, _super);
            function TestPage() {
                return _super.call(this) || this;
            }
            TestPage.prototype.constructFromResource = function () {
                var _this = this;
                _super.prototype.constructFromResource.call(this);
                this.m_loginBtn.onClick(this, function () {
                    netMgr.connect();
                });
                this.m_getBtn.onClick(this, function () {
                    payMgr.getBalance();
                });
                this.m_payBtn.onClick(this, function () {
                    payMgr.pay(1);
                });
                this.m_giveBtn.onClick(this, function () {
                    payMgr.present(_this.m_nameTxt.text ? parseInt(_this.m_nameTxt.text) : 10, _this.m_pwdTxt.text);
                });
                this.m_closeBtn.onClick(this, function () {
                    appMgr.close(0 /* Login */);
                });
            };
            return TestPage;
        }(ui.ball.UI_TestPage));
    })(login = app.login || (app.login = {}));
})(app || (app = {}));
//# sourceMappingURL=Login.js.map