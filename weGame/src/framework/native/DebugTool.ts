/**
* name 
*/
module framework.native{
	"use strict";
	export class DebugTool{
		static Is_Debug:boolean=true;
		constructor(){

		}

		static throwError(msg){
			if(this.Is_Debug){
				throw new Error(msg);
			}else{
				this.error(msg);
			}
		}


		static log(message?: any, ...optionalParams: any[]){
			if(this.Is_Debug){
				console.log(message,...optionalParams)
			}else{
				
			}
		}

		static error(message?: any, ...optionalParams: any[]){
			if(this.Is_Debug){
				console.error(message,...optionalParams)
			}else{

			}
		}
	}
}