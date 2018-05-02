type DataResponseCallback = (res: DataResponse) => void;
interface DataResponse {
	success: boolean,
	data: any;
}
/**
* name 
*/
module core.module {
	export class NetModule {
		constructor() {

		}

		/**
		 * 
		 * @param url 开发者服务器接口地址
		 * @param data 请求的参数
		 * @param header 设置请求的 header , header 中不能设置 Referer
		 * @param method 默认为 GET，有效值：OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
		 * @param success 收到开发者服务成功返回的回调函数，res = {data: '开发者服务器返回的内容'}
		 * @param fail 接口调用失败的回调函数
		 * @param complete 接口调用结束的回调函数（调用成功、失败都会执行）
		 */
		public requrest(url: string, data?: string | any, header?: wx.RequestHeader, method: string = "GET", success?: wx.DataResponseCallback, fail?: wx.ResponseCallback, complete?: wx.ResponseCallback) {
			// var requestOps:wx.RequestOptions={url:url,data:data,method:method,success:success,fail:fail,complete:complete};
			// if(header){
			// 	requestOps.header=header;
			// }
			// wx.request(requestOps);
			var request: wx.RequestOptions = {
				url: Define.ServerUrl, method: "POST", data: { url: url, data: data, method: method }, success: (res) => {
					success(res);
				},fail:(res)=>{
					console.log("失败了",res);
				}
			};
			wx.request(request);
		}

		public send(server: string, func: string, data: any, success?: DataResponseCallback,fail?:Function) {
			Request.send(server,func,data,success,fail)
		}

		public connect() {
			var socket = new framework.net.GeSocket("ws://193.168.2.120:6003");
		}
	}
	
	class Request{
		private _retryTime:number=0;
		private _request:wx.RequestOptions;
		static _pool:Array<Request>;
		constructor(){

		}

		public static send(server: string, func: string, data: any, success?: DataResponseCallback,fail?:Function){
			var request:Request;
			if(this._pool && this._pool.length>0){
				request=this._pool.shift();
			}else{
				request=new Request();
			}
			request.setTo(server,func,data,success,fail);
			request.send();
		}

		public setTo(server: string, func: string, data: any, success?: DataResponseCallback,fail?:Function){
			this._retryTime=0;
			this._request = {
				url: Define.ServerUrl + server + "/" + (func ? func + "/" : ""), method: "POST", data: data, success: (res) => {
					success && success(res.data);
					this._recover();
				},fail:(res)=>{
					this._retryTime++;
					if(this._retryTime>5){
						debug.log("失败了",res);
						fail && fail();
						this._recover();
					}else{
						Laya.timer.once(1000,this,this.send);
					}
				}
			};
		}

		public send(){
			if(!this._request)return;
			wx.request(this._request);
		}

		protected _recover(){
			if(!Request._pool)Request._pool=[];
			this._request=null;
			Request._pool.push(this);
		}
	}
}
