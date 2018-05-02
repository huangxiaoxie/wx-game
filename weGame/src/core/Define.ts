/**
* name 
*/
const EnumMediatorName = {
	Login: "LoginMediator",
	IdleBall: "IdleBallMediator",
	LeavePanel: "LeaveMediator",
	NoticePanel: "NoticeMediator",
	RankPanel:"RankMediator",
};

const EnumProxyName = {
	Ball: "ballProxy",
	User: "userProxy",
	ScoreUnit: "scoreUnitProxy",
	SkillBuffer: "kkillBufferProxy",
}

const EnumUIPackage = {
	ball: "ball",
}

const EnumDataState = {
	Add: "add",
	Delete: "delete",
	Update: "update",
}

const EnumCommond = {
	share: "share_commond",
	moneyUpdate: "moneyUpdate_commond",
	reStart: "restart_commond",
}

const EnumFriendKey={
	chapter:"chapter",
	vip:"vip",
	power:"power",
}


var gameGlobal = {
	loginTime: 0,			//登录时间
}

const Define = {
	MinLeaveTime: 60000,		//最短离线时间（毫秒）
	MaxLeaveTime: 4,			//玩家离线默认可累计离线收益时间(小时)
	LeaveAttackCount: 6,		//离线收益每分钟计算吸收次数
	IsWeChat: true,			//是否微信
	IsShareOpen:false,		//开放数据域是否有效
	LeaveEnergyPrice: 100,	//双倍能量价格
	Debug:true,
	CdnUrl:"",				//资源地址
	ServerUrl:"http://192.168.2.120:8901",			//后台地址
	QuickKey:false,				//键盘监听快捷键,
	heartTime:60000,			//心跳时间间隔(毫秒)
}

const enum EnumAppName {
	Login,
	GamePanel,
	LeavePanel,
	NoticePanel,
	RankPanel,
}

declare var timeV:any;
declare var ver:any;
declare var version:string;