/**
* name 
*/
module app.notice {
	export class NoticePanel extends core.uiLib.AppBase {
		constructor() {
			super();
		}

		start(d: any) {
			super.start(d);
		}

		protected override_startInitMvc() {
			super.override_startInitMvc();
			this._registMediator(new NoticeMediator(EnumMediatorName.NoticePanel, this));
		}
	}


	class NoticeMediator extends framework.mvc.Mediator {
		private _panel: ui.ball.UI_NoticePanel;
		private _leaveEnergy: number = 0;
		constructor(name: string, viewCompoment?: any) {
			super(name, viewCompoment);
		}

		public onRegist() {
			super.onRegist();
			this._panel = <ui.ball.UI_NoticePanel>fairygui.UIPackage.createObject(EnumUIPackage.ball, "NoticePanel");
			this._viewCompoment.addChild(this._panel);
			this._viewCompoment.bindWH(this._panel);
			var d = this._viewCompoment.getData();
			this._panel.m_msgTxt.text = d.msg;
			this._panel.m_titleTxt.text = d.title;
			var btnArr:Array<string>=d.btnArr;
			if(!btnArr){
				btnArr=["确定"];
			}
			if(btnArr.length<2){
				this._panel.m_type.setSelectedIndex(0);
			}else{
				this._panel.m_type.setSelectedIndex(1);
				this._panel.m_noBtn.text=btnArr[1];
			}
			this._panel.m_okBtn.text=btnArr[0];
			var okMethod=d.success;
			var noMethod=d.fail;
			this._panel.m_okBtn.onClick(this, () => {
				appMgr.close(EnumAppName.NoticePanel);
				okMethod && okMethod.call(null);
			});
			this._panel.m_noBtn.onClick(this,()=>{
				appMgr.close(EnumAppName.NoticePanel);
				noMethod && noMethod.call(null);
			});
		}
	}
}