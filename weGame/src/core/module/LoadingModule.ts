/**
* name 
*/
module core.module{
	export class LoadingModule{
		constructor(){

		}

		showLoadingTime:number=0;
		showLoading(msg:string){
			if(Define.IsWeChat){
				if(this.showLoadingTime==0){
					Laya.timer.loop(1000,this,this._checkLoading);
				}
				wx.showLoading({title:msg,mask:true});
			}
			this.showLoadingTime=5
		}

		hideLoading(){
			if(Define.IsWeChat){
				wx.hideLoading({});
			}
			Laya.timer.clear(this,this._checkLoading);
			this.showLoadingTime=0;
		}

		private _checkLoading(){
			this.showLoadingTime--;
			if(this.showLoadingTime<=0){
				hideLoading();
			}
		}
	}
}