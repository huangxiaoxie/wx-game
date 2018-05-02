/**
* name 
*/
module core.utils {
	export class CoreTools {
		constructor() {

		}

		static getFairySingleImgUrl(pkgName: string, imgName: string, fileType: string = ".jpg"): string {
			var pkg = fairygui.UIPackage.getByName(pkgName);
			var pkgItem = pkg.getItemByName(imgName);
			return "res/" + pkgName + "@atlas_" + pkgItem.id + fileType;
		}

		/**
		 * 微信数据解密
		 * @param encrypted 
		 * @param iv 
		 */
		static unPackEncryptedData(encrypted, iv, key) {
			var key = CryptoJS.enc.Base64.parse(key);
			var iv = CryptoJS.enc.Base64.parse(iv);
			var decrypted = CryptoJS.AES.decrypt(encrypted, key,

				{

					iv: iv,

					mode: CryptoJS.mode.CBC,

					padding: CryptoJS.pad.Pkcs7

				});
			var result = decrypted.toString(CryptoJS.enc.Utf8);
			debug.log(result);
			return result;
		}
	}
}