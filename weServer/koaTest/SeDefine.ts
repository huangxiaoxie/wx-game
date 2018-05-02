export var SeDBInfoHead = {
    baseInfo: 'baseinfo_',
};

export interface iUserInfo{
    language:string;
    nickName:string;
    avatarUrl:string;   //用户头像图片 url。最后一个数值代表正方形头像大小（有0、46、64、96、132数值可选，0代表640*640正方形头像），用户没有头像时该项为空。若用户更换头像，原有头像 url 将失效。
    gender:number;      //性别0未知，1男性，2女性
    country:string;
    province:string;        //省
    city:string;
}