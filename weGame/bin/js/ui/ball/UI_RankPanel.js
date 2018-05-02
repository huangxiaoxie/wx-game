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
        var UI_RankPanel = /** @class */ (function (_super) {
            __extends(UI_RankPanel, _super);
            function UI_RankPanel() {
                return _super.call(this) || this;
            }
            UI_RankPanel.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "RankPanel"));
            };
            UI_RankPanel.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_tab = this.getControllerAt(0);
                this.m_closeBtn = (this.getChildAt(2));
                this.m_listCon = (this.getChildAt(3));
                this.m_chapterTab = (this.getChildAt(4));
                this.m_powerTab = (this.getChildAt(5));
            };
            UI_RankPanel.URL = "ui://tlo9kvuvbjvq4c";
            return UI_RankPanel;
        }(fairygui.GComponent));
        ball.UI_RankPanel = UI_RankPanel;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_RankPanel.js.map