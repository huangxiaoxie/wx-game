/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_MoveBallItem extends fairygui.GComponent {

		public m_iconImg:fairygui.GLoader;

		public static URL:string = "ui://tlo9kvuvrhmai";

		public static createInstance():UI_MoveBallItem {
			return <UI_MoveBallItem><any>(fairygui.UIPackage.createObject("ball","MoveBallItem"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_iconImg = <fairygui.GLoader><any>(this.getChildAt(0));
		}
	}
}