/**
* name 
*/
module framework.mvc {
	"use strict";
	var debug = framework.native.DebugTool;
	export class Facade implements IFacade {
		private static _instance: Facade;
		private _view: View;
		private _controller: Controlller;
		private _model: Model;
		private _obseverHash: any;
		constructor() {
			this._view = new View();
			this._controller = new Controlller();
			this._model = new Model();
			this._obseverHash = {};
		}

		public static getInstance(): Facade {
			return this._instance || (this._instance = new Facade());
		}

		/**
		 * 注册显示管理对象
		 * @param mediator 
		 */
		public registMediator(mediator: IMediator) {
			this._view.regist(mediator);
		}

		public removeMediator(name: string): IMediator {
			return this._view.remove(name);
		}

		public getMediator(name: string): IMediator {
			return this._view.getMediator(name);
		}

		public registCommand(cmd: string, cmdCls: Function) {
			this._controller.regist(cmd, cmdCls);
		}

		public removeCommand(cmd: string) {
			this._controller.remove(cmd);
		}

		public hasCommand(cmd: string): boolean {
			return this._controller.has(cmd);
		}

		public registProxy(proxy: IProxy) {
			this._model.regist(proxy);
		}

		public removeProxy(name: string): IProxy {
			return this._model.remove(name);
		}

		public getProxy(name: string): IProxy {
			return this._model.getProxy(name);
		}

		sendNotification(name: string, body?: any, type?: string) {
			var notification = new Notification(name, body, type);
			this.executeObsever(notification);
			this._controller.executeCommend(notification);
		}

		registerObserver(notificationName: string, observer: Observer): void {
			var observers: Observer[] = this._obseverHash[notificationName];
			if (observers)
				observers.push(observer);
			else
				this._obseverHash[notificationName] = [observer];
		}


		//移除注册执行对象，这里默认一个命令对应同一个对象只可能存在一个执行method，不然存在移除错误目标的bug
		removeObserver(notificationName: string, notifyContext: any): void {
			var observers: Observer[] = this._obseverHash[notificationName];

			var i: number = observers.length;
			while (i--) {
				var observer: Observer = observers[i];
				if (observer.compareNotifyContext(notifyContext)) {
					observers.splice(i, 1);
					observer.release();
					break;
				}
			}

			if (observers.length == 0)
				delete this._obseverHash[notificationName];
		}


		executeObsever(notification) {
			var notificationName: string = notification.name;
			var observersRef: Array<Observer> = this._obseverHash[notificationName];
			if (observersRef) {
				var observers = observersRef.concat();
				var len = observers.length;
				for (var i = 0; i < len; i++) {
					var observer = observers[i];
					observer.execute(notification);
				}
			}
		}
	}

	class View {
		private _mediatorHash: any;
		constructor() {
			this._mediatorHash = {};
		}

		public regist(md: IMediator) {
			if (this._mediatorHash[md.name]) {
				debug.throwError("重复注册mediator:" + md.name);
				return;
			}
			var facade = Facade.getInstance();
			this._mediatorHash[md.name] = md;
			var cmds = md.listNotificationInterests;
			var len = cmds.length;
			for (var i = 0; i < len; i++) {
				facade.registerObserver(cmds[i], Observer.create(md.execute, md));
			}
			md.onRegist();
		}

		public remove(name: string): IMediator {
			var mediator: Mediator = this._mediatorHash[name];
			if (!mediator) return null;
			var cmds = mediator.listNotificationInterests;
			var len = cmds.length;
			var facade = Facade.getInstance();
			for (var i = 0; i < len; i++) {
				facade.removeObserver(cmds[i], mediator);
			}
			delete this._mediatorHash[name];
			mediator.onRemove();
			return mediator;
		}

		public getMediator(name: string): IMediator {
			return this._mediatorHash[name];
		}
	}

	class Controlller {
		private _commondHash: any;
		constructor() {
			this._commondHash = {};
		}

		public regist(cmd: string, cmdCls: Function) {
			if (this._commondHash[cmd]) {
				debug.throwError("重复注册Controller:" + cmd);
				return;
			}
			this._commondHash[cmd] = cmdCls;
		}

		public remove(cmd: string) {
			delete this._commondHash[cmd];
		}

		public has(cmd): boolean {
			return this._commondHash[cmd] != null;
		}

		public executeCommend(notification: Notification) {
			var cmdCls = this._commondHash[notification.name];
			if (!cmdCls) return;
			var command: SimpleCommand = new cmdCls();
			command.execute(notification);
		}
	}

	class Model {
		private _proxyHash: any;
		constructor() {
			this._proxyHash = {};
		}

