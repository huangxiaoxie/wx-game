/**
* name 
*/
module app.ball {
	export class IdleBall extends core.uiLib.AppBase {
		constructor() {
			super();
		}
		start(d: any) {
			super.start(d);
		}

		protected override_startInitMvc() {
			super.override_startInitMvc();
			this._registMediator(new IdleBallMediator(EnumMediatorName.IdleBall, this));
		}
	}


	class IdleBallMediator extends framework.mvc.Mediator {
		private _panel: BallPanel;
		constructor(name: string, viewCompoment?: any) {
			super(name, viewCompoment);
			this.registCmd(dataMgr.userProxy.cmd_update, this._updateGui);
			this.registCmd(dataMgr.userProxy.cmd_EnergyUpdate, this._energyUpdate);
			this.registCmd(dataMgr.ballProxy.cmd_add, (n: INotification) => {
				this.checkGuide();
				this._panel && this._panel.addBall(n.body);
			});
			this.registCmd(dataMgr.unitProxy.cmd_allDead, (n: INotification) => {
				//这里晚一点开始，让死亡逻辑处理完
				this._panel && Laya.timer.callLater(this._panel, this._panel.nextChapter);
			});

			this.registCmd(dataMgr.skillProxy.cmd_update, (n: INotification) => {
				//这里晚一点开始，让死亡逻辑处理完
				if(this._panel){
					this._panel.m_skillList.refreshVirtualList();
					this._panel.m_shopList.refreshVirtualList();
				}
			});

			this.registCmd(EnumCommond.moneyUpdate, (n: INotification) => {
				//这里晚一点开始，让死亡逻辑处理完
				this._panel && this._panel.updateMoney();
			});

			this.registCmd(EnumCommond.reStart, (n: INotification) => {
				this._panel.reStart();
			});
		}

