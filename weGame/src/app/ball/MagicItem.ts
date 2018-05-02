/**
* name 
*/
module app.ball {
	export class MagicItem extends ui.ball.UI_MagicItem {
		private _magicRes: SeResSkill;
		private _buffVo: ISkillVo;
		private _isTimeRun: boolean = false;
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			var _self = this;
			this.m_buyBtn.onClick(this, () => {
				framework.mvc.Facade.getInstance().sendNotification(EnumCommond.share,{callBack:()=>{
					dataMgr.skillProxy.addBuffer(_self._magicRes.kId);
					_self.update();
				},title:"欢乐球球大作战，一起来玩吧~",imageUrl:Laya.URL.formatURL(coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share"))});
			})
		}

		public setData(kId: string) {
			this._magicRes = dataMgr.sys_skill.getData(kId);
			this.m_nameTxt.text = this._magicRes.kName;
			this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, this._magicRes.kIcon);
			this.m_timeTxt.text = "时间:" + this._magicRes.kTime;
			this.update();
		}

		public update() {
			var bufferVo: ISkillVo = dataMgr.skillProxy.getBuffer(this._magicRes.kId);
			this._buffVo = bufferVo;
			if (bufferVo && bufferVo.endTime != -1 && this._buffVo.endTime > Laya.Browser.now()) {
				if (!this._isTimeRun) {
					this._isTimeRun = true;
					Laya.timer.loop(1000, this, this._updateTime);
				}
				this.m_state.setSelectedPage("get");
			} else {
				this.m_state.setSelectedPage("normal");
				if (this._isTimeRun) {
					this._isTimeRun = false;
					Laya.timer.clear(this, this._updateTime);
				}
			}
		}

		private _updateTime() {
			var remaidTime = Math.round((this._buffVo.endTime - Laya.Browser.now()) / 1000);
			if (remaidTime <= 0) {
				this._isTimeRun = false;
				Laya.timer.clear(this, this._updateTime);
				this.m_timeTxt.text = "时间:" + this._magicRes.kTime;
				this.m_state.setSelectedPage("normal");
			}
			else {
				this.m_timeTxt.text = timeTools.format(remaidTime);
			}
		}

		public dispose() {
			this._isTimeRun = false;
			this._magicRes = null;
			this._buffVo = null;
			Laya.timer.clearAll(this);
			super.dispose();
		}
	}
}