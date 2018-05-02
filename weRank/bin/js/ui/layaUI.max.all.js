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
var View = laya.ui.View;
var Dialog = laya.ui.Dialog;
var ui;
(function (ui) {
    var RankListUI = /** @class */ (function (_super) {
        __extends(RankListUI, _super);
        function RankListUI() {
            return _super.call(this) || this;
        }
        RankListUI.prototype.createChildren = function () {
            View.regComponent("RankTxt", RankTxt);
            _super.prototype.createChildren.call(this);
            this.createView(ui.RankListUI.uiView);
        };
        RankListUI.uiView = { "type": "View", "props": { "width": 625, "height": 756 }, "child": [{ "type": "List", "props": { "y": 0, "x": 17, "width": 592, "var": "list", "repeatY": 6, "height": 756 }, "child": [{ "type": "Box", "props": { "y": 0, "x": 0, "renderType": "render", "height": 126 }, "child": [{ "type": "Image", "props": { "y": 14, "x": 86, "width": 99, "skin": "comp/avatarBg.png", "name": "avatarIcon", "height": 99 } }, { "type": "Image", "props": { "skin": "comp/lineBg.png" } }, { "type": "Sprite", "props": { "y": 46, "x": 10, "width": 63, "runtime": "RankTxt", "name": "numTxt", "height": 37 }, "child": [{ "type": "Image", "props": { "skin": "comp/1-1.png" } }] }, { "type": "Image", "props": { "y": 4, "x": 58, "skin": "comp/VIP.png", "name": "vipImg" } }, { "type": "Label", "props": { "y": 38, "x": 216, "width": 147, "text": "用户名字用户名字", "overflow": "hidden", "name": "nameTxt", "height": 52, "fontSize": 30, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true } }, { "type": "Label", "props": { "y": 39, "x": 406, "width": 182, "text": "能力:22.22c", "overflow": "hidden", "name": "valueTxt", "height": 52, "fontSize": 30, "font": "Microsoft YaHei", "color": "#ffffff", "bold": true } }] }] }] };
        return RankListUI;
    }(View));
    ui.RankListUI = RankListUI;
})(ui || (ui = {}));
//# sourceMappingURL=layaUI.max.all.js.map