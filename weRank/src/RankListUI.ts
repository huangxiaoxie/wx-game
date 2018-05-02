/*
* name;
*/
class RankListUI extends ui.RankListUI{
    private _cache=[];
    constructor(){
        super();
        this.list.vScrollBarSkin="";
        this.list.renderHandler=Laya.Handler.create(this,this._renderList,null,false);
    }

    public setData(d:{key:string,valueMsg:string}){
        var key=d.key;
        var valueMsg=d.valueMsg || "";
        if(this._cache[key]){
            this._updateList(this._cache[key],valueMsg,key);
        }else{
            var _self=this;
            wx.getFriendCloudStorage({keyList:[key,"vip"],success:(res:{data:Array<UserGameData>})=>{
                console.log(res);
                this._cache[key]=res.data;
                this._updateList(res.data,valueMsg,key);
            }});
        }
    }

    public hide(){
        this.list=null;
        this._cache=[];
    }

    private _renderList(cell:Laya.Box,index:number){
        var avatarCon=<Laya.Image>cell.getChildByName("avatarIcon");
        var numTxt=<RankTxt>cell.getChildByName("numTxt");
        var vipImg=<Laya.Image>cell.getChildByName("vipImg");
        var nameTxt=<Laya.Label>cell.getChildByName("nameTxt");
        var valueTxt=<Laya.Label>cell.getChildByName("valueTxt");
        var data=<iRankItemVo>cell.dataSource;
        avatarCon.skin=data.avatar;
        numTxt.dataSource=index+1;
        vipImg.visible=data.isVip;
        nameTxt.text=data.name;
        valueTxt.text=data.valueMsg;
    }

    private _updateList(list:Array<UserGameData>,valueMsg:string,key:string){
        this.list.array=[];
        var rankList:Array<iRankItemVo>=[];
        for(var i=0;list && i<list.length;i++){
            var keyHash={};
            for(var j=0;j<list[i].KVDataList.length;j++){
                keyHash[list[i].KVDataList[j].key]=list[i].KVDataList[j].value;
            }
            var value=Number(keyHash[key]) || 0;
            console.log(list[i].nickname,value,keyHash[key]);
            if(value<=0)continue;
            rankList.push({
                value:value,
                isVip:!!keyHash["vip"],
                avatar:list[i].avatarUrl,
                name:list[i].nickname,
                valueMsg:valueMsg.replace(/\{value\}/g,this.numToShowStr(value)),
            })
        }

        rankList.sort((a:iRankItemVo,b:iRankItemVo):number=>{
            if(a.value>b.value)return -1;
            if(a.value<b.value)return 1;
            return 0;
        })
        this.list.array=rankList;
    }

    numToShowStr(num: number): string {
        const StartCode = 65;	//A
        var numStr = Math.round(num).toString();
        var numLen=numStr.length;
        if(numStr.indexOf("e+")!=-1){
            var arr=numStr.split("e+");
            numLen=parseInt(arr[1])+1;
            numStr=arr[0];
        }
        if (numLen <= 3) return numStr;
        var code = Math.floor(numLen / 3);
        var moreLen = numLen % 3;
        if (moreLen == 0) {
            code -= 1;
        }
        var limitNum = num / Math.pow(1000, code);
        var fixLen = moreLen == 0 ? 1 : Math.pow(10, 3 - moreLen);
        limitNum = Math.floor(limitNum * fixLen) / fixLen
        return limitNum + String.fromCharCode(code + StartCode - 1);
    }
}

interface iRankItemVo{
    value:number,
    isVip:boolean,
    avatar:string,
    name:string,
    valueMsg:string,
}

class RankTxt extends Laya.Sprite{
    private _numList:Array<Laya.Image>;
    protected _dataSource:any;
    constructor(){
        super();
        this._numList=[];
        while(this.numChildren>0){
            this._numList.push(<Laya.Image>this.removeChildAt(0));
        }
    }

    public set dataSource(val:number){
        this._dataSource=val;
        var skinList:Array<string>=[];
        if(val==1){
            skinList.push("1-1");
        }else if(val==2){
            skinList.push("2-1");
        }else if(val==3){
            skinList.push("3-1");
        }else{
            skinList=val.toString().split("");
        }

        var totalW=0;
        for(var i=0;i<skinList.length;i++){
            var skin=skinList[i];
            var img=<Laya.Image>(i<this.numChildren?this.getChildAt(i):this._createImg());
            img.skin="comp/"+skin+".png";
            if(skin=="1" || skin=="1-1"){
                img.width=21;
            }else{
                img.width=28;
            }
            totalW+=img.width;
            if(!img.parent){
                this.addChild(img);
            }
        }

        var startX=(this.width-totalW)/2;
        for(var i=0;i<this.numChildren;i++){
            var img=<Laya.Image>this.getChildAt(i);
            if(!skin[i]){
                img.removeSelf();
                this._numList.push(img);
                i--;
            }else{
                img.x=startX+img.width;
                startX+=img.width;
            }
        }
    }

    public get dataSource():number{
        return this._dataSource;
    }

    private _createImg():Laya.Image{
        if(this._numList.length>0){
            return this._numList.shift();
        }
        return new Laya.Image();
    }
}