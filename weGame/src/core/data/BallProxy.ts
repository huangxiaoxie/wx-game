/**
* name 
*/
module core.data {
	export class BallProxy extends DataProxy {
		private _clickBallId: string;
		constructor(name: string, data?: any) {
			super(name, data);
			if (!data) {
				this._createUser();
			}
		}

		private _createUser() {
			var d = {};
			this._initBall(d);
		}

		private _initBall(d){
			var hash = dataMgr.sys_ballHash.getAllRes();
			for (var key in hash) {
				var ballRes: SeResBall = hash[key];
				if (ballRes.iLevel > 0) {
					var ballVo: IBallVo = {
						kId: ballRes.kId,
						iLevel: ballRes.iLevel,
					};
					d[ballRes.kId] = ballVo;
				}
			}
			this.setData(d);
		}

		public getBall(kId: string): IBallVo {
			return this._data[kId];
		}

		public levelUp(kId: string) {
			var ballVo = this.getBall(kId);
			var ballRes = dataMgr.sys_ballHash.getData(kId);
			var cost = formula.getCost(ballRes.kId, ballVo ? ballVo.iLevel + 1 : 1);
			if (!dataMgr.userProxy.useEnergy(cost)) return;
			if (ballVo) {
				ballVo.iLevel++;
				this.sendNotification(this.cmd_update, ballVo);
			} else {
				ballVo = { kId: kId, iLevel: 1 };
				this._data[kId] = ballVo;
				if(ballRes.eType==SeEnumBalleType.MoFaQiu){
					dataMgr.reStart();
				}else{
					this.sendNotification(this.cmd_add, ballVo);
				}
			}
		}

		public reStart() {
			for(var key in this._data){
				var ballVo:IBallVo=this._data[key];
				var ballRes = dataMgr.sys_ballHash.getData(ballVo.kId);
				if(ballRes.eType!=SeEnumBalleType.MoFaQiu){
					delete this._data[key];
				}
			}
			this._initBall(this._data);
		}


		public get clickBall(): IBallVo {
			if (this._clickBallId) {
				return this.getBall(this._clickBallId);
			}
			for (var key in this._data) {
				var ballVo: IBallVo = this._data[key];
				var ballRes: SeResBall = dataMgr.sys_ballHash.getData(ballVo.kId);
				if (ballRes.eType == SeEnumBalleType.DianJi) {
					this._clickBallId = ballVo.kId;
					return ballVo;
				}
			}
		}

		public save(){
			super.save();
		}
	}
}