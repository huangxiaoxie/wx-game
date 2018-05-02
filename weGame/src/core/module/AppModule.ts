/**
* name 
*/
module core.module {
	export class AppModule {
		private _appList: Array<IAppInfo>;
		private _popList: Array<EnumAppName>;
		constructor() {
			this._appList = [];
			this._popList = [];
			this._registApp(EnumAppName.Login, app.login.Login);
			this._registApp(EnumAppName.GamePanel, app.ball.IdleBall);
			this._registApp(EnumAppName.LeavePanel, app.leave.LeavePanel);
			this._registApp(EnumAppName.NoticePanel, app.notice.NoticePanel);
			this._registApp(EnumAppName.RankPanel, app.rank.RankPanel);
		}

		private _registApp(name: EnumAppName, appCls: Function) {
			this._appList[name] = { name: name, appBase: appCls };
		}

		public open(name: EnumAppName, data?: any) {
			var appInfo = this._appList[name];
			if (!appInfo) {
				debug.throwError("界面" + name + "尚未注册");
				return;
			}
			var appItem = appInfo.appItem;
			if (appItem) {
				var index = this._popList.indexOf(name);
				index > -1 && this._popList.splice(index, 1);
				this._popList.unshift(name);
			} else {
				appItem = new appInfo.appBase();
				this._popList.unshift(name);
			}
			fairygui.GRoot.inst.addChild(appItem);
			appItem.width = fairygui.GRoot.inst.width;
			appItem.height = fairygui.GRoot.inst.height;
			appItem.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Width);
			appItem.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Height);
			if (appInfo.appItem) {
				appInfo.appItem.reStart(data);
			} else {
				appInfo.appItem = appItem;
				appItem.start(data);
			}
		}

		public close(name: EnumAppName) {
			var appInfo = this._appList[name];
			if (!appInfo) {
				debug.throwError("界面" + name + "尚未注册");
				return;
			}
			if (appInfo.appItem) {
				var index = this._popList.indexOf(name);
				index > -1 && this._popList.splice(index, 1);
				appInfo.appItem.close();
				appInfo.appItem = null;
			} else {
				debug.log("界面:" + name + "尚未打开");
			}
		}

		public showMsg(msg: string, btnArr?: Array<string>, okMethod?: Function, noMethod?: Function, title: string = "提示") {
			// if(Define.IsWeChat){
			this.open(EnumAppName.NoticePanel, { msg: msg, title: title, btnArr: btnArr, success: okMethod, fail: noMethod });
			// wx.showModal({title:"球球大冒险",content:msg,showCancel:false,cancelText:"",confirmText:"确定"});
			// }
		}
	}

	interface IAppInfo {
		name: EnumAppName,
		appBase: any,
		appItem?: core.uiLib.AppBase,
	}
}