/**
* name
*/
var core;
(function (core) {
    var module;
    (function (module) {
        var MIDAS_ID = "1450014515";
        var PayModule = /** @class */ (function () {
            function PayModule() {
                this._blanceVo = null;
                this._env = 1;
                if (PayModule.IS_Test) {
                    this._baseUirl = "https://api.weixin.qq.com/cgi-bin/midas/sandbox/";
                    this._midasKey = "3RsERZyKXQIWErpu1Wf8jia9azgxHcZU";
                    this._uri = "/cgi-bin/midas/sandbox/";
                    this._env = 1;
                }
                else {
                    this._baseUirl = "https://api.weixin.qq.com/cgi-bin/midas/";
                    this._midasKey = "GVVU978HFdY9oLFBKbzNkp4Bx7BoPP0b";
                    this._uri = "/cgi-bin/midas/";
                    this._env = 0;
                }
            }
            Object.defineProperty(PayModule.prototype, "balanceVo", {
                get: function () {
                    return this._blanceVo;
                },
                enumerable: true,
                configurable: true
            });
            PayModule.prototype.init = function () {
                var _this = this;
                this.getBalance(function (d) {
                    _this._blanceVo = d;
                    initMgr.nextStep();
                }, function (d) {
                    _this._blanceVo = {
                        balance: 0,
                        gen_balance: 0,
                        first_save: false,
                        save_amt: 0,
                        save_num: 0,
                        cost_sum: 0,
                        present_sum: 0,
                    };
                    initMgr.nextStep();
                });
            };
            PayModule.prototype.buyMoney = function (buyQuantity, success, fail) {
                if (buyQuantity === void 0) { buyQuantity = 10; }
                if (!Define.IsWeChat) {
                    appMgr.showMsg("不是微信环境");
                    return;
                }
                var _self = this;
                wx.requestMidasPayment({
                    mode: "game", env: this._env, offerId: MIDAS_ID, currencyType: "CNY", platform: "android", zoneId: "1", buyQuantity: buyQuantity, success: function () {
                        debug.log("支付成功");
                        _self.getBalance(function (d) {
                            _self._blanceVo = d;
                            _self._sendUpdateCmd();
                        });
                    },
                    fail: function (res) {
                        debug.log("支付成功" + res.errMsg + res.errCode);
                    }
                });
            };
            PayModule.prototype.getBalance = function (success, fail) {
                if (!Define.IsWeChat) {
                    fail && fail();
                    return;
                }
                netMgr.send("pay", "getBalance", { openId: loginMgr.openid }, function (d) {
                    if (d.success) {
                        debug.log("查询成功:", d.data);
                        success && success(d.data);
                    }
                    else {
                        fail && fail(d);
                        debug.error(d.data.errmsg + "---" + d.data.errcode);
                    }
                });
            };
            PayModule.prototype.pay = function (price, success, fail) {
                var _this = this;
                if (this._blanceVo.balance < price) {
                    fail && fail();
                    return;
                }
                var _self = this;
                netMgr.send("pay", "pay", { openId: loginMgr.openid, price: price }, function (res) {
                    if (res.success) {
                        var d = res.data;
                        success && success(d);
                        _self._blanceVo = d;
                        _self._sendUpdateCmd();
                        _this._blanceVo = d;
                        debug.log("扣费成功", d);
                    }
                    else {
                        fail && fail(res);
                    }
                });
            };
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
            PayModule.prototype.present = function (num, openId, success, fail) {
                var _self = this;
                openId = openId ? openId : loginMgr.openid;
                netMgr.send("pay", "present", { openId: openId, num: num }, function (res) {
                    if (res.success) {
                        var d = res.data;
                        debug.log("赠送成功", d);
                        success && success(d);
                        if (openId == loginMgr.openid) {
                            _self._blanceVo = d;
                            _self._sendUpdateCmd();
                        }
                    }
                    else {
                        fail && fail(res);
                    }
                });
            };
            PayModule.prototype._sendUpdateCmd = function () {
                framework.mvc.Facade.getInstance().sendNotification(EnumCommond.moneyUpdate);
            };
            PayModule.prototype._getBillNo = function () {
                return "billNo_" + loginMgr.openid + "_" + Laya.Browser.now();
            };
            PayModule.prototype.getSig = function (midasVo, methodName) {
                var stringA = this._getKeyStr(midasVo);
                // var stringA = `appid=${midasVo.appid}&offer_id=${midasVo.offer_id}&openid=${midasVo.openid}&pf=${midasVo.pf}&ts=${midasVo.ts}&zone_id=${midasVo.zone_id}`;
                var stringSignTemp = stringA + ("&org_loc=" + (this._uri + methodName) + "&method=POST&secret=" + this._midasKey);
                var sig = CryptoJS.HmacSHA256(stringSignTemp, this._midasKey).toString();
                return sig;
            };
            PayModule.prototype.getMpSig = function (midasVo, methodName) {
                var sig = midasVo.sig;
                if (!sig) {
                    debug.throwError("sig缺失");
                    return;
                }
                var stringA = this._getKeyStr(midasVo);
                // var stringA = `access_token=${loginMgr.token}&appid=${midasVo.appid}&offer_id=${midasVo.offer_id}&openid=${midasVo.openid}&pf=${midasVo.pf}&sig=${sig}&ts=${midasVo.ts}&zone_id=${midasVo.zone_id}`;
                var stringSignTemp = stringA + ("&org_loc=" + (this._uri + methodName) + "&method=POST&session_key=" + loginMgr.session_key);
                var mp_sig = CryptoJS.HmacSHA256(stringSignTemp, loginMgr.session_key).toString();
                return mp_sig;
            };
            PayModule.prototype._getKeyStr = function (d) {
                var keyList = [];
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
            };
            PayModule.IS_Test = true;
            return PayModule;
        }());
        module.PayModule = PayModule;
    })(module = core.module || (core.module = {}));
})(core || (core = {}));
//# sourceMappingURL=PayModule.js.map