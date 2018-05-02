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
        var UI_NoticePanel = /** @class */ (function (_super) {
            __extends(UI_NoticePanel, _super);
            function UI_NoticePanel() {
                return _super.call(this) || this;
            }
            UI_NoticePanel.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "NoticePanel"));
            };
            UI_NoticePanel.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_type = this.getControllerAt(0);
                this.m_titleTxt = (this.getChildAt(2));
                this.m_msgTxt = (this.getChildAt(3));
                this.m_okBtn = (this.getChildAt(4));
                this.m_noBtn = (this.getChildAt(5));
            };
            UI_NoticePanel.URL = "ui://tlo9kvuvp4bd2t";
            return UI_NoticePanel;
        }(fairygui.GComponent));
        ball.UI_NoticePanel = UI_NoticePanel;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_NoticePanel.js.map