/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_MagicItem extends fairygui.GComponent {

		public m_state:fairygui.Controller;
		public m_nameTxt:fairygui.GTextField;
		public m_iconImg:fairygui.GLoader;
		public m_timeTxt:fairygui.GTextField;
		public m_buyBtn:fairygui.GButton;

		public static URL:string = "ui://tlo9kvuvbnnk1y";

		public static createInstance():UI_MagicItem {
			return <UI_MagicItem><any>(fairygui.UIPackage.createObject("ball","MagicItem"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_state = this.getControllerAt(0);
			this.m_nameTxt = <fairygui.GTextField><any>(this.getChildAt(1));
			this.m_iconImg = <fairygui.GLoader><any>(this.getChildAt(2));
			this.m_timeTxt = <fairygui.GTextField><any>(this.getChildAt(3));
			this.m_buyBtn = <fairygui.GButton><any>(this.getChildAt(4));
		}
	}
}