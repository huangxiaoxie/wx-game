/**
* name 
*/
module app.rank {
	export class RankPanel extends core.uiLib.AppBase {
		constructor() {
			super();
		}

		start(d: any) {
			super.start(d);
		}

		protected override_startInitMvc() {
			super.override_startInitMvc();
			this._registMediator(new RankMediator(EnumMediatorName.RankPanel, this));
		}
	}


	class RankMediator extends framework.mvc.Mediator {
		private _panel: ui.ball.UI_RankPanel;
		private _leaveEnergy: number = 0;
		private _listSp:Laya.Sprite;
		constructor(name: string, viewCompoment?: any) {
			super(name, viewCompoment);
		}

		public onRegist() {
			super.onRegist();
			this._panel = <ui.ball.UI_RankPanel>fairygui.UIPackage.createObject(EnumUIPackage.ball, "RankPanel");
			this._viewCompoment.addChild(this._panel);
			this._viewCompoment.bindWH(this._panel);
			this._panel.m_closeBtn.onClick(this,()=>{
				appMgr.close(EnumAppName.RankPanel);
			});
			this._panel.m_powerTab.onClick(this,()=>{
				rankModule.show(EnumFriendKey.power,"能力:{value}");
			})

			this._panel.m_chapterTab.onClick(this,()=>{
				rankModule.show(EnumFriendKey.chapter,"关卡:{value}");
			})
			rankModule.show(EnumFriendKey.power,"能力:{value}");
			if(Define.IsWeChat){
				let openDataContext = wx.getOpenDataContext()
				let sharedCanvas = openDataContext.canvas;
				sharedCanvas.width=625;
				sharedCanvas.height=756;
				this._listSp = new Laya.Sprite();
				this._panel.m_listCon.displayObject.addChild(this._listSp);
				this._listSp.x=(this._panel.m_listCon.width-sharedCanvas.width)/2;
				Laya.timer.once(400,this,this._renderFunc);
			}
		}

		private _renderFunc(){
			if(Laya.Browser.onMiniGame && this._listSp && !this._listSp.destroyed){
				var rankTexture = new Laya.Texture(Laya.Browser.window.sharedCanvas);
				rankTexture.bitmap.alwaysChange = true;//小游戏使用，非常费，每帧刷新
				this._listSp.graphics.drawTexture(rankTexture,0,0,rankTexture.width,rankTexture.height);
			}	
		}

		public onRemove(){
			rankModule.hide();
			Laya.timer.clear(this,this._renderFunc);
			this._listSp=null;
			super.onRemove();
		}
	}
}