/**
* name 
*/
module core.data {
	export class ScoreUnitProxy extends DataProxy {
		private _currChaperDamage: number;
		private _totalChapterHp: number;
		constructor(name: string, data?: any) {
			super(name, data);
		}

		public setData(d: any) {
			this._data = d;
			var level = dataMgr.userProxy.userVo.iLevel;
			var chapterRes = dataMgr.sys_chapter.getData(level.toString());
			if (!chapterRes) return;
			this._currChaperDamage = 0;
			var remaidHp = 0;
			for (var key in d) {
				var unitVo: IScoreUnitVo = d[key];
				this._currChaperDamage += (chapterRes.iHp - unitVo.iHp);
				remaidHp += unitVo.iHp;
			}
			this._totalChapterHp = chapterRes.iUnitNum * chapterRes.iHp;
			if (remaidHp == 0) {
				this._currChaperDamage = this._totalChapterHp;
			}
		}

		public damageUnit(id: number, damage: number) {
			var unitVo: IScoreUnitVo = this._data[id];
			if (unitVo && unitVo.iHp>0) {
				if (unitVo.iHp > damage) {
					unitVo.iHp -= damage;
				} else {
					damage = unitVo.iHp;
					unitVo.iHp = 0;
				}
				this._currChaperDamage += damage;
				dataMgr.userProxy.addPoolEnergy(damage);
				this.checkChapterOver();
				return true;
			}
			return false;
		}

		public checkChapterOver() {
			if (this._data && dataMgr.userProxy && dataMgr.userProxy.userVo) {
				var level = dataMgr.userProxy.userVo.iLevel;
				var chapterRes = dataMgr.sys_chapter.getData(level.toString());
				var remaidHp = 0;
				this._currChaperDamage = 0;
				for (var key in this._data) {
					var unitVo: IScoreUnitVo = this._data[key];
					this._currChaperDamage += (chapterRes.iHp - unitVo.iHp);
					remaidHp += unitVo.iHp;
				}
				this._totalChapterHp = chapterRes.iUnitNum * chapterRes.iHp;
				if (remaidHp == 0) {
					this._currChaperDamage = this._totalChapterHp;
				}
			}
			if (this._totalChapterHp - this._currChaperDamage < 1) {
				this.sendNotification(this.cmd_allDead);
			}
		}

		public reStart() {
			this._data = {};
		}

		public get chapterDamage(): number {
			return this._currChaperDamage;
		}

		public get cmd_allDead(): string {
			return this._getCmd("alldead");
		}
	}
}