/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_GameWnd extends fairygui.GComponent {

		public m_shoptab:fairygui.Controller;
		public m_native:fairygui.Controller;
		public m_phyCon:fairygui.GComponent;
		public m_levelTxt:fairygui.GTextField;
		public m_energyTxt:fairygui.GTextField;
		public m_progressBar:fairygui.GProgressBar;
		public m_energyAddTxt:fairygui.GTextField;
		public m_ballTab:fairygui.GButton;
		public m_getBtn:fairygui.GButton;
		public m_skillTab:fairygui.GButton;
		public m_magicBallTab:fairygui.GButton;
		public m_shopTab:fairygui.GButton;
		public m_ballList:fairygui.GList;
		public m_skillList:fairygui.GList;
		public m_moneyNumTxt:fairygui.GTextField;
		public m_shopList:fairygui.GList;
		public m_magicBallList:fairygui.GList;
		public m_friendBtn:fairygui.GButton;
		public m_tabAni:fairygui.GMovieClip;
		public m_clickAni:fairygui.GMovieClip;
		public m_testBtn:fairygui.GButton;
		public m_energyAni:fairygui.Transition;

		public static URL:string = "ui://tlo9kvuvpr187";

		public static createInstance():UI_GameWnd {
			return <UI_GameWnd><any>(fairygui.UIPackage.createObject("ball","GameWnd"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_shoptab = this.getControllerAt(0);
			this.m_native = this.getControllerAt(1);
			this.m_phyCon = <fairygui.GComponent><any>(this.getChildAt(1));
			this.m_levelTxt = <fairygui.GTextField><any>(this.getChildAt(3));
			this.m_energyTxt = <fairygui.GTextField><any>(this.getChildAt(4));
			this.m_progressBar = <fairygui.GProgressBar><any>(this.getChildAt(6));
			this.m_energyAddTxt = <fairygui.GTextField><any>(this.getChildAt(7));
			this.m_ballTab = <fairygui.GButton><any>(this.getChildAt(9));
			this.m_getBtn = <fairygui.GButton><any>(this.getChildAt(10));
			this.m_skillTab = <fairygui.GButton><any>(this.getChildAt(11));
			this.m_magicBallTab = <fairygui.GButton><any>(this.getChildAt(12));
			this.m_shopTab = <fairygui.GButton><any>(this.getChildAt(13));
			this.m_ballList = <fairygui.GList><any>(this.getChildAt(14));
			this.m_skillList = <fairygui.GList><any>(this.getChildAt(15));
			this.m_moneyNumTxt = <fairygui.GTextField><any>(this.getChildAt(17));
			this.m_shopList = <fairygui.GList><any>(this.getChildAt(18));
			this.m_magicBallList = <fairygui.GList><any>(this.getChildAt(19));
			this.m_friendBtn = <fairygui.GButton><any>(this.getChildAt(20));
			this.m_tabAni = <fairygui.GMovieClip><any>(this.getChildAt(21));
			this.m_clickAni = <fairygui.GMovieClip><any>(this.getChildAt(22));
			this.m_testBtn = <fairygui.GButton><any>(this.getChildAt(23));
			this.m_energyAni = this.getTransitionAt(0);
		}
	}
}