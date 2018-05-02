/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_TestPage extends fairygui.GComponent {

		public m_closeBtn:fairygui.GButton;
		public m_nameTxt:fairygui.GTextInput;
		public m_pwdTxt:fairygui.GTextInput;
		public m_loginBtn:fairygui.GButton;
		public m_getBtn:fairygui.GButton;
		public m_payBtn:fairygui.GButton;
		public m_giveBtn:fairygui.GButton;
		public m_cancelBtn:fairygui.GButton;

		public static URL:string = "ui://tlo9kvuvbhxc0";

		public static createInstance():UI_TestPage {
			return <UI_TestPage><any>(fairygui.UIPackage.createObject("ball","TestPage"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_closeBtn = <fairygui.GButton><any>(this.getChildAt(1));
			this.m_nameTxt = <fairygui.GTextInput><any>(this.getChildAt(2));
			this.m_pwdTxt = <fairygui.GTextInput><any>(this.getChildAt(3));
			this.m_loginBtn = <fairygui.GButton><any>(this.getChildAt(4));
			this.m_getBtn = <fairygui.GButton><any>(this.getChildAt(5));
			this.m_payBtn = <fairygui.GButton><any>(this.getChildAt(6));
			this.m_giveBtn = <fairygui.GButton><any>(this.getChildAt(7));
			this.m_cancelBtn = <fairygui.GButton><any>(this.getChildAt(8));
		}
	}
}