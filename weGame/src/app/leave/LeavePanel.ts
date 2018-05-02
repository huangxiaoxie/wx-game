/**
* name 
*/
module app.leave {
	export class LeavePanel extends core.uiLib.AppBase {
		constructor() {
			super();
		}

		start(d: any) {
			super.start(d);
		}

		protected override_startInitMvc() {
			super.override_startInitMvc();
			this._registMediator(new LeavePanelMediator(EnumMediatorName.LeavePanel, this));
		}
	}


	class LeavePanelMediator extends framework.mvc.Mediator {
		private _panel: ui.ball.UI_LeavePanel;
		private _leaveEnergy: number = 0;
		constructor(name: string, viewCompoment?: any) {
			super(name, viewCompoment);
		}

		public onRegist() {
			super.onRegist();
			this._panel = <ui.ball.UI_LeavePanel>fairygui.UIPackage.createObject(EnumUIPackage.ball, "LeavePanel", ui.ball.UI_LeavePanel);
			this._viewCompoment.addChild(this._panel);
			this._viewCompoment.bindWH(this._panel);
			var d = this._viewCompoment.getData();
			this._panel.m_getBtn.onClick(this, () => {
				dataMgr.userProxy.addEnergy(this._leaveEnergy);
				appMgr.close(EnumAppName.LeavePanel);
			})
			var _self = this;
			this._panel.m_shareBtn.onClick(this, () => {
				this.sendNotification(EnumCommond.share, {
					callBack: () => {
						dataMgr.userProxy.addEnergy(_self._leaveEnergy * 2);
						appMgr.close(EnumAppName.LeavePanel);
					},title:"社会人推荐，猪猪佩奇最爱玩球球"
				})
			});
			this._panel.m_native.setSelectedPage("hide");
			Laya.Tween.to(this, { energy: d }, 1000, null, Laya.Handler.create(this, () => {
				this._panel.m_native.setSelectedPage(Laya.Browser.onIOS? "ios" : "android");
			}));
		}

		public set energy(val: number) {
			this._leaveEnergy = val;
			this._panel.m_energyTxt.text = formula.numToShowStr(this._leaveEnergy);
		}

		public get energy(): number {
			return this._leaveEnergy;
		}
	}
}