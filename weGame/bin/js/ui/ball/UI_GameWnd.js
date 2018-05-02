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
        var UI_GameWnd = /** @class */ (function (_super) {
            __extends(UI_GameWnd, _super);
            function UI_GameWnd() {
                return _super.call(this) || this;
            }
            UI_GameWnd.createInstance = function () {
                return (fairygui.UIPackage.createObject("ball", "GameWnd"));
            };
            UI_GameWnd.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_shoptab = this.getControllerAt(0);
                this.m_native = this.getControllerAt(1);
                this.m_phyCon = (this.getChildAt(1));
                this.m_levelTxt = (this.getChildAt(3));
                this.m_energyTxt = (this.getChildAt(4));
                this.m_progressBar = (this.getChildAt(6));
                this.m_energyAddTxt = (this.getChildAt(7));
                this.m_ballTab = (this.getChildAt(9));
                this.m_getBtn = (this.getChildAt(10));
                this.m_skillTab = (this.getChildAt(11));
                this.m_magicBallTab = (this.getChildAt(12));
                this.m_shopTab = (this.getChildAt(13));
                this.m_ballList = (this.getChildAt(14));
                this.m_skillList = (this.getChildAt(15));
                this.m_moneyNumTxt = (this.getChildAt(17));
                this.m_shopList = (this.getChildAt(18));
                this.m_magicBallList = (this.getChildAt(19));
                this.m_friendBtn = (this.getChildAt(20));
                this.m_tabAni = (this.getChildAt(21));
                this.m_clickAni = (this.getChildAt(22));
                this.m_testBtn = (this.getChildAt(23));
                this.m_energyAni = this.getTransitionAt(0);
            };
            UI_GameWnd.URL = "ui://tlo9kvuvpr187";
            return UI_GameWnd;
        }(fairygui.GComponent));
        ball.UI_GameWnd = UI_GameWnd;
    })(ball = ui.ball || (ui.ball = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_GameWnd.js.map