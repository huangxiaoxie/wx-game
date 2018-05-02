/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_BallItem extends fairygui.GComponent {

		public m_lockState:fairygui.Controller;
		public m_nameTxt:fairygui.GTextField;
		public m_lvTxt:fairygui.GTextField;
		public m_iconImg:fairygui.GLoader;
		public m_attackTxt:fairygui.GTextField;
		public m_upBtn:UI_BuyBtn;
		public m_lockBtn:fairygui.GButton;

		public static URL:string = "ui://tlo9kvuvpr18f";

		public static createInstance():UI_BallItem {
			return <UI_BallItem><any>(fairygui.UIPackage.createObject("ball","BallItem"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_lockState = this.getControllerAt(0);
			this.m_nameTxt = <fairygui.GTextField><any>(this.getChildAt(1));
			this.m_lvTxt = <fairygui.GTextField><any>(this.getChildAt(2));
			this.m_iconImg = <fairygui.GLoader><any>(this.getChildAt(3));
			this.m_attackTxt = <fairygui.GTextField><any>(this.getChildAt(4));
			this.m_upBtn = <UI_BuyBtn><any>(this.getChildAt(5));
			this.m_lockBtn = <fairygui.GButton><any>(this.getChildAt(6));
		}
	}
}