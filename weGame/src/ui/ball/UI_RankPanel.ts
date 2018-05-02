/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_RankPanel extends fairygui.GComponent {

		public m_tab:fairygui.Controller;
		public m_closeBtn:fairygui.GButton;
		public m_listCon:fairygui.GComponent;
		public m_chapterTab:fairygui.GButton;
		public m_powerTab:fairygui.GButton;

		public static URL:string = "ui://tlo9kvuvbjvq4c";

		public static createInstance():UI_RankPanel {
			return <UI_RankPanel><any>(fairygui.UIPackage.createObject("ball","RankPanel"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_tab = this.getControllerAt(0);
			this.m_closeBtn = <fairygui.GButton><any>(this.getChildAt(2));
			this.m_listCon = <fairygui.GComponent><any>(this.getChildAt(3));
			this.m_chapterTab = <fairygui.GButton><any>(this.getChildAt(4));
			this.m_powerTab = <fairygui.GButton><any>(this.getChildAt(5));
		}
	}
}