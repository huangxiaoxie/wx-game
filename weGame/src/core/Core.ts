/**
* name 
*/
module core{
	export var formula=core.utils.Formula;
	export var timeTools=core.utils.TimeTools;
	export var coreTools = core.utils.CoreTools;
	export function start(){
		framework.native.DebugTool.Is_Debug=Define.Debug;
		module.PayModule.IS_Test=Define.Debug;
		loadingMgr=new module.LoadingModule();
		appMgr=new module.AppModule();
		initMgr=new module.InitModule();
		resMgr=new module.ResModule();
		payMgr=new module.PayModule();
		netMgr=new module.NetModule();
		loginMgr=new module.LoginModule();
		dataMgr=new module.DataModule();
		storageMgr=new module.StorageModule();
		rankModule=new module.RankModule();
		initMgr.startInit();
		if(Define.IsWeChat){
			wx.showShareMenu({withShareTicket:true});
			wx.onShareAppMessage((res:any)=>{
				return {title:"这游戏有毒，点进去就中毒了…",imageUrl:Laya.URL.formatURL(coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share"))};
			});
		}
		try {
			wx.onHide(()=>{
				storageMgr.saveData();
			});
		} catch (e) {
			window.onbeforeunload = ()=>{
				storageMgr.saveData();
			};
		}
		gameGlobal.loginTime=Laya.Browser.now();
		try{
			wx.onShow(()=>{
				gameGlobal.loginTime=Laya.Browser.now();
				dataMgr.checkLeaveTime();
			})
		}catch(e){
			window.onload=()=>{
				gameGlobal.loginTime=Laya.Browser.now();
				dataMgr.checkLeaveTime();
			};
		}

		if(Define.QuickKey){
			Laya.stage.on(Laya.Event.KEY_PRESS,this,(e:Laya.Event)=>{
				var key=String.fromCharCode(e.keyCode)
				switch(key){
					case "T":
					case "t":
						appMgr.open(EnumAppName.Login);
						break;
				}
			});
		}
	}

	export function showLoading(msg:string){
		debug.log(msg);
		loadingMgr && loadingMgr.showLoading(msg);
	}

	export function hideLoading(){
		loadingMgr && loadingMgr.hideLoading();
	}
}
var appMgr:core.module.AppModule;
var initMgr:core.module.InitModule;
var resMgr:core.module.ResModule;
var payMgr:core.module.PayModule;
var netMgr:core.module.NetModule;
var loginMgr:core.module.LoginModule;
var dataMgr:core.module.DataModule;
var storageMgr:core.module.StorageModule;
var rankModule:core.module.RankModule;
var loadingMgr:core.module.LoadingModule;