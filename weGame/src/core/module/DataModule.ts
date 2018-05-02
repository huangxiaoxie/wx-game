/**
* name 
*/
module core.module {
	export class DataModule {
		private _loadingNum: number = 0;
		public sys_ballHash: DataHash<SeResBall>;
		public sys_chapter: DataHash<SeResChapter>;
		public sys_skill: DataHash<SeResSkill>;
		public sys_recharge: DataHash<SeResRecharge>;
		constructor() {
		}

		public loadStaticData() {
			this.sys_ballHash = this._addStaticData("res/table/Ball.json");
			this.sys_chapter = this._addStaticData("res/table/Chapter.json", "iLevel");
			this.sys_skill = this._addStaticData("res/table/Skill.json");
			this.sys_recharge = this._addStaticData("res/table/Recharge.json");
		}

		public get userProxy(): data.UserProxy {
			return this._getProxy<data.UserProxy>(EnumProxyName.User);
		}

		public get ballProxy(): data.BallProxy {
			return this._getProxy<data.BallProxy>(EnumProxyName.Ball);
		}

		public get unitProxy(): data.ScoreUnitProxy {
			return this._getProxy<data.ScoreUnitProxy>(EnumProxyName.ScoreUnit);
		}

		public get skillProxy(): data.SkillProxy {
			return this._getProxy<data.SkillProxy>(EnumProxyName.SkillBuffer);
		}

		public checkLeaveTime(){
			if(this.userProxy){
				this.userProxy.getLeaveEnergy();
			}
		}

		public reStart(){
			framework.mvc.Facade.getInstance().sendNotification(EnumCommond.reStart);
			this.userProxy.reStart();
			this.unitProxy.reStart();
			this.ballProxy.reStart();
		}

		private _addStaticData<T>(url: string, keyName?: string): DataHash<T> {
			var dataHash = new DataHash<T>(url, keyName);
			this._loadingNum++;
			dataHash.once("complete", this, this._dataInited);
			return dataHash;
		}

		private _registProxy(proxy: IProxy) {
			framework.mvc.Facade.getInstance().registProxy(proxy);
		}

		private _getProxy<T>(name: string): T {
			return <any>(framework.mvc.Facade.getInstance().getProxy(name)) as T;
		}

		private _dataInited() {
			this._loadingNum--;
			if (this._loadingNum == 0) {
				initMgr.nextStep();
			}
		}
	}

	export class DataHash<T> extends Laya.EventDispatcher {
		private _hash: any;
		private _keyName: string;
		constructor(d: any, keyName?: string) {
			super();
			this._keyName = keyName;
			this._hash = {};
			if (typeof d == "string") {
				Laya.loader.load(d, Laya.Handler.create(this, this._install));
			} else {
				Laya.timer.callLater(this, this._install, [d]);
			}
		}

		protected _install(d: any) {
			for (var key in d) {
				var realKey = this._keyName ? d[key][this._keyName] : key;
				this._hash[realKey] = this._createItem(d[key]);
			}
			this.event("complete");
		}

		protected _createItem(d: any): T {
			return d;
		}

		public getData(key: string): T {
			return this._hash[key];
		}

		public getAllRes() {
			return this._hash;
		}
	}
}