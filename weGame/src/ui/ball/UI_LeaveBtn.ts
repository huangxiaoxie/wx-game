/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_LeaveBtn extends fairygui.GButton {

		public m_state:fairygui.Controller;
		public m_moneyTxt:fairygui.GTextField;

		public static URL:string = "ui://tlo9kvuvp4bd2n";

		public static createInstance():UI_LeaveBtn {
			return <UI_LeaveBtn><any>(fairygui.UIPackage.createObject("ball","LeaveBtn"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_state = this.getControllerAt(1);
			this.m_moneyTxt = <fairygui.GTextField><any>(this.getChildAt(2));
		}
	}
}