/** This is an automatically generated class by FairyGUI. Please do not modify it. **/
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
var ui;
(function (ui) {
    var base;
    (function (base) {
        var UI_TestPage = /** @class */ (function (_super) {
            __extends(UI_TestPage, _super);
            function UI_TestPage() {
                return _super.call(this) || this;
            }
            UI_TestPage.createInstance = function () {
                return (fairygui.UIPackage.createObject("base", "TestPage"));
            };
            UI_TestPage.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_n0 = (this.getChildAt(0));
                this.m_closeBtn = (this.getChildAt(1));
                this.m_nameTxt = (this.getChildAt(2));
                this.m_pwdTxt = (this.getChildAt(3));
                this.m_loginBtn = (this.getChildAt(4));
            };
            UI_TestPage.URL = "ui://tlo9kvuvbhxc0";
            return UI_TestPage;
        }(fairygui.GComponent));
        base.UI_TestPage = UI_TestPage;
    })(base = ui.base || (ui.base = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_TestPage.js.map