/** This is an automatically generated class by FairyGUI. Please do not modify it. **/

module ui.ball {

	export class UI_ScoreUnit extends fairygui.GComponent {

		public m_iconImg:fairygui.GLoader;
		public m_scoreTxt:fairygui.GTextField;
		public m_hitAni:fairygui.Transition;

		public static URL:string = "ui://tlo9kvuvrhmah";

		public static createInstance():UI_ScoreUnit {
			return <UI_ScoreUnit><any>(fairygui.UIPackage.createObject("ball","ScoreUnit"));
		}

		public constructor() {
			super();
		}

		protected constructFromXML(xml: any): void {
			super.constructFromXML(xml);

			this.m_iconImg = <fairygui.GLoader><any>(this.getChildAt(0));
			this.m_scoreTxt = <fairygui.GTextField><any>(this.getChildAt(1));
			this.m_hitAni = this.getTransitionAt(0);
		}
	}
}