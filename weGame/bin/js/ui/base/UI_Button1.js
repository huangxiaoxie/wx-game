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
        var UI_Button1 = /** @class */ (function (_super) {
            __extends(UI_Button1, _super);
            function UI_Button1() {
                return _super.call(this) || this;
            }
            UI_Button1.createInstance = function () {
                return (fairygui.UIPackage.createObject("base", "Button1"));
            };
            UI_Button1.prototype.constructFromXML = function (xml) {
                _super.prototype.constructFromXML.call(this, xml);
                this.m_button = this.getControllerAt(0);
                this.m_n1 = (this.getChildAt(0));
                this.m_n2 = (this.getChildAt(1));
                this.m_n3 = (this.getChildAt(2));
                this.m_title = (this.getChildAt(3));
            };
            UI_Button1.URL = "ui://tlo9kvuvbhxc1";
            return UI_Button1;
        }(fairygui.GButton));
        base.UI_Button1 = UI_Button1;
    })(base = ui.base || (ui.base = {}));
})(ui || (ui = {}));
//# sourceMappingURL=UI_Button1.js.map