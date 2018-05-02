/**
* name 
*/
module app.login {
	export class Login extends core.uiLib.AppBase {
		constructor() {
			super();
		}

		start(d: any) {
			super.start(d);
		}

		protected override_startInitMvc() {
			super.override_startInitMvc();
			this._registMediator(new LoginMediator(EnumMediatorName.Login, this));
		}
	}


	class LoginMediator extends framework.mvc.Mediator {
		private _panel: TestPage;
		constructor(name: string, viewCompoment?: any) {
			super(name, viewCompoment);
		}

		public onRegist() {
			super.onRegist();
			this._panel = <TestPage>fairygui.UIPackage.createObject("ball", "TestPage", TestPage);
			this._viewCompoment.addChild(this._panel);
		}
	}

	class TestPage extends ui.ball.UI_TestPage {
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			this.m_loginBtn.onClick(this, () => {
				netMgr.connect();
			});
			this.m_getBtn.onClick(this,()=>{
				payMgr.getBalance();
			});
			this.m_payBtn.onClick(this,()=>{
				payMgr.pay(1);
			})
			
			this.m_giveBtn.onClick(this,()=>{
				payMgr.present(this.m_nameTxt.text?parseInt(this.m_nameTxt.text):10,this.m_pwdTxt.text);
			})
			this.m_closeBtn.onClick(this,()=>{
				appMgr.close(EnumAppName.Login);
			})
		}
	}
}