/**
* name 
*/
module core.module {
	const MIDAS_ID: string = "1450014515";
	export class PayModule {
		static IS_Test: boolean = true;
		private _baseUirl: string;
		private _midasKey: string;
		private _uri: string;
		private _blanceVo: IBalanceVo = null;
		private _env: number = 1;
		constructor() {
			if (PayModule.IS_Test) {
				this._baseUirl = "https://api.weixin.qq.com/cgi-bin/midas/sandbox/";
				this._midasKey = "3RsERZyKXQIWErpu1Wf8jia9azgxHcZU";
				this._uri = "/cgi-bin/midas/sandbox/";
				this._env = 1;
			} else {
				this._baseUirl = "https://api.weixin.qq.com/cgi-bin/midas/";
				this._midasKey = "GVVU978HFdY9oLFBKbzNkp4Bx7BoPP0b";
				this._uri = "/cgi-bin/midas/";
				this._env = 0;
			}
		}

		public get balanceVo(): IBalanceVo {
			return this._blanceVo;
		}

		public init() {
			this.getBalance((d: IBalanceVo) => {
				this._blanceVo = d;
				initMgr.nextStep();
			}, (d: any) => {
				this._blanceVo = {
					balance: 0,
					gen_balance: 0,
					first_save: false,
					save_amt: 0,
					save_num: 0,
					cost_sum: 0,
					present_sum: 0,
				}
				initMgr.nextStep();
			});
		}


		buyMoney(buyQuantity: number = 10, success?: Function, fail?: Function) {
			if (!Define.IsWeChat) {
				appMgr.showMsg("不是微信环境");
				return;
			}
			var _self = this;
			wx.requestMidasPayment({
				mode: "game", env: this._env, offerId: MIDAS_ID, currencyType: "CNY", platform: "android", zoneId: "1", buyQuantity: buyQuantity, success: () => {
					debug.log("支付成功");
					_self.getBalance((d: IBalanceVo) => {
						_self._blanceVo = d;
						_self._sendUpdateCmd();
					});
				},
				fail: (res: { errMsg: string, errCode: number }) => {
					debug.log("支付成功" + res.errMsg + res.errCode);
				}
			})
		}


		getBalance(success?: Function, fail?: Function) {
			if (!Define.IsWeChat) {
				fail && fail();
				return;
			}
			netMgr.send("pay","getBalance",{openId:loginMgr.openid},(d)=>{
				if (d.success) {
					debug.log("查询成功:", d.data)
					success && success(d.data);
				} else {
					fail && fail(d);
					debug.error(d.data.errmsg + "---" + d.data.errcode);
				}
			})
		}

		pay(price: number, success?: Function, fail?: Function) {
			if (this._blanceVo.balance < price) {
				fail && fail();
				return;
			}
			var _self=this;
			netMgr.send("pay","pay",{openId:loginMgr.openid,price:price},(res)=>{
				if(res.success){
					var d=<IBalanceVo>res.data;
					success && success(d);
					_self._blanceVo = d;
					_self._sendUpdateCmd();
					this._blanceVo = d;
					debug.log("扣费成功", d);
				}else{
					fail && fail(res);
				}
			});
		}

		// cancelPay(bill_no: string, success?: Function, fail?: Function) {
		// 	var methodName: string = "cancelpay";
		// 	var ts = Math.round(Laya.Browser.now() / 1000);
		// 	var cancelVo: ICanCelVo = {
		// 		openid: loginMgr.openid,
		// 		appid: APPID,
		// 		offer_id: MIDAS_ID,
		// 		ts: Math.round(Laya.Browser.now() / 1000),
		// 		zone_id: "1",
		// 		pf: "android",
		// 		bill_no: bill_no,
		// 	}
		// 	cancelVo.sig = this.getSig(cancelVo, methodName);
		// 	cancelVo.access_token = loginMgr.token;
		// 	cancelVo.mp_sig = this.getMpSig(cancelVo, methodName);
		// 	debug.log("订单号:" + cancelVo.bill_no);
		// 	var _self = this;
		// 	netMgr.requrest(this._baseUirl + methodName + "?access_token=" + loginMgr.token, JSON.stringify(cancelVo), null, "POST", (res: wx.DataResponse) => {
		// 		var d = <IBalanceVo>res.data;
		// 		if (d.errcode == 0) {
		// 			success && success(d);
		// 			this._blanceVo = d;
		// 			_self._blanceVo = d;
		// 			_self._sendUpdateCmd();
		// 			debug.log("取消扣费成功", d);
		// 		} else {
		// 			fail && fail(d);
		// 			debug.error(d.errmsg + "---" + d.errcode);
		// 		}
		// 	}, (res) => {
		// 		fail && fail(res);
		// 	});
		// }

