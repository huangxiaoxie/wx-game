// 程序入口
class GameMain {
    constructor() {
        try {
            wx;
            Laya.URL.customFormat = (url: string): string => {
                if (window["ver"]) {
                    if (ver[url]) {
                        return ver[url] + "/" + url;
                    }
                }
                return url;
            }
        } catch (e) {
            Define.IsWeChat = false;
            Laya.URL.customFormat = (url: string): string => {
                if (window["ver"]) {
                    if (ver[url]) {
                        return ver[url] + "/" + url + "?t=" + timeV[url];
                    }
                }
                return url;
            }
        }
        Laya.MiniAdpter.init(true, false);

        Laya.init(750, 1334, Laya.WebGL);
        Laya.stage.scaleMode = Laya.Stage.SCALE_FIXED_AUTO;
        if (window["config"]) {
            for (var key in window["config"]) {
                Define[key] = window["config"][key];
            }
            Laya.URL.basePath = Define.CdnUrl;
        }
        Laya.stage.addChild(fairygui.GRoot.inst.displayObject);
        fairygui.GRoot.inst.width = Laya.stage.width;
        fairygui.GRoot.inst.height = Laya.stage.height;
        Laya.stage.on(Laya.Event.RESIZE, this, () => {
            fairygui.GRoot.inst.width = Laya.stage.width;
            fairygui.GRoot.inst.height = Laya.stage.height;
        });
        Laya.loader.load("weVer/version_" + (window["version"] || "") + ".json", Laya.Handler.create(this, (res) => {
            ver = res;
            core.start();
            rankModule.init();
            this._initGame();
        }))
    }

    private _initGame() {
        // var socket = new GeSocket("wss://192.168.2.120:6003");
        rankModule.load([{url:"res/child/comp.atlas",type:Laya.Loader.JSON}],Laya.Handler.create(this,()=>{
        }))
    }
}

new GameMain();