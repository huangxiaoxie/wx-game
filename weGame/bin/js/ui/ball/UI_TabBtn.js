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
        var UI_TabBtn = /** @class */ (function (_super) {
            __extends(UI_TabBtn, _super);
            function UI_TabBtn() {
                return _super.call(this) || this;
            }
            UI_TabBtn.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "TabBtn"));
            };
            UI_TabBtn.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_button = this.getControllerAt(0);
                this.m_n1 = (this.getChildAt(0));
                this.m_n2 = (this.getChildAt(1));
                this.m_n3 = (this.getChildAt(2));
                this.m_n4 = (this.getChildAt(3));
                this.m_title = (this.getChildAt(4));
            };
            UI_TabBtn.URL = "ui://tlo9kvuvfddh1w";
            return UI_TabBtn;
        }(fairygui.GButton));
        ball.UI_TabBtn = UI_TabBtn;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_TabBtn.js.map