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
    var rank;
    (function (rank) {
        var UI_MoveBallItem = /** @class */ (function (_super) {
            __extends(UI_MoveBallItem, _super);
            function UI_MoveBallItem() {
                return _super.call(this) || this;
            }
            UI_MoveBallItem.createInstance = function () {
                return (fairygui.UIPackage.createObject("rank", "MoveBallItem"));
            };
            UI_MoveBallItem.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_icon = (this.getChildAt(0));
                this.m_nameTxt = (this.getChildAt(1));
            };
            UI_MoveBallItem.URL = "ui://tlo9kvuvrhmai";
            return UI_MoveBallItem;
        }(fairygui.GComponent));
        rank.UI_MoveBallItem = UI_MoveBallItem;
    })(rank = ui.rank || (ui.rank = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_MoveBallItem.js.map