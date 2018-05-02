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
        var ScoreUnitProxy = /** @class */ (function (_super) {
            __extends(ScoreUnitProxy, _super);
            function ScoreUnitProxy(name, data) {
                return _super.call(this, name, data) || this;
            }
            ScoreUnitProxy.prototype.setData = function (d) {
                this._data = d;
                var level = dataMgr.userProxy.userVo.iLevel;
                var chapterRes = dataMgr.sys_chapter.getData(level.toString());
                if (!chapterRes)
                    return;
                this._currChaperDamage = 0;
                var remaidHp = 0;
                for (var key in d) {
                    var unitVo = d[key];
                    this._currChaperDamage += (chapterRes.iHp - unitVo.iHp);
                    remaidHp += unitVo.iHp;
                }
                this._totalChapterHp = chapterRes.iUnitNum * chapterRes.iHp;
                if (remaidHp == 0) {
                    this._currChaperDamage = this._totalChapterHp;
                }
            };
            ScoreUnitProxy.prototype.damageUnit = function (id, damage) {
                var unitVo = this._data[id];
                if (unitVo && unitVo.iHp > 0) {
                    if (unitVo.iHp > damage) {
                        unitVo.iHp -= damage;
                    }
                    else {
                        damage = unitVo.iHp;
                        unitVo.iHp = 0;
                    }
                    this._currChaperDamage += damage;
                    dataMgr.userProxy.addPoolEnergy(damage);
                    this.checkChapterOver();
                    return true;
                }
                return false;
            };
            ScoreUnitProxy.prototype.checkChapterOver = function () {
                if (this._data && dataMgr.userProxy && dataMgr.userProxy.userVo) {
                    var level = dataMgr.userProxy.userVo.iLevel;
                    var chapterRes = dataMgr.sys_chapter.getData(level.toString());
                    var remaidHp = 0;
                    this._currChaperDamage = 0;
                    for (var key in this._data) {
                        var unitVo = this._data[key];
                        this._currChaperDamage += (chapterRes.iHp - unitVo.iHp);
                        remaidHp += unitVo.iHp;
                    }
                    this._totalChapterHp = chapterRes.iUnitNum * chapterRes.iHp;
                    if (remaidHp == 0) {
                        this._currChaperDamage = this._totalChapterHp;
                    }
                }
                if (this._totalChapterHp - this._currChaperDamage < 1) {
                    this.sendNotification(this.cmd_allDead);
                }
            };
            ScoreUnitProxy.prototype.reStart = function () {
                this._data = {};
            };
            Object.defineProperty(ScoreUnitProxy.prototype, "chapterDamage", {
                get: function () {
                    return this._currChaperDamage;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(ScoreUnitProxy.prototype, "cmd_allDead", {
                get: function () {
                    return this._getCmd("alldead");
                },
                enumerable: true,
                configurable: true
            });
            return ScoreUnitProxy;
        }(data_1.DataProxy));
        data_1.ScoreUnitProxy = ScoreUnitProxy;
    })(data = core.data || (core.data = {}));
})(core || (core = {}));
//# sourceMappingURL=ScoreUnitProxy.js.map