		present(num: number, openId?:string,success?: Function, fail?: Function) {
			var _self=this;
			openId=openId?openId:loginMgr.openid;
			netMgr.send("pay","present",{openId:openId,num:num},(res)=>{
				if(res.success){
					var d=<IBalanceVo>res.data;
					debug.log("赠送成功", d);
					success && success(d);
					if(openId==loginMgr.openid)
					{
						_self._blanceVo = d;
						_self._sendUpdateCmd();
					}
				}else{
					fail && fail(res);
				}
			});
		}

		private _sendUpdateCmd() {
			framework.mvc.Facade.getInstance().sendNotification(EnumCommond.moneyUpdate);
		}

		private _getBillNo(): string {
			return "billNo_" + loginMgr.openid + "_" + Laya.Browser.now();
		}

		getSig(midasVo: MidasBaseVo, methodName: string): string {
			var stringA = this._getKeyStr(midasVo);
			// var stringA = `appid=${midasVo.appid}&offer_id=${midasVo.offer_id}&openid=${midasVo.openid}&pf=${midasVo.pf}&ts=${midasVo.ts}&zone_id=${midasVo.zone_id}`;
			var stringSignTemp = stringA + `&org_loc=${this._uri + methodName}&method=POST&secret=${this._midasKey}`;
			var sig = CryptoJS.HmacSHA256(stringSignTemp, this._midasKey).toString();
			return sig;
		}

		getMpSig(midasVo: MidasBaseVo, methodName: string): string {
			var sig = midasVo.sig;
			if (!sig) {
				debug.throwError("sig缺失");
				return;
			}
			var stringA = this._getKeyStr(midasVo);
			// var stringA = `access_token=${loginMgr.token}&appid=${midasVo.appid}&offer_id=${midasVo.offer_id}&openid=${midasVo.openid}&pf=${midasVo.pf}&sig=${sig}&ts=${midasVo.ts}&zone_id=${midasVo.zone_id}`;
			var stringSignTemp = stringA + `&org_loc=${this._uri + methodName}&method=POST&session_key=${loginMgr.session_key}`;
			var mp_sig = CryptoJS.HmacSHA256(stringSignTemp, loginMgr.session_key).toString();
			return mp_sig;
		}

		private _getKeyStr(d: any): string {
			var keyList: Array<string> = [];
			for (var key in d) {
				keyList.push(key);
			}
			keyList.sort();
			var stringA = "";
			for (var i = 0; i < keyList.length - 1; i++) {
				stringA += keyList[i] + "=" + d[keyList[i]] + "&";
			}
			stringA += keyList[i] + "=" + d[keyList[i]];
			return stringA;
		}
	}

	interface MidasBaseVo {
		openid: string,		//用户唯一标识符
		appid: string,		//小程序 appId
		offer_id: string,	//米大师分配的offer_id
		ts: number,			//UNIX 时间戳，单位是秒
		zone_id: string,		//游戏服务器大区id,游戏不分大区则默认zoneId ="1",String类型。如过应用选择支持角色，则角色ID接在分区ID号后用"_"连接。
		pf: string,			//平台 安卓：android
		user_ip?: string,	//用户外网 IP
		pay_item?: string,	//道具名称
		sig?: string,			//以上所有参数（含可选最多9个）+uri+米大师密钥，用 HMAC-SHA256签名，详见 米大师支付签名算法
		access_token?: string,//接口调用凭证
		mp_sig?: string,		//以上所有参数（含可选最多11个）+uri+session_key，用 HMAC-SHA256签名，详见 米大师支付签名算法
	}

	interface ICanCelVo extends MidasBaseVo {
		bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
	}

	interface IGetBalanceVo extends MidasBaseVo {
	}

	interface IPayVo extends MidasBaseVo {
		amt: number,			//扣除游戏币数量，不能为 0
		bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
		app_remark?: string,	//备注。会写到账户流水
	}

	interface IPresentVo extends MidasBaseVo {
		bill_no: string,		//订单号，业务需要保证全局唯一；相同的订单号不会重复扣款。长度不超过63，只能是数字、大小写字母_-
		present_counts: number,	//赠送游戏币的个数，不能为0
	}

	export interface IBalanceVo {
		errcode?: number,				//错误码
		errmsg?: string,				//错误信息
		balance: number,				//游戏币个数(包含赠送)
		gen_balance: number,			//赠送游戏币数量（赠送游戏币数量）
		first_save: boolean,			//是否满足历史首次充值
		save_amt: number,			//累计充值金额的游戏币数量
		save_num: number,			//历史总游戏币金额
		cost_sum: number,			//历史总消费游戏币金额
		present_sum: number,			//历史累计收到赠送金额
	}
}