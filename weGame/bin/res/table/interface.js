var SeEnumBalleType;
 (function (SeEnumBalleType) {
      SeEnumBalleType[SeEnumBalleType["DianJi"]=0]=["DianJi"];
      SeEnumBalleType[SeEnumBalleType["XiaoQiu"]=1]=["XiaoQiu"];
      SeEnumBalleType[SeEnumBalleType["MoFaQiu"]=2]=["MoFaQiu"];
})(SeEnumBalleType || (SeEnumBalleType = {}));


var SeEnumSkilleTab;
 (function (SeEnumSkilleTab) {
      SeEnumSkilleTab[SeEnumSkilleTab["JiNen"]=0]=["JiNen"];
      SeEnumSkilleTab[SeEnumSkilleTab["ShangCheng"]=1]=["ShangCheng"];
})(SeEnumSkilleTab || (SeEnumSkilleTab = {}));


var SeEnumSkilleType;
 (function (SeEnumSkilleType) {
      SeEnumSkilleType[SeEnumSkilleType["DianJiJiaCheng"]=0]=["DianJiJiaCheng"];
      SeEnumSkilleType[SeEnumSkilleType["ZhuangJiJiaCheng"]=1]=["ZhuangJiJiaCheng"];
      SeEnumSkilleType[SeEnumSkilleType["ShouYiJiaCheng"]=2]=["ShouYiJiaCheng"];
      SeEnumSkilleType[SeEnumSkilleType["LiXianShouYi"]=3]=["LiXianShouYi"];
})(SeEnumSkilleType || (SeEnumSkilleType = {}));


var SeEnumSkilleCostType;
 (function (SeEnumSkilleCostType) {
      SeEnumSkilleCostType[SeEnumSkilleCostType["ZhuanFa"]=0]=["ZhuanFa"];
      SeEnumSkilleCostType[SeEnumSkilleCostType["ZuanShi"]=1]=["ZuanShi"];
})(SeEnumSkilleCostType || (SeEnumSkilleCostType = {}));


 if (typeof exports !== "undefined") {
      exports.SeEnumBalleType=SeEnumBalleType;
      exports.SeEnumSkilleTab=SeEnumSkilleTab;
      exports.SeEnumSkilleType=SeEnumSkilleType;
      exports.SeEnumSkilleCostType=SeEnumSkilleCostType;

 } else {
      this.SeEnumBalleType=SeEnumBalleType;
      this.SeEnumSkilleTab=SeEnumSkilleTab;
      this.SeEnumSkilleType=SeEnumSkilleType;
      this.SeEnumSkilleCostType=SeEnumSkilleCostType;

}
