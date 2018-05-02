/**
* name 
*/
module core.data {
	export class UserProxy extends DataProxy {
		constructor(name: string, data?: any) {
			super(name, data);
			if (!data) {
				this._createUser();
			}
		}

		private _createUser() {
			var d: IUseVo = {
				iLevel: 0,
				iLeaveTime: Laya.Browser.now(),
				iPoolEnergy: 0,
				iEnergy: 0,
				isInGame: false,
				iGuide: 0
			}
			this.setData(d);
		}

		public get userVo(): IUseVo {
			return this._data;
		}

		public addEnergy(num: number) {
			if (num <= 0) return;
			num *= Math.max(1, dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.ShouYiJiaCheng));
			this.userVo.iEnergy += num;
			this.sendNotification(this.cmd_update);
			this.sendNotification(this.cmd_EnergyUpdate, num);
		}

		public useEnergy(num: number): boolean {
			if (this.userVo.iEnergy < num) {
				return false;
			}
			this.userVo.iEnergy -= num;
			this.sendNotification(this.cmd_update);
			this.sendNotification(this.cmd_EnergyUpdate, -num);
			return true;
		}

		public addPoolEnergy(num: number) {
			if (num <= 0) return;
			this.userVo.iPoolEnergy += num;
			this.sendNotification(this.cmd_update);
		}

		public getPoolEnergy() {
			if (this.userVo.iPoolEnergy > 0) {
				this.addEnergy(this.userVo.iPoolEnergy)
				this.userVo.iPoolEnergy = 0;
				this.sendNotification(this.cmd_update);
			}
		}

		public getLeaveEnergy() {
			if (this.userVo.isInGame && gameGlobal.loginTime - this.userVo.iLeaveTime > Define.MinLeaveTime) {
				var hash = dataMgr.ballProxy.getData();
				var totalAttack = 0;
				for (var key in hash) {
					var ballVo: IBallVo = hash[key];
					totalAttack += formula.getBallRealAttack(ballVo.kId);
				}
				var maxTime = Define.MinLeaveTime + dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.LiXianShouYi);		//小时
				var liveTime = Math.min(Math.floor((gameGlobal.loginTime - this.userVo.iLeaveTime) / Define.MinLeaveTime), maxTime * 60);
				var liveEnergy = liveTime * Define.LeaveAttackCount * totalAttack * 10;
				appMgr.open(EnumAppName.LeavePanel, liveEnergy);
			}
			this.userVo.iLeaveTime = gameGlobal.loginTime;
			if (this.userVo.isInGame && dataMgr.unitProxy) dataMgr.unitProxy.checkChapterOver();
		}

		public reStart() {
			this.userVo.iEnergy = 0;
			this.userVo.iPoolEnergy = 0;
			this.userVo.iLevel = 0;
			this.userVo.isInGame = false;
		}

		public save() {
			this.userVo.iLeaveTime = Laya.Browser.now();
			var hash = dataMgr.ballProxy.getData();
			var totalAttack = 0;
			for (var key in hash) {
				var ballVo: IBallVo = hash[key];
				totalAttack += formula.getBallRealAttack(ballVo.kId);
			}
			var kId=dataMgr.skillProxy.getVipId();
			if(Define.IsWeChat){
				wx.setUserCloudStorage({KVDataList:[
					{key:EnumFriendKey.chapter,value:this.userVo.iLevel.toString()},
					{key:EnumFriendKey.power,value:totalAttack.toString()},
					{key:EnumFriendKey.vip,value:kId}]});
			}
			super.save();
		}

		public get cmd_EnergyUpdate(): string {
			return this._getCmd("energyUpdate");
		}
	}
}