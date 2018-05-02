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
        var UI_MagicItem = /** @class */ (function (_super) {
            __extends(UI_MagicItem, _super);
            function UI_MagicItem() {
                return _super.call(this) || this;
            }
            UI_MagicItem.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "MagicItem"));
            };
            UI_MagicItem.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_state = this.getControllerAt(0);
                this.m_nameTxt = (this.getChildAt(1));
                this.m_iconImg = (this.getChildAt(2));
                this.m_timeTxt = (this.getChildAt(3));
                this.m_buyBtn = (this.getChildAt(4));
            };
            UI_MagicItem.URL = "ui://tlo9kvuvbnnk1y";
            return UI_MagicItem;
        }(fairygui.GComponent));
        ball.UI_MagicItem = UI_MagicItem;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_MagicItem.js.map