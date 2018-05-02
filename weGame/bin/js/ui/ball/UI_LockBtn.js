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
        var UI_LockBtn = /** @class */ (function (_super) {
            __extends(UI_LockBtn, _super);
            function UI_LockBtn() {
                return _super.call(this) || this;
            }
            UI_LockBtn.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "LockBtn"));
            };
            UI_LockBtn.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_button = this.getControllerAt(0);
                this.m_n1 = (this.getChildAt(0));
                this.m_title = (this.getChildAt(1));
                this.m_n4 = (this.getChildAt(2));
            };
            UI_LockBtn.URL = "ui://tlo9kvuvfddh1q";
            return UI_LockBtn;
        }(fairygui.GButton));
        ball.UI_LockBtn = UI_LockBtn;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_LockBtn.js.map