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
    var ball;
    (function (ball) {
        var UI_MoneyBtn = /** @class */ (function (_super) {
            __extends(UI_MoneyBtn, _super);
            function UI_MoneyBtn() {
                return _super.call(this) || this;
            }
            UI_MoneyBtn.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "MoneyBtn"));
            };
            UI_MoneyBtn.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_button = this.getControllerAt(0);
                this.m_n1 = (this.getChildAt(0));
                this.m_title = (this.getChildAt(1));
                this.m_icon = (this.getChildAt(2));
            };
            UI_MoneyBtn.URL = "ui://tlo9kvuvbnnk1z";
            return UI_MoneyBtn;
        }(fairygui.GButton));
        ball.UI_MoneyBtn = UI_MoneyBtn;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_MoneyBtn.js.map