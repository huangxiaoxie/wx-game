/**
* name 
*/
module core.module {
	export class LoginModule {
		private _code: string;
		private _userInfo: any;
		private _token: string;
		private _openId: string;
		private _session_key: string;
		constructor() {

		}

		public login() {
			var _self = this;
			try {
				wx.login({
					success: (res: { code: string }) => {
						_self._code = res.code;
						debug.log("登录成功:" + res.code);
						_self._getUserInfo();
					},
					fail: (error) => {
						debug.log("登录失败", error);
					}
				});
			} catch (e) {
				debug.log("不是微信环境");
				initMgr.nextStep();
			}
		}

		public get code(): string { return this._code; }
		public get openid(): string { return this._openId; }
		public get session_key(): string { return this._session_key; }
		public get token(): string { return this._token; }

		private _getUserInfo() {
			var _self = this;
			wx.getUserInfo({
				withCredentials: false, lang: "zh_CN", success: (res) => {
					debug.log("用户数据获取成功:" ,res.userInfo);
					_self._userInfo = res.userInfo;
					_self._startGetOpenId();
				}, fail: () => {
					_self._startGetOpenId();
				}
			});
		}

		private _startGetOpenId() {
			netMgr.send("login", "login", { "code": this._code, userInfo: this._userInfo }, (res) => {
				if (res.success) {
					this._session_key = res.data.session_key;
					this._openId = res.data.openid;
					debug.log("openid获取成功", res.data);
					if(!this._isReLogin){
						initMgr.nextStep();
						this._startHeart();
					}
				} else {
					debug.error(res.data.errMsg + "---" + res.data.errcode);
				}
			});
		}
		

		private _isReLogin:boolean=false;
		private _startHeart(){
			Laya.timer.loop(Define.heartTime,this,()=>{
				netMgr.send("login","",{"openId":this._openId},(res)=>{
					if(res.success==false){
						this._isReLogin=true;
						this.login();
					}
				});
			});
		}
	}
}