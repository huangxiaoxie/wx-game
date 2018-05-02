/**
* name
*/
var framework;
(function (framework) {
    var native;
    (function (native) {
        "use strict";
        var DebugTool = /** @class */ (function () {
            function DebugTool() {
            }
            DebugTool.throwError = function (msg) {
                if (this.Is_Debug) {
                    throw new Error(msg);
                }
                else {
                    this.error(msg);
                }
            };
            DebugTool.log = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (this.Is_Debug) {
                    console.log.apply(console, [message].concat(optionalParams));
                }
                else {
                }
            };
            DebugTool.error = function (message) {
                var optionalParams = [];
                for (var _i = 1; _i < arguments.length; _i++) {
                    optionalParams[_i - 1] = arguments[_i];
                }
                if (this.Is_Debug) {
                    console.error.apply(console, [message].concat(optionalParams));
                }
                else {
                }
            };
            DebugTool.Is_Debug = true;
            return DebugTool;
        }());
        native.DebugTool = DebugTool;
    })(native = framework.native || (framework.native = {}));
})(framework || (framework = {}));
//# sourceMappingURL=DebugTool.js.map