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
        var UI_BuyBtn = /** @class */ (function (_super) {
            __extends(UI_BuyBtn, _super);
            function UI_BuyBtn() {
                return _super.call(this) || this;
            }
            UI_BuyBtn.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "BuyBtn"));
            };
            UI_BuyBtn.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_upImg = (this.getChildAt(3));
            };
            UI_BuyBtn.URL = "ui://tlo9kvuvfddh1o";
            return UI_BuyBtn;
        }(fairygui.GButton));
        ball.UI_BuyBtn = UI_BuyBtn;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_BuyBtn.js.map