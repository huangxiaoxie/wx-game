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
        var UI_GameWnd = /** @class */ (function (_super) {
            __extends(UI_GameWnd, _super);
            function UI_GameWnd() {
                return _super.call(this) || this;
            }
            UI_GameWnd.createInstance = function () {
                return (fairygui.UIPackage.createObject("rank", "GameWnd"));
            };
            UI_GameWnd.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_phyCon = (this.getChildAt(0));
                this.m_n0 = (this.getChildAt(1));
            };
            UI_GameWnd.URL = "ui://tlo9kvuvpr187";
            return UI_GameWnd;
        }(fairygui.GComponent));
        rank.UI_GameWnd = UI_GameWnd;
    })(rank = ui.rank || (ui.rank = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_GameWnd.js.map