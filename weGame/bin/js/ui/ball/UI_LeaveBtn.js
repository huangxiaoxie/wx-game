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
        var UI_LeaveBtn = /** @class */ (function (_super) {
            __extends(UI_LeaveBtn, _super);
            function UI_LeaveBtn() {
                return _super.call(this) || this;
            }
            UI_LeaveBtn.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "LeaveBtn"));
            };
            UI_LeaveBtn.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_state = this.getControllerAt(1);
                this.m_moneyTxt = (this.getChildAt(2));
            };
            UI_LeaveBtn.URL = "ui://tlo9kvuvp4bd2n";
            return UI_LeaveBtn;
        }(fairygui.GButton));
        ball.UI_LeaveBtn = UI_LeaveBtn;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_LeaveBtn.js.map