/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var AppModule = /** @class */ (function () {
            function AppModule() {
                this._appList = [];
                this._popList = [];
                this._registApp(0 /* Login */, app.login.Login);
                this._registApp(1 /* GamePanel */, app.ball.IdleBall);
                this._registApp(2 /* LeavePanel */, app.leave.LeavePanel);
                this._registApp(3 /* NoticePanel */, app.notice.NoticePanel);
                this._registApp(4 /* RankPanel */, app.rank.RankPanel);
            }
            AppModule.prototype._registApp = function (name, appCls) {
                this._appList[name] = { name: name, appBase: appCls };
            };
            AppModule.prototype.open = function (name, data) {
                var appInfo = this._appList[name];
                if (!appInfo) {
                    debug.throwError("界面" + name + "尚未注册");
                    return;
                }
                var appItem = appInfo.appItem;
                if (appItem) {
                    var index = this._popList.indexOf(name);
                    index > -1 && this._popList.splice(index, 1);
                    this._popList.unshift(name);
                }
                else {
                    appItem = new appInfo.appBase();
                    this._popList.unshift(name);
                }
                fairygui.GRoot.inst.addChild(appItem);
                appItem.width = fairygui.GRoot.inst.width;
                appItem.height = fairygui.GRoot.inst.height;
                appItem.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Width);
                appItem.addRelation(fairygui.GRoot.inst, fairygui.RelationType.Height);
                if (appInfo.appItem) {
                    appInfo.appItem.reStart(data);
                }
                else {
                    appInfo.appItem = appItem;
                    appItem.start(data);
                }
            };
            AppModule.prototype.close = function (name) {
                var appInfo = this._appList[name];
                if (!appInfo) {
                    debug.throwError("界面" + name + "尚未注册");
                    return;
                }
                if (appInfo.appItem) {
                    var index = this._popList.indexOf(name);
                    index > -1 && this._popList.splice(index, 1);
                    appInfo.appItem.close();
                    appInfo.appItem = null;
                }
                else {
                    debug.log("界面:" + name + "尚未打开");
                }
            };
            AppModule.prototype.showMsg = function (msg, btnArr, okMethod, noMethod, title) {
                if (title === void 0) { title = "提示"; }
                // if(Define.IsWeChat){
                this.open(3 /* NoticePanel */, { msg: msg, title: title, btnArr: btnArr, success: okMethod, fail: noMethod });
                // wx.showModal({title:"球球大冒险",content:msg,showCancel:false,cancelText:"",confirmText:"确定"});
                // }
            };
            return AppModule;
        }());
        module.AppModule = AppModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=AppModule.js.map