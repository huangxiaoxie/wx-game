/**
* name 
*/
module core.data {
	export class SkillProxy extends DataProxy {
		private _buffValueHash: any;
		constructor(name: string, data?: any) {
			super(name, data);
			if (!data) {
				this.setData({});
			}
		}

		public setData(d: any) {
			super.setData(d || {});
			this._updateBuffValue();
		}

		public getBuffValue(type: SeEnumSkilleType): number {
			if(!this._buffValueHash)return;
			var valueVo = this._buffValueHash[type];
			if (valueVo && valueVo.updateTime < Laya.Browser.now()) {
				this._updateBuffValue();
				valueVo = this._buffValueHash[type];
			}

			if (valueVo) return valueVo.value;
			return 0;
		}

		public getBuffer(skillId: string): ISkillVo {
			return this._data[skillId];
		}

		public addBuffer(skillId: string) {
			var skillRes = dataMgr.sys_skill.getData(skillId);
			var time = formula.timeStrToNumber(skillRes.kTime);
			var bufferVo: ISkillVo = this.getBuffer(skillId);
			if (bufferVo) {
				if (bufferVo.endTime == -1 || entTime == -1) {
					bufferVo.endTime = -1;
				} else {
					bufferVo.endTime += time * 1000;
				}
				return;
			}
			var entTime = time == -1 ? -1 : (time * 1000 + Laya.Browser.now());
			bufferVo = {
				kId: skillRes.kId,
				endTime: entTime,
				type: skillRes.eType,
				value: skillRes.iValue
			}
			this._data[bufferVo.kId] = bufferVo;
			var valueVo = this._buffValueHash[bufferVo.type];
			if (!valueVo) {
				valueVo = { value: bufferVo.value, updateTime: bufferVo.endTime };
				this._buffValueHash[bufferVo.type] = valueVo;
			} else {
				valueVo.value += bufferVo.value;
				valueVo.updateTime = bufferVo.endTime == -1 ? valueVo.updateTime : Math.min(bufferVo.endTime, valueVo.updateTime);
			}
			this.sendNotification(this.cmd_update);
		}

		public getVipId():string{
			var kid:string="";
			var kValue:number=0;
			for(var key in this._data){
				var buffVo:ISkillVo=this._data[key];
				if(buffVo.type==SeEnumSkilleType.ShouYiJiaCheng && buffVo.endTime==-1){
					if(kid=="" || kValue<buffVo.value){
						kid=buffVo.kId;
						kValue=buffVo.value;
					}
				}
			}
			return kid;
		}

		private _updateBuffValue() {
			this._buffValueHash = {};
			if (!this._data) return;
			var now = Laya.Browser.now();
			for (var id in this._data) {
				var bufferVo: ISkillVo = this._data[id];
				if (bufferVo.endTime == -1 || now < bufferVo.endTime) {
					var valueVo: IBuffValueVo = this._buffValueHash[bufferVo.type];
					if (!valueVo) {
						valueVo = { value: bufferVo.value, updateTime: bufferVo.endTime };
						this._buffValueHash[bufferVo.type] = valueVo;
					} else {
						valueVo.value += bufferVo.value;
						valueVo.updateTime = bufferVo.endTime == -1 ? valueVo.updateTime : Math.min(bufferVo.endTime, valueVo.updateTime);
					}
				}else{
					delete this._data[id];
				}
			}
		}
	}

	interface IBuffValueVo {
		value: number,
		updateTime: number,
	}
}