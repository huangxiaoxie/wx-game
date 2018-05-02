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
        var UI_BallItem = /** @class */ (function (_super) {
            __extends(UI_BallItem, _super);
            function UI_BallItem() {
                return _super.call(this) || this;
            }
            UI_BallItem.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "BallItem"));
            };
            UI_BallItem.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_lockState = this.getControllerAt(0);
                this.m_nameTxt = (this.getChildAt(1));
                this.m_lvTxt = (this.getChildAt(2));
                this.m_iconImg = (this.getChildAt(3));
                this.m_attackTxt = (this.getChildAt(4));
                this.m_upBtn = (this.getChildAt(5));
                this.m_lockBtn = (this.getChildAt(6));
            };
            UI_BallItem.URL = "ui://tlo9kvuvpr18f";
            return UI_BallItem;
        }(fairygui.GComponent));
        ball.UI_BallItem = UI_BallItem;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_BallItem.js.map