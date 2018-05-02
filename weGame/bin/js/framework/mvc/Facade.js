var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var framework;
(function (framework) {
    var mvc;
    (function (mvc) {
        "use strict";
        var debug = framework.native.DebugTool;
        var Facade = /** @class */ (function () {
            function Facade() {
                this._view = new View();
                this._controller = new Controlller();
                this._model = new Model();
                this._obseverHash = {};
            }
            Facade.getInstance = function () {
                return this._instance || (this._instance = new Facade());
            };
            /**
             * 注册显示管理对象
             * @param mediator
             */
            Facade.prototype.registMediator = function (mediator) {
                this._view.regist(mediator);
            };
            Facade.prototype.removeMediator = function (name) {
                return this._view.remove(name);
            };
            Facade.prototype.getMediator = function (name) {
                return this._view.getMediator(name);
            };
            Facade.prototype.registCommand = function (cmd, cmdCls) {
                this._controller.regist(cmd, cmdCls);
            };
            Facade.prototype.removeCommand = function (cmd) {
                this._controller.remove(cmd);
            };
            Facade.prototype.hasCommand = function (cmd) {
                return this._controller.has(cmd);
            };
            Facade.prototype.registProxy = function (proxy) {
                this._model.regist(proxy);
            };
            Facade.prototype.removeProxy = function (name) {
                return this._model.remove(name);
            };
            Facade.prototype.getProxy = function (name) {
                return this._model.getProxy(name);
            };
            Facade.prototype.sendNotification = function (name, body, type) {
                var notification = new Notification(name, body, type);
                this.executeObsever(notification);
                this._controller.executeCommend(notification);
            };
            Facade.prototype.registerObserver = function (notificationName, observer) {
                var observers = this._obseverHash[notificationName];
                if (observers)
                    observers.push(observer);
                else
                    this._obseverHash[notificationName] = [observer];
            };
            //移除注册执行对象，这里默认一个命令对应同一个对象只可能存在一个执行method，不然存在移除错误目标的bug
            Facade.prototype.removeObserver = function (notificationName, notifyContext) {
                var observers = this._obseverHash[notificationName];
                var i = observers.length;
                while (i--) {
                    var observer = observers[i];
                    if (observer.compareNotifyContext(notifyContext)) {
                        observers.splice(i, 1);
                        observer.release();
                        break;
                    }
                }
                if (observers.length == 0)
                    delete this._obseverHash[notificationName];
            };
            Facade.prototype.executeObsever = function (notification) {
                var notificationName = notification.name;
                var observersRef = this._obseverHash[notificationName];
                if (observersRef) {
                    var observers = observersRef.concat();
                    var len = observers.length;
                    for (var i = 0; i < len; i++) {
                        var observer = observers[i];
                        observer.execute(notification);
                    }
                }
            };
            return Facade;
        }());
        mvc.Facade = Facade;
        var View = /** @class */ (function () {
            function View() {
                this._mediatorHash = {};
            }
            View.prototype.regist = function (md) {
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
            };
            View.prototype.remove = function (name) {
                var mediator = this._mediatorHash[name];
                if (!mediator)
                    return null;
                var cmds = mediator.listNotificationInterests;
                var len = cmds.length;
                var facade = Facade.getInstance();
                for (var i = 0; i < len; i++) {
                    facade.removeObserver(cmds[i], mediator);
                }
                delete this._mediatorHash[name];
                mediator.onRemove();
                return mediator;
            };
            View.prototype.getMediator = function (name) {
                return this._mediatorHash[name];
            };
            return View;
        }());
        var Controlller = /** @class */ (function () {
            function Controlller() {
                this._commondHash = {};
            }
            Controlller.prototype.regist = function (cmd, cmdCls) {
                if (this._commondHash[cmd]) {
                    debug.throwError("重复注册Controller:" + cmd);
                    return;
                }
                this._commondHash[cmd] = cmdCls;
            };
            Controlller.prototype.remove = function (cmd) {
                delete this._commondHash[cmd];
            };
            Controlller.prototype.has = function (cmd) {
                return this._commondHash[cmd] != null;
            };
            Controlller.prototype.executeCommend = function (notification) {
                var cmdCls = this._commondHash[notification.name];
                if (!cmdCls)
                    return;
                var command = new cmdCls();
                command.execute(notification);
            };
            return Controlller;
        }());
        var Model = /** @class */ (function () {
            function Model() {
                this._proxyHash = {};
            }
            Model.prototype.regist = function (proxy) {
                if (this._proxyHash[proxy.name]) {
                    debug.throwError("重复注册model:" + proxy.name);
                    return;
                }
                this._proxyHash[proxy.name] = proxy;
                proxy.onRegist();
            };
            Model.prototype.remove = function (name) {
                var proxy = this._proxyHash[name];
                if (!proxy)
                    return null;
                delete this._proxyHash[name];
                proxy.onRemove();
                return proxy;
            };
            Model.prototype.getProxy = function (name) {
                return this._proxyHash[name];
            };
            return Model;
        }());
        var Notifier = /** @class */ (function () {
            function Notifier() {
                this.facade = Facade.getInstance();
            }
            Notifier.prototype.sendNotification = function (name, body, type) {
                this.facade.sendNotification(name, body, type);
            };
            return Notifier;
        }());
        var Observer = /** @class */ (function () {
            function Observer() {
                this._count = 0;
            }
            Observer.prototype.setTo = function (method, caller) {
                this._method = method;
                this._caller = caller;
            };
            Observer.prototype.useCountAdd = function () {
                this._count++;
            };
            Observer.prototype.execute = function (notificatrion) {
                this._method.call(this._caller, notificatrion);
            };
            Observer.prototype.compareNotifyContext = function (object) {
                return object === this._caller;
            };
            Observer.prototype.release = function () {
                this._count--;
                if (this._count <= 0) {
                    this.recover();
                }
            };
            Observer.prototype.clear = function () {
                this._method = null;
                this._caller = null;
            };
            Observer.prototype.recover = function () {
                this.clear();
                if (!Observer._pool) {
                    Observer._pool = [];
                }
                Observer._pool.push(this);
            };
            Observer.create = function (method, caller) {
                if (!method || !caller) {
                    debug.throwError("不能生成方法或者caller为空的执行者");
                }
                var mid = method["$_mid"] ? method["$_mid"] : (this.MID++);
                var cid = caller["$_cid"] ? caller["$_cid"] : (this.CID++);
                var result = this._hash && this._hash[mid + cid * 10000];
                if (Observer._pool && Observer._pool.length > 0) {
                    result = Observer._pool.shift();
                    return result;
                }
                else {
                    result = new Observer();
                }
                result.setTo(method, caller);
                result.useCountAdd();
                return result;
            };
            Observer.MID = 1;
            Observer.CID = 1;
            return Observer;
        }());
        mvc.Observer = Observer;
        var Notification = /** @class */ (function () {
            function Notification(name, body, type) {
                this._name = name;
                this._body = body;
                this._type = type;
            }
            Object.defineProperty(Notification.prototype, "name", {
                get: function () { return this._name; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Notification.prototype, "body", {
                get: function () { return this._body; },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Notification.prototype, "type", {
                get: function () { return this._type; },
                enumerable: true,
                configurable: true
            });
            return Notification;
        }());
        mvc.Notification = Notification;
        var Mediator = /** @class */ (function (_super) {
            __extends(Mediator, _super);
            function Mediator(name, viewCompoment) {
                var _this = _super.call(this) || this;
                _this._bReigsted = false;
                _this._cmdList = [];
                _this._methodHash = {};
                _this._name = name;
                _this._viewCompoment = viewCompoment;
                return _this;
            }
            Mediator.prototype.registCmd = function (cmd, method) {
                if (!this._methodHash[cmd]) {
                    this._cmdList.push(cmd);
                }
                this._methodHash[cmd] = method;
                if (this._bReigsted) {
                    this.facade.registerObserver(cmd, Observer.create(this.execute, this));
                }
            };
            Mediator.prototype.removeCmd = function (cmd, method) {
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
            };
            Mediator.prototype.execute = function (notification) {
                var method = this._methodHash[notification.name];
                if (method) {
                    method.call(this, notification);
                }
            };
            Mediator.prototype.onRemove = function () {
                this._bReigsted = false;
            };
            Mediator.prototype.onRegist = function () {
                this._bReigsted = true;
            };
            Object.defineProperty(Mediator.prototype, "listNotificationInterests", {
                get: function () {
                    return this._cmdList;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Mediator.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            return Mediator;
        }(Notifier));
        mvc.Mediator = Mediator;
        var SimpleCommand = /** @class */ (function (_super) {
            __extends(SimpleCommand, _super);
            function SimpleCommand() {
                return _super.call(this) || this;
            }
            SimpleCommand.prototype.execute = function (notification) {
            };
            return SimpleCommand;
        }(Notifier));
        mvc.SimpleCommand = SimpleCommand;
        var Proxy = /** @class */ (function (_super) {
            __extends(Proxy, _super);
            function Proxy(name, data) {
                var _this = _super.call(this) || this;
                _this._name = name;
                if (data) {
                    _this.setData(data);
                }
                return _this;
            }
            Proxy.prototype.setData = function (data) {
                this._data = data;
            };
            Proxy.prototype.getData = function () {
                return this._data;
            };
            Object.defineProperty(Proxy.prototype, "name", {
                get: function () {
                    return this._name;
                },
                enumerable: true,
                configurable: true
            });
            Proxy.prototype.onRegist = function () {
            };
            Proxy.prototype.onRemove = function () {
                this._data = null;
            };
            return Proxy;
        }(Notifier));
        mvc.Proxy = Proxy;
    })(mvc = framework.mvc || (framework.mvc = {}));
})(framework || (framework = {}));
//# sourceMappingURL=Facade.js.map