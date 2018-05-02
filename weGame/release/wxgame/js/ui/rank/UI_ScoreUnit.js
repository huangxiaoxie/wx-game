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
        var UI_ScoreUnit = /** @class */ (function (_super) {
            __extends(UI_ScoreUnit, _super);
            function UI_ScoreUnit() {
                return _super.call(this) || this;
            }
            UI_ScoreUnit.createInstance = function () {
                return (fairygui.UIPackage.createObject("rank", "ScoreUnit"));
            };
            UI_ScoreUnit.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_icon = (this.getChildAt(0));
                this.m_scoreTxt = (this.getChildAt(1));
                this.m_hitAni = this.getTransitionAt(0);
            };
            UI_ScoreUnit.URL = "ui://tlo9kvuvrhmah";
            return UI_ScoreUnit;
        }(fairygui.GComponent));
        rank.UI_ScoreUnit = UI_ScoreUnit;
    })(rank = ui.rank || (ui.rank = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_ScoreUnit.js.map