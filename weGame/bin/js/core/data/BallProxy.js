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
        var BallProxy = /** @class */ (function (_super) {
            __extends(BallProxy, _super);
            function BallProxy(name, data) {
                var _this = _super.call(this, name, data) || this;
                if (!data) {
                    _this._createUser();
                }
                return _this;
            }
            BallProxy.prototype._createUser = function () {
                var d = {};
                this._initBall(d);
            };
            BallProxy.prototype._initBall = function (d) {
                var hash = dataMgr.sys_ballHash.getAllRes();
                for (var key in hash) {
                    var ballRes = hash[key];
                    if (ballRes.iLevel > 0) {
                        var ballVo = {
                            kId: ballRes.kId,
                            iLevel: ballRes.iLevel,
                        };
                        d[ballRes.kId] = ballVo;
                    }
                }
                this.setData(d);
            };
            BallProxy.prototype.getBall = function (kId) {
                return this._data[kId];
            };
            BallProxy.prototype.levelUp = function (kId) {
                var ballVo = this.getBall(kId);
                var ballRes = dataMgr.sys_ballHash.getData(kId);
                var cost = core.formula.getCost(ballRes.kId, ballVo ? ballVo.iLevel + 1 : 1);
                if (!dataMgr.userProxy.useEnergy(cost))
                    return;
                if (ballVo) {
                    ballVo.iLevel++;
                    this.sendNotification(this.cmd_update, ballVo);
                }
                else {
                    ballVo = { kId: kId, iLevel: 1 };
                    this._data[kId] = ballVo;
                    if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
                        dataMgr.reStart();
                    }
                    else {
                        this.sendNotification(this.cmd_add, ballVo);
                    }
                }
            };
            BallProxy.prototype.reStart = function () {
                for (var key in this._data) {
                    var ballVo = this._data[key];
                    var ballRes = dataMgr.sys_ballHash.getData(ballVo.kId);
                    if (ballRes.eType != SeEnumBalleType.MoFaQiu) {
                        delete this._data[key];
                    }
                }
                this._initBall(this._data);
            };
            Object.defineProperty(BallProxy.prototype, "clickBall", {
                get: function () {
                    if (this._clickBallId) {
                        return this.getBall(this._clickBallId);
                    }
                    for (var key in this._data) {
                        var ballVo = this._data[key];
                        var ballRes = dataMgr.sys_ballHash.getData(ballVo.kId);
                        if (ballRes.eType == SeEnumBalleType.DianJi) {
                            this._clickBallId = ballVo.kId;
                            return ballVo;
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });
            BallProxy.prototype.save = function () {
                _super.prototype.save.call(this);
            };
            return BallProxy;
        }(data_1.DataProxy));
        data_1.BallProxy = BallProxy;
    })(data = core.data || (core.data = {}));
})(core || (core = {}));
//# sourceMappingURL=BallProxy.js.map