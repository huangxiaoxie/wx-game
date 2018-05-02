/**
* name 
*/
module app.ball {
	export enum EnumChargeItemType {
		Recharge,
		Cost,
	}
	export class RechargeItem extends ui.ball.UI_RechargeItem {
		private _type: EnumChargeItemType;
		private _kid: string;
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			this.m_rechargeBtn.onClick(this, () => {
				var rechargeRes = dataMgr.sys_recharge.getData(this._kid);
				if (!rechargeRes) return;
				payMgr.buyMoney(rechargeRes.iPrice * 10);
			})
			this.m_buyBtn.onClick(this, () => {
				var skillRes = dataMgr.sys_skill.getData(this._kid);
				if (!skillRes) return;
				payMgr.pay(skillRes.iPrice, () => {
					dataMgr.skillProxy.addBuffer(this._kid);
					storageMgr.saveData();
				}, () => {
					appMgr.showMsg("钻石不足");
				});
			})
		}

		public setData(d: { kId: string, type: EnumChargeItemType }) {
			this._type = d.type;
			this._kid = d.kId;
			if (this._type == EnumChargeItemType.Cost) {
				var bufferVo: ISkillVo = dataMgr.skillProxy.getBuffer(d.kId);
				if (bufferVo) {
					this.m_type.setSelectedPage("get");
				} else {
					this.m_type.setSelectedPage("cost");
				}
				var skillRes = dataMgr.sys_skill.getData(d.kId);
				this.m_nameTxt.text = skillRes.kName;
				this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, skillRes.kIcon);
				this.m_buyBtn.text = skillRes.iPrice.toString();
			} else {
				this.m_type.setSelectedPage("recharge");
				var rechargeRes = dataMgr.sys_recharge.getData(d.kId);
				this.m_moneyTxt.text = (rechargeRes.iPrice * 10).toString();
				this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, rechargeRes.kIcon);
				this.m_rechargeBtn.text = "￥	" + rechargeRes.iPrice;
			}
			this.update();
		}

		public update() {

		}

		public dispose() {
		}
	}
}