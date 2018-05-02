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
/**
* name
*/
var core;
(function (core) {
    var controller;
    (function (controller) {
        var ShareCommond = /** @class */ (function (_super) {
            __extends(ShareCommond, _super);
            function ShareCommond() {
                return _super.call(this) || this;
            }
            ShareCommond.prototype.execute = function (notification) {
                if (!notification.body)
                    return;
                var callBack = notification.body.callBack;
                var icon = notification.body.icon ? notification.body.icon : Laya.URL.formatURL(core.coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share"));
                var title = notification.body.title ? notification.body.title : "球球大作战，欢乐球吃球";
                try {
                    wx.shareAppMessage({
                        title: title, imageUrl: icon, success: function (d) {
                            debug.log(d);
                            var msg = "";
                            if (d.shareTickets && d.shareTickets.length > 0) {
                                var shareCache = storageMgr.get("shareCache");
                                if (!shareCache || !shareCache.tickets) {
                                    shareCache = { tickets: {}, updateTime: Laya.Browser.now() };
                                }
                                var nowD = new Date();
                                var updateD = new Date(shareCache.updateTime);
                                nowD.setHours(0, 0, 0, 0);
                                updateD.setHours(0, 0, 0, 0);
                                if (nowD.getTime() - updateD.getTime() >= 24 * 3600 * 1000) {
                                    shareCache.tickets = {};
                                }
                                shareCache.updateTime = Laya.Browser.now();
                                var ticketId = d.shareTickets[0];
                                wx.getShareInfo({
                                    shareTicket: ticketId, success: function (d) {
                                        var str = core.coreTools.unPackEncryptedData(d.encryptedData, d.iv, loginMgr.session_key);
                                        var groupInfo = str != "" ? JSON.parse(str) : null;
                                        if (groupInfo) {
                                            var groupId = groupInfo.openGId;
                                            if (!shareCache.tickets[groupId] || shareCache.tickets[groupId] < 3) {
                                                callBack.call(null, d);
                                                shareCache.tickets[groupId] = (shareCache.tickets[groupId] || 0) + 1;
                                                storageMgr.save("shareCache", shareCache);
                                                return;
                                            }
                                            msg = "这个 群 的好友已经收到了你足够多的邀请诚意了哦，换个群再试试吧^_^";
                                            appMgr.showMsg(msg, null, null, null, "无效的分享 X_X");
                                        }
                                    }
                                });
                            }
                            else {
                                msg = "分享到 群 才能获得奖励喔，再试一下吧~";
                                appMgr.showMsg(msg, null, null, null, "无效的分享 X_X");
                            }
                        }
                    });
                }
                catch (e) {
                    callBack.apply(null);
                    debug.log("分享失败");
                }
            };
            return ShareCommond;
        }(controller.CoreCommond));
        controller.ShareCommond = ShareCommond;
    })(controller = core.controller || (core.controller = {}));
})(core || (core = {}));
//# sourceMappingURL=ShareCommond.js.map