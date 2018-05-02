/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_LeavePanel extends fairygui.GComponent {

		public m_native:fairygui.Controller;
		public m_energyTxt:fairygui.GTextField;
		public m_getBtn:UI_LeaveBtn;
		public m_shareBtn:UI_LeaveBtn;

		public static URL:string = "ui://tlo9kvuvmtf82l";

		public static createInstance():UI_LeavePanel {
			return <UI_LeavePanel><any>(fairygui.UIPackage.createObject("ball","LeavePanel"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_native = this.getControllerAt(0);
			this.m_energyTxt = <fairygui.GTextField><any>(this.getChildAt(1));
			this.m_getBtn = <UI_LeaveBtn><any>(this.getChildAt(3));
			this.m_shareBtn = <UI_LeaveBtn><any>(this.getChildAt(4));
		}
	}
}