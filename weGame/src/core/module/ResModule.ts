/**
* name 
*/
module core.module {
	export class ResModule {
		private _preLoadList: Array<{ url: string, type: string }>;
		constructor() {

		}

		loadPre() {
			this._preLoadList = [];
			var self=this;
			var addPreLoad = function (url: string, type: string) {
				self._preLoadList.push({ url: url, type: type });
			}
			addPreLoad("res/ball@atlas0.png", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas0_1.png", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas0_2.png", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas2.png", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas3.png", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas_fddhq.jpg", Laya.Loader.IMAGE);
			Laya.loader.load(this._preLoadList, Laya.Handler.create(this,()=>{
				ui.ball.ballBinder.bindAll();
				initMgr.nextStep();
			}));
		}

		loadStart(){
			this._preLoadList = [];
			var self=this;
			var addPreLoad = function (url: string, type: string) {
				self._preLoadList.push({ url: url, type: type });
			}
			addPreLoad("res/ball.fui", Laya.Loader.BUFFER);
			addPreLoad("res/ball@atlas_p4bd2r.jpg", Laya.Loader.IMAGE);
			addPreLoad("res/ball@atlas4.png", Laya.Loader.IMAGE);
			Laya.loader.load(this._preLoadList, Laya.Handler.create(this,()=>{
				fairygui.UIPackage.addPackage("res/ball");
				initMgr.nextStep();
			}));
		}
	}
}