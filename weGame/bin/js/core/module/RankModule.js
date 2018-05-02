/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var RankModule = /** @class */ (function () {
            function RankModule() {
            }
            RankModule.prototype.init = function () {
                if (!Define.IsWeChat)
                    return;
                if (!wx.getOpenDataContext) {
                    Define.IsShareOpen = false;
                    return;
                }
                Define.IsShareOpen = true;
                Laya.MiniAdpter.nativefiles = ["res/child/comp.atlas"];
                var openContext = wx.getOpenDataContext();
                openContext.postMessage({ "type": "init", "data": { ransform: Laya.stage._canvasTransform, basePath: Define.CdnUrl } });
            };
            RankModule.prototype.load = function (urls, completeHandler) {
                if (!this.isShareOpen)
                    return;
                var openContext = wx.getOpenDataContext();
                // Laya.loader.load(urls,Laya.Handler.create(this,()=>{
                // 	for(var i=0;i<urls.length;i++){
                // 		var data=Laya.loader.getRes(urls[i].url);
                // 		console.log("加载完---",data);
                // 		openContext.postMessage({ "type": "loadComplete", "data": data, "url": urls[i].url });
                // 	}
                // }))
                var index = 0;
                var loadFunc = function (d) {
                    if (d.type == Laya.Loader.IMAGE) {
                        wx.downloadFile({ url: Laya.URL.formatURL(d.url), success: function (res) {
                                openContext.postMessage({ "type": "templeteFile", "data": res, "url": d.url });
                                index++;
                                if (index < urls.length) {
                                    loadFunc(urls[index]);
                                }
                                else {
                                    completeHandler.run();
                                }
                            } });
                    }
                    else {
                        Laya.loader.load(d.url, Laya.Handler.create(this, function (res) {
                            openContext.postMessage({ "type": "loadComplete", "data": res, "url": d.url });
                            index++;
                            if (index < urls.length) {
                                loadFunc(urls[index]);
                            }
                            else {
                                completeHandler.run();
                            }
                        }), null, d.type);
                    }
                };
                loadFunc(urls[index]);
            };
            RankModule.prototype.loadComplete = function (url, d) {
                if (!this.isShareOpen)
                    return;
                var openContext = wx.getOpenDataContext();
                openContext.postMessage({ "type": "loadComplete", "data": d, "url": url });
            };
            RankModule.prototype.show = function (key, valueMsg) {
                if (!this.isShareOpen)
                    return;
                var openContext = wx.getOpenDataContext();
                openContext.postMessage({ "type": "open", "data": { key: key, valueMsg: valueMsg } });
            };
            RankModule.prototype.hide = function () {
                if (!this.isShareOpen)
                    return;
                var openContext = wx.getOpenDataContext();
                openContext.postMessage({ "type": "hide" });
            };
            RankModule.prototype.postMessage = function (type, d) {
                if (!this.isShareOpen)
                    return;
                var openContext = wx.getOpenDataContext();
                openContext.postMessage({ "type": type, "data": d });
            };
            Object.defineProperty(RankModule.prototype, "isShareOpen", {
                get: function () {
                    return Define.IsWeChat && Define.IsShareOpen;
                },
                enumerable: true,
                configurable: true
            });
            return RankModule;
        }());
        module.RankModule = RankModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=RankModule.js.map