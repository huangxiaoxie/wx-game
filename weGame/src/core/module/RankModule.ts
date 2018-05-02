/**
* name 
*/
module core.module {
	export class RankModule {
		constructor() {

		}

		public init() {
			if(!Define.IsWeChat)return;
			if(!wx.getOpenDataContext){
				Define.IsShareOpen=false;
				return;
			}
			Define.IsShareOpen=true;
			Laya.MiniAdpter.nativefiles=["res/child/comp.atlas"];
			var openContext = wx.getOpenDataContext();
			openContext.postMessage({ "type": "init", "data": { ransform: Laya.stage._canvasTransform, basePath: Define.CdnUrl } });
		}

		public load(urls:Array<{url:string,type:string}>,completeHandler:Laya.Handler){
			if(!this.isShareOpen)return;
			var openContext = wx.getOpenDataContext();
			// Laya.loader.load(urls,Laya.Handler.create(this,()=>{
			// 	for(var i=0;i<urls.length;i++){
			// 		var data=Laya.loader.getRes(urls[i].url);
			// 		console.log("加载完---",data);
			// 		openContext.postMessage({ "type": "loadComplete", "data": data, "url": urls[i].url });
			// 	}
			// }))
			var index=0;
			var loadFunc=function(d:{url:string,type:string}){
				if(d.type==Laya.Loader.IMAGE){
					wx.downloadFile({url:Laya.URL.formatURL(d.url),success:(res:{tempFilePath:string,statusCode:number})=>{
						openContext.postMessage({ "type": "templeteFile", "data": res, "url": d.url });
						index++;
						if(index<urls.length){
							loadFunc(urls[index]);
						}else{
							completeHandler.run();
						}
					}});
				}else{
					Laya.loader.load(d.url,Laya.Handler.create(this,(res)=>{
						openContext.postMessage({ "type": "loadComplete", "data": res, "url": d.url });
						index++;
						if(index<urls.length){
							loadFunc(urls[index]);
						}else{
							completeHandler.run();
						}
					}),null,d.type);
				}
			}
			loadFunc(urls[index]);
		}

		public loadComplete(url: string,d: any) {
			if(!this.isShareOpen)return;
			var openContext = wx.getOpenDataContext();
			openContext.postMessage({ "type": "loadComplete", "data": d, "url": url });
		}

		public show(key:string,valueMsg:string) {
			if(!this.isShareOpen)return;
			var openContext = wx.getOpenDataContext();
			openContext.postMessage({ "type": "open", "data": {key:key,valueMsg:valueMsg} });
		}

		public hide(){
			if(!this.isShareOpen)return;
			var openContext = wx.getOpenDataContext();
			openContext.postMessage({ "type": "hide"});
		}

		public postMessage(type: string, d: any) {
			if(!this.isShareOpen)return;
			var openContext = wx.getOpenDataContext();
			openContext.postMessage({ "type": type, "data": d });
		}

		public get isShareOpen(){
			return Define.IsWeChat && Define.IsShareOpen;
		}
	}
}