		public regist(proxy: IProxy) {
			if (this._proxyHash[proxy.name]) {
				debug.throwError("重复注册model:" + proxy.name);
				return;
			}
			this._proxyHash[proxy.name] = proxy;
			proxy.onRegist();
		}


		public remove(name: string): IProxy {
			var proxy = this._proxyHash[name];
			if (!proxy) return null;
			delete this._proxyHash[name];
			proxy.onRemove();
			return proxy;
		}

		public getProxy(name: string): IProxy {
			return this._proxyHash[name];
		}
	}

	class Notifier implements INotifier {
		facade: Facade;
		constructor() {
			this.facade = Facade.getInstance();
		}

		sendNotification(name: string, body?: any, type?: string) {
			this.facade.sendNotification(name, body, type);
		}
	}

	export class Observer implements IObserver {
		private static _pool: Array<Observer>;		//池子暂时不用
		private static _hash: any;
		static MID: number = 1;
		static CID: number = 1;
		private _method: Function;
		private _caller: any;
		private _count: number = 0;
		constructor() {
		}

		setTo(method: Function, caller: any) {
			this._method = method;
			this._caller = caller;
		}

		useCountAdd() {
			this._count++;
		}

		execute(notificatrion: INotification) {
			this._method.call(this._caller, notificatrion);
		}

		compareNotifyContext(object: any): boolean {
			return object === this._caller;
		}

		release() {
			this._count--;
			if (this._count <= 0) {
				this.recover();
			}
		}

		clear() {
			this._method = null;
			this._caller = null;
		}

		recover() {
			this.clear();
			if (!Observer._pool) {
				Observer._pool = [];
			}
			Observer._pool.push(this);
		}

		static create(method: Function, caller: any): Observer {
			if (!method || !caller) {
				debug.throwError("不能生成方法或者caller为空的执行者");
			}
			var mid = method["$_mid"] ? method["$_mid"] : (this.MID++);
			var cid = caller["$_cid"] ? caller["$_cid"] : (this.CID++);
			var result: Observer = this._hash && this._hash[mid + cid * 10000];
			if (Observer._pool && Observer._pool.length > 0) {
				result = Observer._pool.shift();
				return result;
			} else {
				result = new Observer();
			}
			result.setTo(method, caller);
			result.useCountAdd();
			return result;
		}
	}

	export class Notification implements INotification {
		private _name: string;
		private _body: any;
		private _type: string;
		constructor(name: string, body?: any, type?: string) {
			this._name = name;
			this._body = body;
			this._type = type;
		}

		get name(): string { return this._name; }
		get body(): any { return this._body; }
		get type(): string { return this._type; }
	}

	export class Mediator extends Notifier implements IMediator {
		protected _name: string;
		protected _cmdList: Array<string>;
		protected _methodHash: any;
		protected _bReigsted: boolean = false;
		protected _viewCompoment: any;
		constructor(name: string, viewCompoment?: any) {
			super();
			this._cmdList = [];
			this._methodHash = {};
			this._name = name;
			this._viewCompoment = viewCompoment;
		}

		registCmd(cmd: string, method: Function) {
			if (!this._methodHash[cmd]) {
				this._cmdList.push(cmd);
			}
			this._methodHash[cmd] = method;
			if (this._bReigsted) {
				this.facade.registerObserver(cmd, Observer.create(this.execute, this));
			}
		}

		removeCmd(cmd: string, method?: Function) {
			if (!method || this._methodHash[cmd] == method) {
				var index = this._cmdList.indexOf(cmd);
				if (index > -1) {
					this._cmdList.splice(index, 1);
				}
				delete this._methodHash[cmd];
				if (this._bReigsted) {
					this.facade.removeObserver(cmd, this);
				}
			}
		}

		execute(notification: Notification) {
			var method: Function = this._methodHash[notification.name];
			if (method) {
				method.call(this, notification);
			}
		}

		onRemove() {
			this._bReigsted = false;
		}

		onRegist() {
			this._bReigsted = true;
		}

		public get listNotificationInterests(): Array<string> {
			return this._cmdList;
		}

		public get name(): string {
			return this._name;
		}
	}

	export class SimpleCommand extends Notifier {
		constructor() {
			super();
		}

		public execute(notification: Notification) {

		}
	}


	export class Proxy extends Notifier implements IProxy {
		protected _name: string;
		protected _data: any;
		constructor(name: string, data?: any) {
			super();
			this._name = name;
			if (data) {
				this.setData(data);
			}
		}

		public setData(data: any) {
			this._data = data;
		}

		public getData(): any {
			return this._data;
		}

		public get name(): string {
			return this._name;
		}

		public onRegist() {
		}

		public onRemove() {
			this._data = null;
		}
	}
}