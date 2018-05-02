/**
* name 
*/
module core.data {
	export class DataProxy extends framework.mvc.Proxy {
		constructor(name: string, data?: any) {
			super(name, data);
		}

		public save() {
			storageMgr.save(this.name, this._data);
		}

		public get cmd_update(): string {
			return this._getCmd(EnumDataState.Update);
		}

		public get cmd_add(): string {
			return this._getCmd(EnumDataState.Add);
		}

		public get cmd_delete(): string {
			return this._getCmd(EnumDataState.Delete);
		}

		protected _getCmd(type: string): string {
			return this.name + "." + type;
		}
	}
}

interface IScoreUnitVo {
	x: number,
	y: number,
	iHp: number,
	kSkin: string,
	id: number,
}

interface IBallVo {
	x?: number,
	y?: number,
	velocity?: { x: number, y: number },
	kId: string,
	iLevel: number,
}

interface IUseVo {
	iLevel: number,
	iPoolEnergy: number,			//可领取的能量
	iEnergy: number,				//当前能量
	iLeaveTime: number,			//上次离线时间
	isInGame: boolean,			//是否在游戏中
	iGuide:number,					//引导步骤
}

interface ISkillVo {
	kId: string;						//技能id
	endTime: number,					//结束时间，-1为永久
	type: SeEnumSkilleType,			//buff类型
	value: number,
}