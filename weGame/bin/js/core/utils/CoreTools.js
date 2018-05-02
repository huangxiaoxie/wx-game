/**
* name
*/
var core;
(function (core) {
    var utils;
    (function (utils) {
        var CoreTools = /** @class */ (function () {
            function CoreTools() {
            }
            CoreTools.getFairySingleImgUrl = function (pkgName, imgName, fileType) {
                if (fileType === void 0) { fileType = ".jpg"; }
                var pkg = fairygui.UIPackage.getByName(pkgName);
                var pkgItem = pkg.getItemByName(imgName);
                return "res/" + pkgName + "@atlas_" + pkgItem.id + fileType;
            };
            /**
             * 微信数据解密
             * @param encrypted
             * @param iv
             */
            CoreTools.unPackEncryptedData = function (encrypted, iv, key) {
                var key = CryptoJS.enc.Base64.parse(key);
                var iv = CryptoJS.enc.Base64.parse(iv);
                var decrypted = CryptoJS.AES.decrypt(encrypted, key, {
                    iv: iv,
                    mode: CryptoJS.mode.CBC,
                    padding: CryptoJS.pad.Pkcs7
                });
                var result = decrypted.toString(CryptoJS.enc.Utf8);
                debug.log(result);
                return result;
            };
            return CoreTools;
        }());
        utils.CoreTools = CoreTools;
    })(utils = core.utils || (core.utils = {}));
})(core || (core = {}));
//# sourceMappingURL=CoreTools.js.map