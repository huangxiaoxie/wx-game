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
var core;
(function (core) {
    var data;
    (function (data_1) {
        var UserProxy = /** @class */ (function (_super) {
            __extends(UserProxy, _super);
            function UserProxy(name, data) {
                var _this = _super.call(this, name, data) || this;
                if (!data) {
                    _this._createUser();
                }
                return _this;
            }
            UserProxy.prototype._createUser = function () {
                var d = {
                    iLevel: 0,
                    iLeaveTime: Laya.Browser.now(),
                    iPoolEnergy: 0,
                    iEnergy: 0,
                    isInGame: false,
                    iGuide: 0
                };
                this.setData(d);
            };
            Object.defineProperty(UserProxy.prototype, "userVo", {
                get: function () {
                    return this._data;
                },
                enumerable: true,
                configurable: true
            });
            UserProxy.prototype.addEnergy = function (num) {
                if (num <= 0)
                    return;
                num *= Math.max(1, dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.ShouYiJiaCheng));
                this.userVo.iEnergy += num;
                this.sendNotification(this.cmd_update);
                this.sendNotification(this.cmd_EnergyUpdate, num);
            };
            UserProxy.prototype.useEnergy = function (num) {
                if (this.userVo.iEnergy < num) {
                    return false;
                }
                this.userVo.iEnergy -= num;
                this.sendNotification(this.cmd_update);
                this.sendNotification(this.cmd_EnergyUpdate, -num);
                return true;
            };
            UserProxy.prototype.addPoolEnergy = function (num) {
                if (num <= 0)
                    return;
                this.userVo.iPoolEnergy += num;
                this.sendNotification(this.cmd_update);
            };
            UserProxy.prototype.getPoolEnergy = function () {
                if (this.userVo.iPoolEnergy > 0) {
                    this.addEnergy(this.userVo.iPoolEnergy);
                    this.userVo.iPoolEnergy = 0;
                    this.sendNotification(this.cmd_update);
                }
            };
            UserProxy.prototype.getLeaveEnergy = function () {
                if (this.userVo.isInGame && gameGlobal.loginTime - this.userVo.iLeaveTime > Define.MinLeaveTime) {
                    var hash = dataMgr.ballProxy.getData();
                    var totalAttack = 0;
                    for (var key in hash) {
                        var ballVo = hash[key];
                        totalAttack += core.formula.getBallRealAttack(ballVo.kId);
                    }
                    var maxTime = Define.MinLeaveTime + dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.LiXianShouYi); //小时
                    var liveTime = Math.min(Math.floor((gameGlobal.loginTime - this.userVo.iLeaveTime) / Define.MinLeaveTime), maxTime * 60);
                    var liveEnergy = liveTime * Define.LeaveAttackCount * totalAttack * 10;
                    appMgr.open(2 /* LeavePanel */, liveEnergy);
                }
                this.userVo.iLeaveTime = gameGlobal.loginTime;
                if (this.userVo.isInGame && dataMgr.unitProxy)
                    dataMgr.unitProxy.checkChapterOver();
            };
            UserProxy.prototype.reStart = function () {
                this.userVo.iEnergy = 0;
                this.userVo.iPoolEnergy = 0;
                this.userVo.iLevel = 0;
                this.userVo.isInGame = false;
            };
            UserProxy.prototype.save = function () {
                this.userVo.iLeaveTime = Laya.Browser.now();
                var hash = dataMgr.ballProxy.getData();
                var totalAttack = 0;
                for (var key in hash) {
                    var ballVo = hash[key];
                    totalAttack += core.formula.getBallRealAttack(ballVo.kId);
                }
                var kId = dataMgr.skillProxy.getVipId();
                if (Define.IsWeChat) {
                    wx.setUserCloudStorage({ KVDataList: [
                            { key: EnumFriendKey.chapter, value: this.userVo.iLevel.toString() },
                            { key: EnumFriendKey.power, value: totalAttack.toString() },
                            { key: EnumFriendKey.vip, value: kId }
                        ] });
                }
                _super.prototype.save.call(this);
            };
            Object.defineProperty(UserProxy.prototype, "cmd_EnergyUpdate", {
                get: function () {
                    return this._getCmd("energyUpdate");
                },
                enumerable: true,
                configurable: true
            });
            return UserProxy;
        }(data_1.DataProxy));
        data_1.UserProxy = UserProxy;
    })(data = core.data || (core.data = {}));
})(core || (core = {}));
//# sourceMappingURL=UserProxy.js.map