		public onRegist() {
			super.onRegist();
			fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_BallItem.URL, BallItem);
			fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_MagicItem.URL, MagicItem);
			fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_RechargeItem.URL, RechargeItem);
			this._panel = <BallPanel>fairygui.UIPackage.createObject(EnumUIPackage.ball, "GameWnd", BallPanel);
			var sys=Define.IsWeChat?wx.getSystemInfoSync():{model:""};
			this._panel.m_native.setSelectedPage(Laya.Browser.onIOS ? (sys.model!="iPhone X"?"ios":"ipx") : "android");
			this._viewCompoment.addChild(this._panel);
			this._viewCompoment.bindWH(this._panel);
			this._panel.m_tabAni.visible = false;
			this._panel.initUI();
			dataMgr.userProxy.getLeaveEnergy();
			this._panel.startGame();
			this.checkGuide();
		}

		public checkGuide() {
			if (!this._panel.m_tabAni) return;
			var userVo = dataMgr.userProxy.userVo;
			var guideStep = userVo.iGuide || 1;
			if (guideStep == 1) {
				if (userVo.iPoolEnergy == 0) {
					var unitHash = ScoreUnit.hash;
					for (var key in unitHash) {
						var scoreUnit: ScoreUnit = unitHash[key];
						var p = this._panel.globalToLocal(scoreUnit.body.position.x, scoreUnit.body.position.y);
						this._panel.m_tabAni.visible = true;
						this._panel.m_tabAni.x = p.x;
						this._panel.m_tabAni.y = p.y;
						return;
					}
				} else {
					userVo.iGuide = 2;
					this.checkGuide();
				}
			} else if (guideStep == 2) {
				if (userVo.iEnergy == 0) {
					var getBtn = this._panel.m_getBtn;
					var p = this._panel.localToGlobal(getBtn.x + getBtn.width / 2, getBtn.y + getBtn.height / 2);
					this._panel.globalToLocal(p.x, p.y, p);
					this._panel.m_tabAni.visible = true;
					this._panel.m_tabAni.x = p.x;
					this._panel.m_tabAni.y = p.y;
				} else {
					userVo.iGuide++;
					this.checkGuide();
				}
			} else if (guideStep == 3) {
				var ballVo: IBallVo;
				var hash = dataMgr.ballProxy.getData();
				for (var key in hash) {
					ballVo = hash[key];
					var ballRes = dataMgr.sys_ballHash.getData(ballVo.kId);
					if (ballRes.eType != SeEnumBalleType.DianJi) {
						userVo.iGuide++;
						this.checkGuide();
						return;
					}
				}
				var item: BallItem = <BallItem>this._panel.m_ballList.getChildAt(1);
				var p = item.localToGlobal(item.m_upBtn.x + item.m_upBtn.width / 2, item.m_upBtn.y + item.m_upBtn.height / 2);
				this._panel.globalToLocal(p.x, p.y, p);
				this._panel.m_tabAni.visible = true;
				this._panel.m_tabAni.x = p.x;
				this._panel.m_tabAni.y = p.y;
			} else {
				this._panel.m_tabAni.dispose();
				this._panel.m_tabAni = null;
			}
		}

		private _updateGui() {
			this.checkGuide();
			this._panel && this._panel.updateGui();
		}

		private _energyUpdate(n: INotification) {
			this._panel && this._panel.energyUpdate(n.body);
		}
	}

	type Bodies = Matter.Bodies;
	export const Game_Width: number = 750;
	export const Game_Height: number = 750;
	export const defaultCategory = 0x0002;
	export const UnitScoreCategory = 0x0004;
	class BallPanel extends ui.ball.UI_GameWnd {
		private LayaRender: any = Laya.Browser.window.LayaRender;
		private world: Matter.World;
		private engine: Matter.Engine;
		private render: any;
		private runner: Matter.Runner;
		private mouseConstraint: Matter.MouseConstraint;
		private _startX = 0;
		private _startY = 125;
		private _phyWidth: number = 750;
		private _phyHeight: number = 750;
		private _clickAniHandler: Laya.Handler;
		constructor() {
			super();
		}

		public constructFromResource() {
			super.constructFromResource();
			this.m_getBtn.onClick(this, () => {
				dataMgr.userProxy.getPoolEnergy();
				this.m_getBtn.enabled = false;
				Laya.timer.once(1000, this, () => {
					this.m_getBtn.enabled = true;
				})
			});
			this.m_friendBtn.onClick(this,()=>{
				this.m_friendBtn.selected=false;
				if(Define.IsShareOpen){
					appMgr.open(EnumAppName.RankPanel);
				}else{
					appMgr.showMsg("微信版本过低，好友功能无法使用，请升级微信");
				}
			})
			Laya.stage.on("resize", this, this.onResize);
			if (Define.QuickKey) {
				this.m_testBtn.visible = true;
				this.m_testBtn.onClick(this, () => {
					appMgr.open(EnumAppName.Login);
				});
			}
		}

		public initUI() {
			this._initShop();
			this.updateGui();
			this.energyUpdate();
			this.updateMoney();
		}

		public startGame() {
			if (!this.engine) {
				var engine = Matter.Engine.create();
				this.engine = engine;
			}
			engine = this.engine;
			this.runner = Matter.Engine.run(this.engine);
			this.world = engine.world;
			this.world.gravity.y = 0;
			var render = this.LayaRender.create({ engine: engine, container: this.m_phyCon.displayObject, width: Laya.stage.width, height: Laya.stage.height, options: { wireframes: false } });
			this.render = render;
			this.LayaRender.run(render);
			this._initWorld();
			var userVo = dataMgr.userProxy.userVo;
			if (userVo.isInGame) {
				if (!dataMgr.unitProxy.getData()) {
					this._startChapter(userVo.iLevel + 1);
				}
			} else {
				this._startChapter(1);
			}
			userVo.isInGame = true;
			this._initBall();
			this._createUnit();
			dataMgr.unitProxy.checkChapterOver();
		}

		public reStart() {
			Matter.Events.off(this.engine);
			Matter.Runner.stop(this.runner);
			this.LayaRender.stop(this.render);
			Matter.Engine.clear(this.engine);
			Matter.World.clear(this.world, false);
			this.render = null;
			var toX = this.m_phyCon.x + this.m_phyCon.width / 2;
			var toY = this.m_phyCon.y + this.m_phyCon.height / 2;
			for (var i = 0; i < this.m_phyCon.displayObject.numChildren; i++) {
				var sprite: Laya.Sprite = <Laya.Sprite>this.m_phyCon.displayObject.getChildAt(i);
				if (sprite["$owner"]) {
					Laya.Tween.to(sprite["$owner"], { x: toX, y: toY, scaleX: 0, scaleY: 0 }, 1000, Laya.Ease.cubicIn, Laya.Handler.create(this, (sp: fairygui.GObject) => {
						sp.dispose();
					}, [sprite["$owner"]]));
				}
			}
			Laya.timer.once(1000, this, () => {
				this.updateGui();
				this.energyUpdate(0);
				this.startGame();
			})
		}

		public updateGui() {
			var userVo: IUseVo = dataMgr.userProxy.userVo;
			this.m_levelTxt.text = `第 ${userVo.iLevel} 关`;
			var chapterRes = dataMgr.sys_chapter.getData(Math.max(userVo.iLevel, 1).toString());
			this.m_progressBar.value = dataMgr.unitProxy.chapterDamage / chapterRes.iHp / chapterRes.iUnitNum * 100;
			this.m_getBtn.text = formula.numToShowStr(userVo.iPoolEnergy);
		}

		public updateMoney() {
			this.m_moneyNumTxt.text = payMgr.balanceVo.balance.toString();
		}

		private _aniList: Array<number>;
		private _aniTarget: { value: number, addNum: number };
		private _updateHandler: Laya.Handler;
		private _isAni: boolean = false;
		private _currValue: number = 0;
		public energyUpdate(updateNum: number = 0) {
			this.m_ballList.refreshVirtualList();
			this.m_magicBallList.refreshVirtualList();
			if (updateNum == 0 || !this._aniTarget) {
				this._setEnergyTxt(formula.numToShowStr(dataMgr.userProxy.userVo.iEnergy));
				this._aniTarget = { value: 0, addNum: 0 };
				this._updateHandler = Laya.Handler.create(this, this._updateEnergy, null, false);
				this._isAni = false;
				this._aniList = [];
				this._currValue = dataMgr.userProxy.userVo.iEnergy;
				this.m_energyAddTxt.text = "";
			} else if (updateNum > 0) {
				this._aniList.push(updateNum);
				if (!this._isAni) {
					this._energyAni();
				}
			} else {
				this._currValue += updateNum;
				if (!this._isAni) {
					this._setEnergyTxt(formula.numToShowStr(this._currValue));
				}
			}
		}

		private _energyAni(preAddNum: number = 0) {
			this._currValue += preAddNum;
			if (this._aniList.length > 0) {
				var addNum = this._aniList.shift();
				this._aniTarget.value = 0;
				this._aniTarget.addNum = addNum;
				this._updateEnergy();
				Laya.Tween.to(this._aniTarget, { value: addNum, update: this._updateHandler }, addNum < 1000 ? 300 : 1000, null, Laya.Handler.create(this, this._energyAni, [addNum]), 300);
			} else {
				this._isAni = false;
				this.m_energyAddTxt.text = "";
			}
		}

		private _updateEnergy() {
			this._setEnergyTxt(formula.numToShowStr(this._aniTarget.value + this._currValue));
			if (this._aniTarget.addNum - this._aniTarget.value < 1) {
				this.m_energyAddTxt.text = "";
			} else {
				this.m_energyAddTxt.text = "+" + formula.numToShowStr(this._aniTarget.addNum - this._aniTarget.value);
			}
		}

		private _setEnergyTxt(str: string) {
			if (this.m_energyTxt.text != str) {
				this.m_energyTxt.text = str;
				if (!this.m_energyAni.playing) {
					this.m_energyAni.play(null, 1);
				}
			}
		}

		public addBall(ballVo: IBallVo) {
			var ballRes: SeResBall = dataMgr.sys_ballHash.getData(ballVo.kId);
			var moveBall: MoveBallItem;
			if (ballRes.eType == SeEnumBalleType.XiaoQiu) {
				moveBall = <MoveBallItem>fairygui.UIPackage.createObject(EnumUIPackage.ball, "MoveBallItem", MoveBallItem);
			} else if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
				moveBall = <MoveBallItem>fairygui.UIPackage.createObject(EnumUIPackage.ball, "MoveBallItem", MagicMoveBall);
			}
			if (!moveBall) return;
			var x = ballVo.x;
			var y = ballVo.y;
			if (!x && !y) {
				x = Math.random() * (this._phyWidth - ballRes.iRadius * 2) + this._startX;
				y = Math.random() * (this._phyHeight - ballRes.iRadius * 2) + this._startY;
			}
			moveBall.setData(ballVo);
			Matter.Body.setPosition(moveBall.body, { x: x, y: y });
			Matter.World.add(this.world, moveBall.body);
		}

		public nextChapter() {
			if (!this.world) return;	//世界没建立，跳过此次重新开始
			this._startChapter(dataMgr.userProxy.userVo.iLevel + 1);
			this._createUnit();
			this.m_magicBallList.refreshVirtualList();
			storageMgr.saveData();
		}

		private _startChapter(level: number) {
			var chapterRes: SeResChapter = dataMgr.sys_chapter.getData(level.toString());
			if (!chapterRes) {
				debug.error("关卡数据没了---");
				return;
			}
			var hash = {};
			const Line_Count = 3;
			const Unit_Width = 100;
			var rangeW = this._phyWidth / Line_Count - Unit_Width;
			var rowCount = Math.ceil(chapterRes.iUnitNum / Line_Count);
			var ranggeH = (this._phyHeight - 80) / rowCount - Unit_Width;
			for (var i = 0; i < chapterRes.iUnitNum; i++) {
				var x = Math.min(this._startX + Unit_Width / 2 + (Math.random() * 1.2 - 0) * rangeW + (rangeW + Unit_Width) * (i % Line_Count), this._phyWidth - Unit_Width / 2);
				var y = this._startY + Unit_Width / 2 + (Math.random() * 1.2 - 0) * ranggeH + (ranggeH + Unit_Width) * Math.floor(i / Line_Count);
				var scoreUnit: IScoreUnitVo = {
					x: x,
					y: y,
					iHp: chapterRes.iHp,
					kSkin: chapterRes.kUnitSkin,
					id: i + 1,
				};
				hash[scoreUnit.id] = scoreUnit;
			}
			dataMgr.userProxy.userVo.iLevel = level;
			dataMgr.unitProxy.setData(hash);
		}

		private _initWorld() {
			var offset = 300, options = {
				isStatic: true,
				restitution: 1,
				// friction: 0,
				frictionAir: 0,
				frictionStatic: 0,
				unshow: true,
				collisionFilter: {
					category: defaultCategory
				},
			};
			var startX: number = this._startX;
			var startY: number = this._startY;
			var w = this._phyWidth = this.m_phyCon.width;
			var h = this._phyHeight = this.m_phyCon.height - startY;
			Matter.World.add(this.world, [
				Matter.Bodies.rectangle(startX + w / 2, startY - offset / 2, w + offset * 2, offset, options),
				Matter.Bodies.rectangle(startX - offset / 2, startY + h / 2, offset, h + offset * 2, options),
				Matter.Bodies.rectangle(startX + w + offset / 2, startY + h / 2, offset, h + offset * 2, options),
				Matter.Bodies.rectangle(startX + w / 2, startY + h + offset / 2, w + offset * 2, offset, options)
			]);
			var categoryBall = 0x0010; // 分类
			this.onResize();
			var normalVer = Matter.Vector.create(10, 5);
			Matter.Events.on(this.engine, "collisionEnd", (event) => {
				var pairs = event.pairs;

				// change object colours to show those ending a collision
				for (var i = 0; i < pairs.length; i++) {
					var pair: Matter.IPair = pairs[i];
					var scoreUnit: ScoreUnit = null;
					var moveBall: MoveBallItem = null;
					if (pair.bodyA.layaSprite && pair.bodyA.layaSprite["$owner"]) {
						if (pair.bodyA.layaSprite["$owner"] instanceof ScoreUnit) {
							scoreUnit = <ScoreUnit>pair.bodyA.layaSprite["$owner"];
						}
						if (pair.bodyA.layaSprite["$owner"] instanceof MoveBallItem) {
							moveBall = <MoveBallItem>pair.bodyA.layaSprite["$owner"];
							moveBall.collision();
						}
					}

					if (pair.bodyB.layaSprite && pair.bodyB.layaSprite["$owner"]) {
						if (pair.bodyB.layaSprite["$owner"] instanceof ScoreUnit) {
							scoreUnit = <ScoreUnit>pair.bodyB.layaSprite["$owner"];
						}
						if (pair.bodyB.layaSprite["$owner"] instanceof MoveBallItem) {
							moveBall = <MoveBallItem>pair.bodyB.layaSprite["$owner"];
							moveBall.collision();
						}
					}
					if (moveBall && scoreUnit) {
						moveBall.hitUnit(scoreUnit);
					}
				}
			});

			// this.onClick(this, (e: Laya.Event) => {
			// 	if (e.stageY > this._startY && e.stageY < this._startY + Game_Height) {
			// 		var moveBall = <MoveBallItem>fairygui.UIPackage.createObject(EnumUIPackage.ball, "MoveBallItem", MoveBallItem);
			// 		Matter.Body.setPosition(moveBall.body, { x: e.stageX, y: e.stageY });
			// 		Matter.World.add(this.world, moveBall.body);
			// 	}
			// });
		}

		private _createUnit() {
			ScoreUnit.hash = {};
			var hash = dataMgr.unitProxy.getData();
			if (!this._clickAniHandler) {
				this._clickAniHandler = Laya.Handler.create(this, () => {
					this.m_clickAni.visible = false;
				});
			};

			for (var id in hash) {
				var scoreUnitVo: IScoreUnitVo = hash[id];
				if (scoreUnitVo.iHp <= 0) continue;
				var scoreUnit = <ScoreUnit>fairygui.UIPackage.createObject(EnumUIPackage.ball, "ScoreUnit", ScoreUnit);
				scoreUnit.setData(scoreUnitVo);
				ScoreUnit.hash[scoreUnitVo.id] = scoreUnit;
				Matter.Body.setPosition(scoreUnit.body, { x: scoreUnitVo.x, y: scoreUnitVo.y });
				Matter.World.add(this.world, scoreUnit.body);
				scoreUnit.on("dead", this, (_scoteUnit) => {
					var deadAni: fairygui.GMovieClip = fairygui.UIPackage.createObject(EnumUIPackage.ball, "DeadAni").asMovieClip;
					this.addChild(deadAni);
					deadAni.setPivot(0.5, 0.5, true);
					deadAni.x = _scoteUnit.x;
					deadAni.y = _scoteUnit.y;
					deadAni.setPlaySettings(0, -1, 1, deadAni.movieClip.frameCount, Laya.Handler.create(this, (ani: fairygui.GMovieClip) => {
						ani.dispose();
					}, [deadAni]))
					Matter.World.remove(this.world, _scoteUnit.body);
				}, [scoreUnit]);
				scoreUnit.on("playAni", this, (x, y) => {
					this.m_clickAni.visible = true;
					this.m_clickAni.x = x;
					this.m_clickAni.y = y;
					this.m_clickAni.setPlaySettings(0, -1, 1, this.m_clickAni.movieClip.frameCount, this._clickAniHandler);
				}, [scoreUnitVo.x, scoreUnitVo.y]);
			}
		}

		private _initBall() {
			var ballHash = dataMgr.ballProxy.getData();
			for (var key in ballHash) {
				this.addBall(ballHash[key]);
			}
		}

		private _initShop() {
			var hash = dataMgr.sys_ballHash.getAllRes();
			var magicIdList = [];
			var ballIdList = [];
			for (var key in hash) {
				var ballRes: SeResBall = hash[key];
				if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
					magicIdList.push(ballRes.kId);
				} else {
					ballIdList.push(ballRes.kId);
				}
			}
			this.m_ballList.setVirtual();
			this.m_ballList.itemRenderer = Laya.Handler.create(this, this._renderList, [ballIdList], false);
			this.m_magicBallList.setVirtual();
			this.m_magicBallList.itemRenderer = Laya.Handler.create(this, this._renderList, [magicIdList], false);
			this.m_ballList.numItems = ballIdList.length;
			this.m_magicBallList.numItems = magicIdList.length;

			var skillIdList = [];
			var shopIdList: Array<{ kId: string, type: EnumChargeItemType }> = [];
			var rechargeHash = dataMgr.sys_recharge.getAllRes();
			for (var key in rechargeHash) {
				var rechargeRes: SeResRecharge = rechargeHash[key];
				shopIdList.push({ kId: rechargeRes.kId, type: EnumChargeItemType.Recharge });
			}

			var skillHash = dataMgr.sys_skill.getAllRes();
			for (var key in skillHash) {
				var skillRes: SeResSkill = skillHash[key];
				if (skillRes.eTab == SeEnumSkilleTab.JiNen) {
					skillIdList.push(skillRes.kId);
				} else if (skillRes.eTab == SeEnumSkilleTab.ShangCheng) {
					shopIdList.push({ kId: skillRes.kId, type: EnumChargeItemType.Cost });
				}
			}

			this.m_skillList.setVirtual();
			this.m_skillList.itemRenderer = Laya.Handler.create(this, this._renderList, [skillIdList], false);
			this.m_shopList.setVirtual();
			this.m_shopList.itemRenderer = Laya.Handler.create(this, this._renderList, [shopIdList], false);
			this.m_skillList.numItems = skillIdList.length;
			this.m_shopList.numItems = shopIdList.length;
		}

		private _renderList(idList: Array<any>, index: number, cell: IListItem) {
			var ballId = idList[index];
			cell.setData(ballId);
		}

		private onResize(): void {
			// 设置鼠标的坐标缩放
			// Laya.stage.clientScaleX代表舞台缩放
			// Laya.stage._canvasTransform代表画布缩放
			// Matter.Mouse.setScale(this.mouseConstraint.mouse, { x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a), y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d) });
		}
	}

	export interface IListItem {
		setData(d: any);
	}
}