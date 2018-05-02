/**
* name
*/
var core;
(function (core) {
    var utils;
    (function (utils) {
        var Formula = /** @class */ (function () {
            function Formula() {
            }
            Formula.getBallAttack = function (kId, level) {
                var ballRes = dataMgr.sys_ballHash.getData(kId);
                if (level <= 0)
                    return 0;
                if (level == 1)
                    return ballRes.iAttack;
                var ratio = 0;
                if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
                    ratio = 1.11;
                }
                else if (ballRes.eType == SeEnumBalleType.XiaoQiu) {
                    ratio = 16 / 15;
                    if (ballRes.iAttack == 1 && level < 62) {
                        return ballRes.iAttack + (level - 1);
                    }
                }
                else {
                    if (level < 40) {
                        return ballRes.iAttack + (level - 1);
                    }
                    else {
                        ratio = 1.1;
                    }
                }
                if (!this._attackCache)
                    this._attackCache = {};
                var key = kId + "_" + level;
                if (this._attackCache[key])
                    return this._attackCache[key];
                var preKey = kId + "_" + (level - 1);
                var preValue = this._attackCache[preKey];
                if (preValue == null) {
                    preValue = this.getBallAttack(kId, level - 1);
                }
                this._attackCache[key] = Math.round(preValue * ratio);
                return this._attackCache[key];
            };
            Formula.getCost = function (kId, level) {
                var ballRes = dataMgr.sys_ballHash.getData(kId);
                if (level <= 1)
                    return ballRes.iOpenCost;
                var ratio = 1.1;
                if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
                    ratio = 1.15;
                }
                else if (ballRes.eType == SeEnumBalleType.XiaoQiu) {
                    ratio = 1.1;
                }
                else {
                    ratio = 1.15;
                }
                if (!this._costCache)
                    this._costCache = {};
                var key = kId + "_" + level;
                if (this._costCache[key])
                    return this._costCache[key];
                var preKey = kId + "_" + (level - 1);
                var preValue = this._costCache[preKey];
                if (preValue == null) {
                    if (level == 2) {
                        preValue = ballRes.iCost;
                    }
                    else {
                        preValue = this.getCost(kId, level - 1);
                    }
                }
                this._costCache[key] = Math.round(preValue * ratio);
                return this._costCache[key];
            };
            /**获取小球击中时的伤害，加入了buff效果计算 */
            Formula.getBallRealAttack = function (kid) {
                var ballVo = dataMgr.ballProxy.getBall(kid);
                if (!ballVo)
                    return 0;
                var ballRes = dataMgr.sys_ballHash.getData(kid);
                var defaultAttack = this.getBallAttack(kid, ballVo.iLevel);
                return defaultAttack;
            };
            Formula.numToShowStr = function (num) {
                var numStr = Math.round(num).toString();
                var numLen = numStr.length;
                if (numStr.indexOf("e+") != -1) {
                    var arr = numStr.split("e+");
                    numLen = parseInt(arr[1]) + 1;
                    numStr = arr[0];
                }
                if (numLen <= 3)
                    return numStr;
                var code = Math.floor(numLen / 3);
                var moreLen = numLen % 3;
                if (moreLen == 0) {
                    code -= 1;
                }
                var limitNum = num / Math.pow(1000, code);
                var fixLen = moreLen == 0 ? 1 : Math.pow(10, 3 - moreLen);
                limitNum = Math.floor(limitNum * fixLen) / fixLen;
                return limitNum + String.fromCharCode(code + this.StartCode - 1);
            };
            /**
             * 字符串持续时间转成数字(秒)
             * @param str 10s  10m  10h
             */
            Formula.timeStrToNumber = function (str) {
                if (str == "-1")
                    return -1;
                var timeCode = str.charAt(str.length - 1);
                if (timeCode == "s")
                    return parseInt(str.substr(0, str.length - 1));
                if (timeCode == "m")
                    return parseInt(str.substr(0, str.length - 1)) * 60;
                if (timeCode == "h")
                    return parseInt(str.substr(0, str.length - 1)) * 3600;
                return parseInt(str.substr(0, str.length - 1));
            };
            Formula.StartCode = 65; //A
            return Formula;
        }());
        utils.Formula = Formula;
    })(utils = core.utils || (core.utils = {}));
})(core || (core = {}));
//# sourceMappingURL=Formula.js.map