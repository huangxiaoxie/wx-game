/**
* name
*/
var core;
(function (core) {
    var utils;
    (function (utils) {
        var Fomula = /** @class */ (function () {
            function Fomula() {
            }
            Fomula.getBallAttack = function (baseAttack, iLevel) {
                return baseAttack * iLevel;
            };
            Fomula.getCost = function (baseCost, iLevel) {
                return baseCost * iLevel;
            };
            Fomula.numToShowStr = function (num) {
                var numStr = Math.round(num).toString();
                if (numStr.length <= 3)
                    return numStr;
                var code = numStr.length / 3;
                if (numStr.length % 3 == 0) {
                    code -= 1;
                }
                return Math.floor(num / Math.pow(1000, code - 1)) / 1000 + String.fromCharCode(code + this.StartCode);
            };
            Fomula.StartCode = 97; //a
            return Fomula;
        }());
        utils.Fomula = Fomula;
    })(utils = core.utils || (core.utils = {}));
})(core || (core = {}));
//# sourceMappingURL=Fomula.js.map