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
        var SkillProxy = /** @class */ (function (_super) {
            __extends(SkillProxy, _super);
            function SkillProxy(name, data) {
                var _this = _super.call(this, name, data) || this;
                if (!data) {
                    _this.setData({});
                }
                return _this;
            }
            SkillProxy.prototype.setData = function (d) {
                _super.prototype.setData.call(this, d || {});
                this._updateBuffValue();
            };
            SkillProxy.prototype.getBuffValue = function (type) {
                if (!this._buffValueHash)
                    return;
                var valueVo = this._buffValueHash[type];
                if (valueVo && valueVo.updateTime < Laya.Browser.now()) {
                    this._updateBuffValue();
                    valueVo = this._buffValueHash[type];
                }
                if (valueVo)
                    return valueVo.value;
                return 0;
            };
            SkillProxy.prototype.getBuffer = function (skillId) {
                return this._data[skillId];
            };
            SkillProxy.prototype.addBuffer = function (skillId) {
                var skillRes = dataMgr.sys_skill.getData(skillId);
                var time = core.formula.timeStrToNumber(skillRes.kTime);
                var bufferVo = this.getBuffer(skillId);
                if (bufferVo) {
                    if (bufferVo.endTime == -1 || entTime == -1) {
                        bufferVo.endTime = -1;
                    }
                    else {
                        bufferVo.endTime += time * 1000;
                    }
                    return;
                }
                var entTime = time == -1 ? -1 : (time * 1000 + Laya.Browser.now());
                bufferVo = {
                    kId: skillRes.kId,
                    endTime: entTime,
                    type: skillRes.eType,
                    value: skillRes.iValue
                };
                this._data[bufferVo.kId] = bufferVo;
                var valueVo = this._buffValueHash[bufferVo.type];
                if (!valueVo) {
                    valueVo = { value: bufferVo.value, updateTime: bufferVo.endTime };
                    this._buffValueHash[bufferVo.type] = valueVo;
                }
                else {
                    valueVo.value += bufferVo.value;
                    valueVo.updateTime = bufferVo.endTime == -1 ? valueVo.updateTime : Math.min(bufferVo.endTime, valueVo.updateTime);
                }
                this.sendNotification(this.cmd_update);
            };
            SkillProxy.prototype.getVipId = function () {
                var kid = "";
                var kValue = 0;
                for (var key in this._data) {
                    var buffVo = this._data[key];
                    if (buffVo.type == SeEnumSkilleType.ShouYiJiaCheng && buffVo.endTime == -1) {
                        if (kid == "" || kValue < buffVo.value) {
                            kid = buffVo.kId;
                            kValue = buffVo.value;
                        }
                    }
                }
                return kid;
            };
            SkillProxy.prototype._updateBuffValue = function () {
                this._buffValueHash = {};
                if (!this._data)
                    return;
                var now = Laya.Browser.now();
                for (var id in this._data) {
                    var bufferVo = this._data[id];
                    if (bufferVo.endTime == -1 || now < bufferVo.endTime) {
                        var valueVo = this._buffValueHash[bufferVo.type];
                        if (!valueVo) {
                            valueVo = { value: bufferVo.value, updateTime: bufferVo.endTime };
                            this._buffValueHash[bufferVo.type] = valueVo;
                        }
                        else {
                            valueVo.value += bufferVo.value;
                            valueVo.updateTime = bufferVo.endTime == -1 ? valueVo.updateTime : Math.min(bufferVo.endTime, valueVo.updateTime);
                        }
                    }
                    else {
                        delete this._data[id];
                    }
                }
            };
            return SkillProxy;
        }(data_1.DataProxy));
        data_1.SkillProxy = SkillProxy;
    })(data = core.data || (core.data = {}));
})(core || (core = {}));
//# sourceMappingURL=SkillProxy.js.map