/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_NoticePanel extends fairygui.GComponent {

		public m_type:fairygui.Controller;
		public m_titleTxt:fairygui.GTextField;
		public m_msgTxt:fairygui.GTextField;
		public m_okBtn:UI_LeaveBtn;
		public m_noBtn:UI_LeaveBtn;

		public static URL:string = "ui://tlo9kvuvp4bd2t";

		public static createInstance():UI_NoticePanel {
			return <UI_NoticePanel><any>(fairygui.UIPackage.createObject("ball","NoticePanel"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_type = this.getControllerAt(0);
			this.m_titleTxt = <fairygui.GTextField><any>(this.getChildAt(2));
			this.m_msgTxt = <fairygui.GTextField><any>(this.getChildAt(3));
			this.m_okBtn = <UI_LeaveBtn><any>(this.getChildAt(4));
			this.m_noBtn = <UI_LeaveBtn><any>(this.getChildAt(5));
		}
	}
}