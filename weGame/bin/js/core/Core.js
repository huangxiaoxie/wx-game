/**
* name
*/
var core;
(function (core) {
    core.formula = core.utils.Formula;
    core.timeTools = core.utils.TimeTools;
    core.coreTools = core.utils.CoreTools;
    function start() {
        framework.native.DebugTool.Is_Debug = Define.Debug;
        core.module.PayModule.IS_Test = Define.Debug;
        loadingMgr = new core.module.LoadingModule();
        appMgr = new core.module.AppModule();
        initMgr = new core.module.InitModule();
        resMgr = new core.module.ResModule();
        payMgr = new core.module.PayModule();
        netMgr = new core.module.NetModule();
        loginMgr = new core.module.LoginModule();
        dataMgr = new core.module.DataModule();
        storageMgr = new core.module.StorageModule();
        rankModule = new core.module.RankModule();
        initMgr.startInit();
        if (Define.IsWeChat) {
            wx.showShareMenu({ withShareTicket: true });
            wx.onShareAppMessage(function (res) {
                return { title: "这游戏有毒，点进去就中毒了…", imageUrl: Laya.URL.formatURL(core.coreTools.getFairySingleImgUrl(EnumUIPackage.ball, "share")) };
            });
        }
        try {
            wx.onHide(function () {
                storageMgr.saveData();
            });
        }
        catch (e) {
            window.onbeforeunload = function () {
                storageMgr.saveData();
            };
        }
        gameGlobal.loginTime = Laya.Browser.now();
        try {
            wx.onShow(function () {
                gameGlobal.loginTime = Laya.Browser.now();
                dataMgr.checkLeaveTime();
            });
        }
        catch (e) {
            window.onload = function () {
                gameGlobal.loginTime = Laya.Browser.now();
                dataMgr.checkLeaveTime();
            };
        }
        if (Define.QuickKey) {
            Laya.stage.on(Laya.Event.KEY_PRESS, this, function (e) {
                var key = String.fromCharCode(e.keyCode);
                switch (key) {
                    case "T":
                    case "t":
                        appMgr.open(0 /* Login */);
                        break;
                }
            });
        }
    }
    core.start = start;
    function showLoading(msg) {
        debug.log(msg);
        loadingMgr && loadingMgr.showLoading(msg);
    }
    core.showLoading = showLoading;
    function hideLoading() {
        loadingMgr && loadingMgr.hideLoading();
    }
    core.hideLoading = hideLoading;
})(core || (core = {}));
var appMgr;
var initMgr;
var resMgr;
var payMgr;
var netMgr;
var loginMgr;
var dataMgr;
var storageMgr;
var rankModule;
var loadingMgr;
//# sourceMappingURL=Core.js.map