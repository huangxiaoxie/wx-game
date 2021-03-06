/**
* name 
*/
module core.module {
	export class InitModule {
		private _total: number = 0;
		private _curr: number = 0;
		private _index: number = -1;
		private _stepList: Array<IInitStepItem>;
		constructor() {

		}

		public startInit() {
			this._stepList = [];
			this._registStep(resMgr, resMgr.loadStart, 1,"",Laya.Handler.create(this,this._showStartPanel));
			this._registStep(resMgr, resMgr.loadPre, 1);
			this._registStep(loginMgr, loginMgr.login, 1);
			this._registStep(this, this._initShellCommond, 1);
			this._registStep(payMgr, payMgr.init, 1);
			this._registStep(dataMgr, dataMgr.loadStaticData, 1);
			this._registStep(storageMgr, storageMgr.init, 1);
			this.nextStep();
		}

		public nextStep() {
			var preStep: IInitStepItem = this._stepList[this._index];
			if (preStep) {
				this._curr += preStep.pecent;
				preStep.complete && preStep.complete.run();
			}
			this._index++;
			if(this._curr>this._total)return;
			showLoading("资源加载中" + Math.floor((this._curr / this._total) * 100) + "%");
			if (this._stepList.length > this._index) {
				var currStep = this._stepList[this._index];
				var caller = currStep.caller;
				var method = currStep.method;
				method.call(caller);
			} else {
				hideLoading();
				this.initComplete();
			}
		}

		public initComplete() {
			var startRemindTime=this._startShowTime+3000-Laya.Browser.now()
			if(startRemindTime>0){
				Laya.timer.once(startRemindTime,this,this.initComplete);
			}else{
				this._startImg.dispose();
				this._startImg=null;
				appMgr.open(EnumAppName.GamePanel);
			}
		}

		private _registStep(callter: any, method: Function, pecent: number, msg: string = "",complete?:Laya.Handler) {
			this._stepList.push({ caller: callter, method: method, pecent: pecent, msg: msg ,complete:complete});
			this._total += pecent;
		}

		private _initShellCommond() {
			var facade = framework.mvc.Facade.getInstance();
			facade.registCommand(EnumCommond.share, controller.ShareCommond);
			this.nextStep();
		}

		private _startImg:fairygui.GLoader;
		private _startShowTime:number=0;
		private _showStartPanel(){
			this._startImg=new fairygui.GLoader();
			this._startImg.fill=4;
			this._startImg.width=Laya.stage.width;
			this._startImg.height=Laya.stage.height;
			this._startImg.url=fairygui.UIPackage.getItemURL(EnumUIPackage.ball,"start");
			fairygui.GRoot.inst.addChild(this._startImg);
			this._startShowTime=Laya.Browser.now();
		}
	}

	interface IInitStepItem {
		caller: any,
		method: Function,
		pecent: number,
		msg: string,
		complete:Laya.Handler
	}
}