/**
* name 
*/
module app.ball {
	export class BallItem extends ui.ball.UI_BallItem {
		private _ballRes: SeResBall;
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			this.m_upBtn.onClick(this, this._clickUpBtn);
			this.m_lockBtn.onClick(this, this._clickUnLock);
			this.m_upBtn.on(Laya.Event.MOUSE_DOWN, this, this._startUpLevel);
			this.m_upBtn.on(Laya.Event.MOUSE_UP, this, this._stopUpLevel);
			this.m_upBtn.on(Laya.Event.MOUSE_OUT, this, this._stopUpLevel);
		}

		public setData(kId: string) {
			this._ballRes = dataMgr.sys_ballHash.getData(kId);
			this.m_nameTxt.text = this._ballRes.kName;
			this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, this._ballRes.kIcon);
			this.update();
		}

		public update() {
			var ballVo: IBallVo = dataMgr.ballProxy.getBall(this._ballRes.kId);
			var cost = formula.getCost(this._ballRes.kId, ballVo ? ballVo.iLevel + 1 : 1);
			var isEnergyEnough = dataMgr.userProxy.userVo.iEnergy >= cost;
			if (ballVo) {
				this.m_lvTxt.visible = true;
				this.m_lvTxt.text = "Lv." + ballVo.iLevel.toString();
				this.m_attackTxt.text = formula.numToShowStr(formula.getBallAttack(this._ballRes.kId, ballVo.iLevel));
				this.m_upBtn.text = formula.numToShowStr(cost);
				if (isEnergyEnough) {
					this.m_lockState.setSelectedPage("normal");
				} else {
					this.m_lockState.setSelectedPage("noEnough");
				}
			} else {
				this.m_lvTxt.visible = false;
				this.m_attackTxt.text = formula.numToShowStr(this._ballRes.iAttack);
				var isOpen = dataMgr.userProxy.userVo.iLevel >= this._ballRes.iOpenLevel;
				this.m_lockBtn.text = isOpen ? formula.numToShowStr(cost) : "关卡" + this._ballRes.iOpenLevel;
				if (isEnergyEnough && isOpen) {
					this.m_lockState.setSelectedPage("canUnlock");
				} else {
					this.m_lockState.setSelectedPage("lock");
				}
			}
		}

		private _startUpLevel() {
			Laya.timer.once(300, this, this._startLoop);
		}

		private _startLoop() {
			Laya.timer.frameLoop(1, this, this._clickUpBtn);
		}

		private _stopUpLevel() {
			Laya.timer.clear(this, this._startLoop);
			Laya.timer.clear(this, this._clickUpBtn);
		}

		private _clickUpBtn() {
			dataMgr.ballProxy.levelUp(this._ballRes.kId);
		}

		private _clickUnLock() {
			if (this._ballRes.eType == SeEnumBalleType.MoFaQiu) {
				var _self = this;
				appMgr.showMsg("解锁魔法球将重置所有等级，\n是否确认解锁？", ["确定", "取消"], () => {
					dataMgr.ballProxy.levelUp(_self._ballRes.kId);
				})
			} else {
				dataMgr.ballProxy.levelUp(this._ballRes.kId);
			}
		}

		public dispose() {
			this._ballRes = null;
		}
	}
}