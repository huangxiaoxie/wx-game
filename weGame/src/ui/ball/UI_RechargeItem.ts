/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_RechargeItem extends fairygui.GComponent {

		public m_type:fairygui.Controller;
		public m_nameTxt:fairygui.GTextField;
		public m_iconImg:fairygui.GLoader;
		public m_rechargeBtn:fairygui.GButton;
		public m_buyBtn:fairygui.GButton;
		public m_moneyTxt:fairygui.GTextField;

		public static URL:string = "ui://tlo9kvuvbnnk21";

		public static createInstance():UI_RechargeItem {
			return <UI_RechargeItem><any>(fairygui.UIPackage.createObject("ball","RechargeItem"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_type = this.getControllerAt(0);
			this.m_nameTxt = <fairygui.GTextField><any>(this.getChildAt(1));
			this.m_iconImg = <fairygui.GLoader><any>(this.getChildAt(2));
			this.m_rechargeBtn = <fairygui.GButton><any>(this.getChildAt(3));
			this.m_buyBtn = <fairygui.GButton><any>(this.getChildAt(4));
			this.m_moneyTxt = <fairygui.GTextField><any>(this.getChildAt(5));
		}
	}
}