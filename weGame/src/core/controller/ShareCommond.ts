/**
* name 
*/
module core.controller {
	export class ShareCommond extends CoreCommond {
		constructor() {
			super();
		}

		public execute(notification: INotification) {
			if (!notification.body) return;
			var callBack: wx.ShareCallback = notification.body.callBack;
			var icon: string = notification.body.icon ? notification.body.icon : Laya.URL.formatURL(coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share"));
			var title = notification.body.title ? notification.body.title : "球球大作战，欢乐球吃球";
			try {
				wx.shareAppMessage({
					title: title, imageUrl: icon, success: (d: wx.ShareRespose) => {
						debug.log(d);
						var msg = "";
						if (d.shareTickets && d.shareTickets.length > 0) {
							var shareCache: IShareCache = storageMgr.get("shareCache");
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
								shareTicket: ticketId, success: (d) => {
									var str=coreTools.unPackEncryptedData(d.encryptedData, d.iv,loginMgr.session_key);
									var groupInfo=str!=""?JSON.parse(str):null;
									if(groupInfo){
										var groupId=groupInfo.openGId;
										if (!shareCache.tickets[groupId] || shareCache.tickets[groupId] < 3) {
											callBack.call(null, d);
											shareCache.tickets[groupId] = (shareCache.tickets[groupId] || 0) + 1;
											storageMgr.save("shareCache", shareCache);
											return;
										}
										msg = "这个 群 的好友已经收到了你足够多的邀请诚意了哦，换个群再试试吧^_^";
										appMgr.showMsg(msg, null,null,null,"无效的分享 X_X");
									}
								}
							});
						} else {
							msg = "分享到 群 才能获得奖励喔，再试一下吧~";
							appMgr.showMsg(msg, null,null,null,"无效的分享 X_X");
						}
					}
				});
			} catch (e) {
				callBack.apply(null);
				debug.log("分享失败");
			}
		}
	}

	interface IShareCache {
		tickets: any;
		updateTime: number,
	}
}