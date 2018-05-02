/**
* name 
*/
module core.module {
	export class StorageModule {
		private _storageList: Array<any>;
		constructor() {

		}

		public init() {
			this._storageList = [];
			this._registFunc(EnumProxyName.Ball, (d: any) => {
				this._registProxy(new data.BallProxy(EnumProxyName.Ball, d));
			});
			this._registFunc(EnumProxyName.User, (d: any) => {
				this._registProxy(new data.UserProxy(EnumProxyName.User, d));
			});
			this._registFunc(EnumProxyName.ScoreUnit, (d: any) => {
				this._registProxy(new data.ScoreUnitProxy(EnumProxyName.ScoreUnit, d));
			});
			this._registFunc(EnumProxyName.SkillBuffer, (d: any) => {
				this._registProxy(new data.SkillProxy(EnumProxyName.SkillBuffer, d));
			});
			this._doNextFun();
		}

		public save(key: string, d: any) {
			try {
				debug.log(key+"---存储--",d);
				wx.setStorageSync(key, d);
			} catch (e) {
				localStorage.setItem(key, d ? JSON.stringify(d) : "");
			}
		}

		public get(key:string):any{
			try {
				return wx.getStorageSync(key);
			} catch (e) {
				var str=localStorage.getItem(key);
				if(str){
					return JSON.parse(str);
				}
				return null;
			}
		}

		private _registFunc(key: string, method: Function) {
			this._storageList.push([key, method])
		}

		private _registProxy(proxy: IProxy) {
			framework.mvc.Facade.getInstance().registProxy(proxy);
		}

		private _doNextFun() {
			if (this._storageList.length > 0) {
				var key = this._storageList[0][0];
				var _self = this;
				var method: Function = this._storageList[0][1];
				this._storageList.shift();
				try {
					wx.getStorage({
						key: key, success: (res: wx.DataResponse) => {
							method.call(_self, res.data);
							this._doNextFun();
						}, fail: () => {
							method.call(_self, null);
							this._doNextFun();
						}
					});
				} catch (e) {
					var str = localStorage.getItem(key);
					var obj=str ? JSON.parse(str) : null;
					method.call(_self, obj);
					this._doNextFun();
				}
			} else {
				initMgr.nextStep();
			}
		}

		public saveData() {
			dataMgr.userProxy && dataMgr.userProxy.save();
			dataMgr.ballProxy && dataMgr.ballProxy.save();
			dataMgr.unitProxy && dataMgr.unitProxy.save();
			dataMgr.skillProxy && dataMgr.skillProxy.save();
		}
	}
}