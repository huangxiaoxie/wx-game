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
        var DataProxy = /** @class */ (function (_super) {
            __extends(DataProxy, _super);
            function DataProxy(name, data) {
                return _super.call(this, name, data) || this;
            }
            DataProxy.prototype.save = function () {
                storageMgr.save(this.name, this._data);
            };
            Object.defineProperty(DataProxy.prototype, "cmd_update", {
                get: function () {
                    return this._getCmd(EnumDataState.Update);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataProxy.prototype, "cmd_add", {
                get: function () {
                    return this._getCmd(EnumDataState.Add);
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(DataProxy.prototype, "cmd_delete", {
                get: function () {
                    return this._getCmd(EnumDataState.Delete);
                },
                enumerable: true,
                configurable: true
            });
            DataProxy.prototype._getCmd = function (type) {
                return this.name + "." + type;
            };
            return DataProxy;
        }(framework.mvc.Proxy));
        data_1.DataProxy = DataProxy;
    })(data = core.data || (core.data = {}));
})(core || (core = {}));
//# sourceMappingURL=DataClassVo.js.map