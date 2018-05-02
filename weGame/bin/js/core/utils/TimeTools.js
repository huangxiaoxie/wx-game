/**
* name
*/
var core;
(function (core) {
    var utils;
    (function (utils) {
        var TimeTools = /** @class */ (function () {
            function TimeTools() {
            }
            /**
             * 格式化时间
             * @param time 时间（秒）
             * @param style auto当时间不到h时，不出现h这段。h:m:s，不管是不是大于0都存在这个
             */
            TimeTools.format = function (time, style) {
                if (style === void 0) { style = "auto"; }
                var s = time % 60;
                time = Math.floor(time / 60);
                var m = time % 60;
                var h = Math.floor(time / 60);
                if (style == "h:m:s") {
                    return this.fullNumLen(h) + ":" + this.fullNumLen(m) + ":" + this.fullNumLen(s);
                }
                return (h > 0 ? (this.fullNumLen(h) + ":") : "") + this.fullNumLen(m) + ":" + this.fullNumLen(s);
            };
            TimeTools.fullNumLen = function (num, len) {
                if (len === void 0) { len = 2; }
                var numStr = num.toString();
                while (numStr.length < len) {
                    numStr = "0" + numStr;
                }
                return numStr;
            };
            return TimeTools;
        }());
        utils.TimeTools = TimeTools;
    })(utils = core.utils || (core.utils = {}));
})(core || (core = {}));
//# sourceMappingURL=TimeTools.js.map