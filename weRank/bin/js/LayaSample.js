// 程序入口
var templeteCache = {};
var GameMain = /** @class */ (function () {
    function GameMain() {
        var _this = this;
        try {
            wx;
            Laya.URL.customFormat = function (url) {
                if (templeteCache[url])
                    return templeteCache[url];
                if (window["ver"]) {
                    if (ver[url]) {
                        return ver[url] + "/" + url;
                    }
                }
                return url;
            };
        }
        catch (e) {
            Laya.URL.customFormat = function (url) {
                if (window["ver"]) {
                    if (ver[url]) {
                        return ver[url] + "/" + url + "?t=" + timeV[url];
                    }
                }
                return url;
            };
        }
        Config.isAlpha = true;
        //初始化微信小游戏
        Laya.MiniAdpter.init(true, true);
        Laya.init(750, 1334);
        try {
            wx.onMessage(function (message) {
                console.log(message);
                if (message.type == "init") {
                    var ransform = message.data;
                    // Laya.URL.basePath=message.data.basePath;
                    // Laya.stage._canvasTransform = message.data.matrix;//重新设置矩阵
                    var preTrans = Laya.stage._canvasTransform;
                    preTrans.setTo(ransform.a, ransform.b, ransform.c, ransform.d, ransform.tx, ransform.ty);
                    preTrans.bTransform = ransform.bTransform;
                    Laya.stage._canvasTransform = preTrans;
                    console.log(ransform);
                }
                else if (message.type == "loadComplete") {
                    Laya["MiniFileMgr"].ziyuFileData[message.url] = message.data; //文本数据
                }
                else if (message.type == "templeteFile") {
                    templeteCache[message.url] = message.data.tempFilePath;
                }
                else if (message.type == "open") {
                    if (_this._wnd) {
                        Laya.stage.addChild(_this._wnd);
                        _this._wnd.setData(message.data);
                    }
                    else {
                        Laya.loader.load("res/child/comp.atlas", Laya.Handler.create(_this, function () {
                            _this._wnd = new RankListUI();
                            Laya.stage.addChild(_this._wnd);
                            _this._wnd.setData(message.data);
                        }));
                    }
                }
                else if (message.type == "close") {
                    if (_this._wnd && _this._wnd.parent) {
                        _this._wnd.removeSelf();
                    }
                    _this._wnd.hide();
                }
            });
        }
        catch (e) {
        }
    }
    return GameMain;
}());
new GameMain();
//# sourceMappingURL=LayaSample.js.map