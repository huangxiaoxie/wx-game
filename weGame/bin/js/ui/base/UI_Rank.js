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
        var UI_Rank = /** @class */ (function (_super) {
            __extends(UI_Rank, _super);
            function UI_Rank() {
                return _super.call(this) || this;
            }
            UI_Rank.createInstance = function () {
                return (fairygui.UIPackage.createObject("base", "Rank"));
            };
            UI_Rank.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_n0 = (this.getChildAt(0));
                this.m_rankList = (this.getChildAt(1));
            };
            UI_Rank.URL = "ui://tlo9kvuvdb644";
            return UI_Rank;
        }(fairygui.GComponent));
        base.UI_Rank = UI_Rank;
    })(base = ui.base || (ui.base = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_Rank.js.map