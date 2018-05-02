/**
* name 
*/
module app.ball {
	export class ScoreUnit extends ui.ball.UI_ScoreUnit {
		public body: Matter.Body;
		private _unitVo: IScoreUnitVo;
		static hash: any = {};
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			this.body = Matter.Bodies.circle(0, 0, this.width / 2, {
				restitution: 1,
				// friction: 0,

				frictionAir: 0,
				frictionStatic: 0,
				slop: 0,
				isStatic: true,
				layaSprite: this.displayObject,
				collisionFilter: {
					category: UnitScoreCategory
				},
			});
			this.onClick(this, this._clickSelf);
			this.on(Laya.Event.MOUSE_DOWN,this,this._mouseDown);
			this.on(Laya.Event.MOUSE_UP,this,this._mouseUp);
			this.on(Laya.Event.MOUSE_OUT,this,this._mouseUp);
		}

		public setData(scoreUnitVo: IScoreUnitVo) {
			this._unitVo = scoreUnitVo;
			this.m_scoreTxt.text = formula.numToShowStr(this._unitVo.iHp);
			this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, scoreUnitVo.kSkin);
		}

		public getData(): IScoreUnitVo {
			return this._unitVo;
		}

		public hit(damage: number): number {
			if (!this._unitVo) return;
			if(!dataMgr.unitProxy.damageUnit(this._unitVo.id, damage))return 0;
			this.m_scoreTxt.text = formula.numToShowStr(this._unitVo.iHp);
			if (this._unitVo.iHp == 0) {
				this._onDead();
			}else{
				this.m_hitAni.play(null, 1);
			}
			return damage;
		}

		private _mouseDown(){
			Laya.timer.once(300,this,this._loopClick);
		}

		private _mouseUp(){
			Laya.timer.clear(this,this._loopClick);
			Laya.timer.clear(this,this._clickSelf);
		}

		private _loopClick(){
			Laya.timer.loop(9/30*1000,this,this._clickSelf);
		}
		

		private _clickSelf() {
			var clickBall = dataMgr.ballProxy.clickBall;
			if (!clickBall) return;
			var ballRes = dataMgr.sys_ballHash.getData(clickBall.kId);
			var defaultAttack = formula.getBallAttack(clickBall.kId, clickBall.iLevel);
			var attack = defaultAttack * Math.max(1,dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.DianJiJiaCheng));
			this.hit(attack);
			this.displayObject.event("playAni");
		}

		private _onDead() {
			debug.log(this._unitVo.id + "被删除");
			delete ScoreUnit.hash[this._unitVo.id];
			this._unitVo = null;
			this.displayObject.event("dead");
			this.dispose();
		}
	}

	export class MoveBallItem extends ui.ball.UI_MoveBallItem {
		public body: Matter.Body;
		public normalSpeed: number = 0;
		protected _ballVo: IBallVo;
		protected _ballRes: SeResBall;
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();

		}

		public setData(d: IBallVo) {
			this._ballVo = d;
			var ballRes: SeResBall = dataMgr.sys_ballHash.getData(this._ballVo.kId);
			this._ballRes = ballRes;
			this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, ballRes.kSkin);
			this.width = this.height = ballRes.iRadius * 2;
			this.body = Matter.Bodies.circle(0, 0, ballRes.iRadius, {
				restitution: 1,
				friction: 0,
				frictionAir: 0,
				frictionStatic: 0,
				slop: 0,
				layaSprite: this.displayObject,
				collisionFilter: {
					mask: defaultCategory | UnitScoreCategory
				},
			});
			if (d.velocity) {
				Matter.Body.setVelocity(this.body, d.velocity);
			} else {
				var angle = Math.random() * 360;
				Matter.Body.setVelocity(this.body, { x: Math.cos(angle / Math.PI) * ballRes.iSpeed, y: Math.sin(angle / Math.PI) * ballRes.iSpeed });
			}
			this.normalSpeed = ballRes.iSpeed;
		}

		public collision() {
			var nowVer = this.body.velocity;
			var scale = this.body.speed != 0 ? this.normalSpeed * Math.max(dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.ZhuangJiJiaCheng), 1) / this.body.speed : 0;
			if(Math.abs(nowVer.x)<0.1){
				nowVer.x=nowVer.x>0?1:-1;
			}
			if(Math.abs(nowVer.y)<0.1){
				nowVer.y=nowVer.y>0?1:-1;
			}
			nowVer.x *= scale;
			nowVer.y *= scale;
			Matter.Body.setVelocity(this.body, nowVer)
		}


		public hitUnit(unit: ScoreUnit) {
			var attack = formula.getBallRealAttack(this._ballRes.kId);
			unit.hit(attack);
		}

		public dispose() {
			this._ballRes = null;
			this._ballVo = null;
			super.dispose();
		}
	}

	export class MagicMoveBall extends MoveBallItem {
		public hitUnit(unit: ScoreUnit) {
			var attack = formula.getBallRealAttack(this._ballRes.kId);
			var hitList = [];
			for (var id in ScoreUnit.hash) {
				if (ScoreUnit.hash[id] != unit) {
					hitList.push(ScoreUnit.hash[id]);
				}
			}
			unit.hit(attack);
			while (hitList.length > 0) {
				hitList[0].hit(attack * 0.12);
				hitList.shift();
			}
		}
	}
}