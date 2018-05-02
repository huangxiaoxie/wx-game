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
        var UI_RankItem = /** @class */ (function (_super) {
            __extends(UI_RankItem, _super);
            function UI_RankItem() {
                return _super.call(this) || this;
            }
            UI_RankItem.createInstance = function () {
                return (fairygui.UIPackage.createObject("base", "RankItem"));
            };
            UI_RankItem.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_n1 = (this.getChildAt(0));
                this.m_nameTxt = (this.getChildAt(1));
                this.m_scoreTxt = (this.getChildAt(2));
                this.m_icon = (this.getChildAt(3));
            };
            UI_RankItem.URL = "ui://tlo9kvuvdb645";
            return UI_RankItem;
        }(fairygui.GComponent));
        base.UI_RankItem = UI_RankItem;
    })(base = ui.base || (ui.base = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_RankItem.js.map