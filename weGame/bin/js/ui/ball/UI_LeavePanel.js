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
        var UI_LeavePanel = /** @class */ (function (_super) {
            __extends(UI_LeavePanel, _super);
            function UI_LeavePanel() {
                return _super.call(this) || this;
            }
            UI_LeavePanel.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "LeavePanel"));
            };
            UI_LeavePanel.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_native = this.getControllerAt(0);
                this.m_energyTxt = (this.getChildAt(1));
                this.m_getBtn = (this.getChildAt(3));
                this.m_shareBtn = (this.getChildAt(4));
            };
            UI_LeavePanel.URL = "ui://tlo9kvuvmtf82l";
            return UI_LeavePanel;
        }(fairygui.GComponent));
        ball.UI_LeavePanel = UI_LeavePanel;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_LeavePanel.js.map