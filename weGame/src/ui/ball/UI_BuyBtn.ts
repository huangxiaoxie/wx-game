/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_BuyBtn extends fairygui.GButton {

		public m_upImg:fairygui.GImage;

		public static URL:string = "ui://tlo9kvuvfddh1o";

		public static createInstance():UI_BuyBtn {
			return <UI_BuyBtn><any>(fairygui.UIPackage.createObject("ball","BuyBtn"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_upImg = <fairygui.GImage><any>(this.getChildAt(3));
		}
	}
}