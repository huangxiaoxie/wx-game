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
        var UI_EnergyProgress = /** @class */ (function (_super) {
            __extends(UI_EnergyProgress, _super);
            function UI_EnergyProgress() {
                return _super.call(this) || this;
            }
            UI_EnergyProgress.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "EnergyProgress"));
            };
            UI_EnergyProgress.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_n1 = (this.getChildAt(0));
                this.m_bar = (this.getChildAt(1));
            };
            UI_EnergyProgress.URL = "ui://tlo9kvuvfddh1t";
            return UI_EnergyProgress;
        }(fairygui.GProgressBar));
        ball.UI_EnergyProgress = UI_EnergyProgress;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_EnergyProgress.js.map