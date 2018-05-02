interface SeResBall{ 
      kId?:string;
      iRadius?:number;
      kName?:string;
      iSpeed?:number;
      eType?:number;
      kSkin?:string;
      kIcon?:string;
      iLevel?:number;
      iOpenLevel?:number;
      iAttack?:number;
      iCost?:number;
      iOpenCost?:number;
}


interface SeResChapter{ 
      kId?:string;
      iLevel?:number;
      iHp?:number;
      iUnitNum?:number;
      kUnitSkin?:string;
}


interface SeResRecharge{ 
      kId?:string;
      iPrice?:number;
      kIcon?:string;
}


interface SeResSkill{ 
      kId?:string;
      kName?:string;
      eTab?:number;
      eType?:number;
      iValue?:number;
      kTime?:string;
      kIcon?:string;
      eCostType?:number;
      iPrice?:number;
}


declare enum SeEnumBalleType{ 
      DianJi=0,
      XiaoQiu=1,
      MoFaQiu=2,
}


declare enum SeEnumSkilleTab{ 
      JiNen=0,
      ShangCheng=1,
}


declare enum SeEnumSkilleType{ 
      DianJiJiaCheng=0,
      ZhuangJiJiaCheng=1,
      ShouYiJiaCheng=2,
      LiXianShouYi=3,
}


declare enum SeEnumSkilleCostType{ 
      ZhuanFa=0,
      ZuanShi=1,
}


