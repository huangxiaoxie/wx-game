/**
* name 
*/
module core.uiLib {
	var Facade = framework.mvc.Facade;
	var debug = framework.native.DebugTool;
	export class AppBase extends fairygui.GComponent {
		private _commandList: Array<string>;
		private _mediatorList: Array<string>;
		private _proxyList: Array<string>;
		private _data: any;
		private _resList: Array<{ url: string, type: string }>;
		constructor() {
			super();
			this._init();
		}

		private _init() {
			this._commandList = [];
			this._mediatorList = [];
			this._proxyList = [];
		}

		public start(d: any) {
			this._data = d;
			this.override_initRes();
			this._onStartLoadRes();
		}

		public reStart(d: any) {
			this._data = d;
		}

		public close() {
			this.dispose();
		}

		public getData(): any {
			return this._data;
		}

		public bindWH(d:fairygui.GObject){
			d.width=this.width;
			d.height=this.height;
			d.addRelation(this,fairygui.RelationType.Width);
			d.addRelation(this,fairygui.RelationType.Height);
		}

		protected override_initRes() {

		}

		protected _onStartLoadRes() {
			if (this._resList && this._resList.length > 0) {
				Laya.loader.load(this._resList, Laya.Handler.create(this, this._onLoadResComplete));
			} else {
				this._onLoadResComplete();
			}
		}

		protected _onLoadResComplete() {
			this.override_startInitMvc();
		}

		//这个方法是需要重写的。app在这里初始化
		protected override_startInitMvc() {

		}

		protected _registMediator(mediator: IMediator) {
			this._mediatorList.push(mediator.name);
			var facade = Facade.getInstance();
			facade.registMediator(mediator);
		}

		protected _registCommand(cmd: string, cmdCls: Function) {
			this._commandList.push(cmd);
			var facade = Facade.getInstance();
			facade.registCommand(cmd, cmdCls);
		}

		protected _registProxy(proxy: IProxy) {
			this._proxyList.push(proxy.name);
			var facade = Facade.getInstance();
			facade.registProxy(proxy);
		}

		public dispose() {
			debug.log("关闭窗口")
			var facade = Facade.getInstance();
			while (this._mediatorList.length > 0) {
				facade.removeMediator(this._mediatorList.shift());
			}
			this._mediatorList = null;

			while (this._commandList.length > 0) {
				facade.removeCommand(this._commandList.shift());
			}
			this._commandList = null;

			while (this._proxyList.length > 0) {
				facade.removeProxy(this._proxyList.shift());
			}
			this._proxyList = null;
			super.dispose();
		}
	}
}