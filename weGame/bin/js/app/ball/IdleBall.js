var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
* name
*/
var app;
(function (app) {
    var ball;
    (function (ball) {
        var IdleBall = /** @class */ (function (_super) {
            __extends(IdleBall, _super);
            function IdleBall() {
                return _super.call(this) || this;
            }
            IdleBall.prototype.start = function (d) {
                _super.prototype.start.call(this, d);
            };
            IdleBall.prototype.override_startInitMvc = function () {
                _super.prototype.override_startInitMvc.call(this);
                this._registMediator(new IdleBallMediator(EnumMediatorName.IdleBall, this));
            };
            return IdleBall;
        }(core.uiLib.AppBase));
        ball.IdleBall = IdleBall;
        var IdleBallMediator = /** @class */ (function (_super) {
            __extends(IdleBallMediator, _super);
            function IdleBallMediator(name, viewCompoment) {
                var _this = _super.call(this, name, viewCompoment) || this;
                _this.registCmd(dataMgr.userProxy.cmd_update, _this._updateGui);
                _this.registCmd(dataMgr.userProxy.cmd_EnergyUpdate, _this._energyUpdate);
                _this.registCmd(dataMgr.ballProxy.cmd_add, function (n) {
                    _this.checkGuide();
                    _this._panel && _this._panel.addBall(n.body);
                });
                _this.registCmd(dataMgr.unitProxy.cmd_allDead, function (n) {
                    //这里晚一点开始，让死亡逻辑处理完
                    _this._panel && Laya.timer.callLater(_this._panel, _this._panel.nextChapter);
                });
                _this.registCmd(dataMgr.skillProxy.cmd_update, function (n) {
                    //这里晚一点开始，让死亡逻辑处理完
                    if (_this._panel) {
                        _this._panel.m_skillList.refreshVirtualList();
                        _this._panel.m_shopList.refreshVirtualList();
                    }
                });
                _this.registCmd(EnumCommond.moneyUpdate, function (n) {
                    //这里晚一点开始，让死亡逻辑处理完
                    _this._panel && _this._panel.updateMoney();
                });
                _this.registCmd(EnumCommond.reStart, function (n) {
                    _this._panel.reStart();
                });
                return _this;
            }
            IdleBallMediator.prototype.onRegist = function () {
                _super.prototype.onRegist.call(this);
                fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_BallItem.URL, ball.BallItem);
                fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_MagicItem.URL, ball.MagicItem);
                fairygui.UIObjectFactory.setPackageItemExtension(ui.ball.UI_RechargeItem.URL, ball.RechargeItem);
                this._panel = fairygui.UIPackage.createObject(EnumUIPackage.ball, "GameWnd", BallPanel);
                var sys = Define.IsWeChat ? wx.getSystemInfoSync() : { model: "" };
                this._panel.m_native.setSelectedPage(Laya.Browser.onIOS ? (sys.model != "iPhone X" ? "ios" : "ipx") : "android");
                this._viewCompoment.addChild(this._panel);
                this._viewCompoment.bindWH(this._panel);
                this._panel.m_tabAni.visible = false;
                this._panel.initUI();
                dataMgr.userProxy.getLeaveEnergy();
                this._panel.startGame();
                this.checkGuide();
            };
            IdleBallMediator.prototype.checkGuide = function () {
                if (!this._panel.m_tabAni)
                    return;
                var userVo = dataMgr.userProxy.userVo;
                var guideStep = userVo.iGuide || 1;
                if (guideStep == 1) {
                    if (userVo.iPoolEnergy == 0) {
                        var unitHash = ball.ScoreUnit.hash;
                        for (var key in unitHash) {
                            var scoreUnit = unitHash[key];
                            var p = this._panel.globalToLocal(scoreUnit.body.position.x, scoreUnit.body.position.y);
                            this._panel.m_tabAni.visible = true;
                            this._panel.m_tabAni.x = p.x;
                            this._panel.m_tabAni.y = p.y;
                            return;
                        }
                    }
                    else {
                        userVo.iGuide = 2;
                        this.checkGuide();
                    }
                }
                else if (guideStep == 2) {
                    if (userVo.iEnergy == 0) {
                        var getBtn = this._panel.m_getBtn;
                        var p = this._panel.localToGlobal(getBtn.x + getBtn.width / 2, getBtn.y + getBtn.height / 2);
                        this._panel.globalToLocal(p.x, p.y, p);
                        this._panel.m_tabAni.visible = true;
                        this._panel.m_tabAni.x = p.x;
                        this._panel.m_tabAni.y = p.y;
                    }
                    else {
                        userVo.iGuide++;
                        this.checkGuide();
                    }
                }
                else if (guideStep == 3) {
                    var ballVo;
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
                    var item = this._panel.m_ballList.getChildAt(1);
                    var p = item.localToGlobal(item.m_upBtn.x + item.m_upBtn.width / 2, item.m_upBtn.y + item.m_upBtn.height / 2);
                    this._panel.globalToLocal(p.x, p.y, p);
                    this._panel.m_tabAni.visible = true;
                    this._panel.m_tabAni.x = p.x;
                    this._panel.m_tabAni.y = p.y;
                }
                else {
                    this._panel.m_tabAni.dispose();
                    this._panel.m_tabAni = null;
                }
            };
            IdleBallMediator.prototype._updateGui = function () {
                this.checkGuide();
                this._panel && this._panel.updateGui();
            };
            IdleBallMediator.prototype._energyUpdate = function (n) {
                this._panel && this._panel.energyUpdate(n.body);
            };
            return IdleBallMediator;
        }(framework.mvc.Mediator));
        ball.Game_Width = 750;
        ball.Game_Height = 750;
        ball.defaultCategory = 0x0002;
        ball.UnitScoreCategory = 0x0004;
        var BallPanel = /** @class */ (function (_super) {
            __extends(BallPanel, _super);
            function BallPanel() {
                var _this = _super.call(this) || this;
                _this.LayaRender = Laya.Browser.window.LayaRender;
                _this._startX = 0;
                _this._startY = 125;
                _this._phyWidth = 750;
                _this._phyHeight = 750;
                _this._isAni = false;
                _this._currValue = 0;
                return _this;
            }
            BallPanel.prototype.constructFromResource = function () {
                var _this = this;
                _super.prototype.constructFromResource.call(this);
                this.m_getBtn.onClick(this, function () {
                    dataMgr.userProxy.getPoolEnergy();
                    _this.m_getBtn.enabled = false;
                    Laya.timer.once(1000, _this, function () {
                        _this.m_getBtn.enabled = true;
                    });
                });
                this.m_friendBtn.onClick(this, function () {
                    _this.m_friendBtn.selected = false;
                    if (Define.IsShareOpen) {
                        appMgr.open(4 /* RankPanel */);
                    }
                    else {
                        appMgr.showMsg("微信版本过低，好友功能无法使用，请升级微信");
                    }
                });
                Laya.stage.on("resize", this, this.onResize);
                if (Define.QuickKey) {
                    this.m_testBtn.visible = true;
                    this.m_testBtn.onClick(this, function () {
                        appMgr.open(0 /* Login */);
                    });
                }
            };
            BallPanel.prototype.initUI = function () {
                this._initShop();
                this.updateGui();
                this.energyUpdate();
                this.updateMoney();
            };
            BallPanel.prototype.startGame = function () {
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
                }
                else {
                    this._startChapter(1);
                }
                userVo.isInGame = true;
                this._initBall();
                this._createUnit();
                dataMgr.unitProxy.checkChapterOver();
            };
            BallPanel.prototype.reStart = function () {
                var _this = this;
                Matter.Events.off(this.engine);
                Matter.Runner.stop(this.runner);
                this.LayaRender.stop(this.render);
                Matter.Engine.clear(this.engine);
                Matter.World.clear(this.world, false);
                this.render = null;
                var toX = this.m_phyCon.x + this.m_phyCon.width / 2;
                var toY = this.m_phyCon.y + this.m_phyCon.height / 2;
                for (var i = 0; i < this.m_phyCon.displayObject.numChildren; i++) {
                    var sprite = this.m_phyCon.displayObject.getChildAt(i);
                    if (sprite["$owner"]) {
                        Laya.Tween.to(sprite["$owner"], { x: toX, y: toY, scaleX: 0, scaleY: 0 }, 1000, Laya.Ease.cubicIn, Laya.Handler.create(this, function (sp) {
                            sp.dispose();
                        }, [sprite["$owner"]]));
                    }
                }
                Laya.timer.once(1000, this, function () {
                    _this.updateGui();
                    _this.energyUpdate(0);
                    _this.startGame();
                });
            };
            BallPanel.prototype.updateGui = function () {
                var userVo = dataMgr.userProxy.userVo;
                this.m_levelTxt.text = "\u7B2C " + userVo.iLevel + " \u5173";
                var chapterRes = dataMgr.sys_chapter.getData(Math.max(userVo.iLevel, 1).toString());
                this.m_progressBar.value = dataMgr.unitProxy.chapterDamage / chapterRes.iHp / chapterRes.iUnitNum * 100;
                this.m_getBtn.text = app.formula.numToShowStr(userVo.iPoolEnergy);
            };
            BallPanel.prototype.updateMoney = function () {
                this.m_moneyNumTxt.text = payMgr.balanceVo.balance.toString();
            };
            BallPanel.prototype.energyUpdate = function (updateNum) {
                if (updateNum === void 0) { updateNum = 0; }
                this.m_ballList.refreshVirtualList();
                this.m_magicBallList.refreshVirtualList();
                if (updateNum == 0 || !this._aniTarget) {
                    this._setEnergyTxt(app.formula.numToShowStr(dataMgr.userProxy.userVo.iEnergy));
                    this._aniTarget = { value: 0, addNum: 0 };
                    this._updateHandler = Laya.Handler.create(this, this._updateEnergy, null, false);
                    this._isAni = false;
                    this._aniList = [];
                    this._currValue = dataMgr.userProxy.userVo.iEnergy;
                    this.m_energyAddTxt.text = "";
                }
                else if (updateNum > 0) {
                    this._aniList.push(updateNum);
                    if (!this._isAni) {
                        this._energyAni();
                    }
                }
                else {
                    this._currValue += updateNum;
                    if (!this._isAni) {
                        this._setEnergyTxt(app.formula.numToShowStr(this._currValue));
                    }
                }
            };
            BallPanel.prototype._energyAni = function (preAddNum) {
                if (preAddNum === void 0) { preAddNum = 0; }
                this._currValue += preAddNum;
                if (this._aniList.length > 0) {
                    var addNum = this._aniList.shift();
                    this._aniTarget.value = 0;
                    this._aniTarget.addNum = addNum;
                    this._updateEnergy();
                    Laya.Tween.to(this._aniTarget, { value: addNum, update: this._updateHandler }, addNum < 1000 ? 300 : 1000, null, Laya.Handler.create(this, this._energyAni, [addNum]), 300);
                }
                else {
                    this._isAni = false;
                    this.m_energyAddTxt.text = "";
                }
            };
            BallPanel.prototype._updateEnergy = function () {
                this._setEnergyTxt(app.formula.numToShowStr(this._aniTarget.value + this._currValue));
                if (this._aniTarget.addNum - this._aniTarget.value < 1) {
                    this.m_energyAddTxt.text = "";
                }
                else {
                    this.m_energyAddTxt.text = "+" + app.formula.numToShowStr(this._aniTarget.addNum - this._aniTarget.value);
                }
            };
            BallPanel.prototype._setEnergyTxt = function (str) {
                if (this.m_energyTxt.text != str) {
                    this.m_energyTxt.text = str;
                    if (!this.m_energyAni.playing) {
                        this.m_energyAni.play(null, 1);
                    }
                }
            };
            BallPanel.prototype.addBall = function (ballVo) {
                var ballRes = dataMgr.sys_ballHash.getData(ballVo.kId);
                var moveBall;
                if (ballRes.eType == SeEnumBalleType.XiaoQiu) {
                    moveBall = fairygui.UIPackage.createObject(EnumUIPackage.ball, "MoveBallItem", ball.MoveBallItem);
                }
                else if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
                    moveBall = fairygui.UIPackage.createObject(EnumUIPackage.ball, "MoveBallItem", ball.MagicMoveBall);
                }
                if (!moveBall)
                    return;
                var x = ballVo.x;
                var y = ballVo.y;
                if (!x && !y) {
                    x = Math.random() * (this._phyWidth - ballRes.iRadius * 2) + this._startX;
                    y = Math.random() * (this._phyHeight - ballRes.iRadius * 2) + this._startY;
                }
                moveBall.setData(ballVo);
                Matter.Body.setPosition(moveBall.body, { x: x, y: y });
                Matter.World.add(this.world, moveBall.body);
            };
            BallPanel.prototype.nextChapter = function () {
                if (!this.world)
                    return; //世界没建立，跳过此次重新开始
                this._startChapter(dataMgr.userProxy.userVo.iLevel + 1);
                this._createUnit();
                this.m_magicBallList.refreshVirtualList();
                storageMgr.saveData();
            };
            BallPanel.prototype._startChapter = function (level) {
                var chapterRes = dataMgr.sys_chapter.getData(level.toString());
                if (!chapterRes) {
                    debug.error("关卡数据没了---");
                    return;
                }
                var hash = {};
                var Line_Count = 3;
                var Unit_Width = 100;
                var rangeW = this._phyWidth / Line_Count - Unit_Width;
                var rowCount = Math.ceil(chapterRes.iUnitNum / Line_Count);
                var ranggeH = (this._phyHeight - 80) / rowCount - Unit_Width;
                for (var i = 0; i < chapterRes.iUnitNum; i++) {
                    var x = Math.min(this._startX + Unit_Width / 2 + (Math.random() * 1.2 - 0) * rangeW + (rangeW + Unit_Width) * (i % Line_Count), this._phyWidth - Unit_Width / 2);
                    var y = this._startY + Unit_Width / 2 + (Math.random() * 1.2 - 0) * ranggeH + (ranggeH + Unit_Width) * Math.floor(i / Line_Count);
                    var scoreUnit = {
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
            };
            BallPanel.prototype._initWorld = function () {
                var offset = 300, options = {
                    isStatic: true,
                    restitution: 1,
                    // friction: 0,
                    frictionAir: 0,
                    frictionStatic: 0,
                    unshow: true,
                    collisionFilter: {
                        category: ball.defaultCategory
                    },
                };
                var startX = this._startX;
                var startY = this._startY;
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
                Matter.Events.on(this.engine, "collisionEnd", function (event) {
                    var pairs = event.pairs;
                    // change object colours to show those ending a collision
                    for (var i = 0; i < pairs.length; i++) {
                        var pair = pairs[i];
                        var scoreUnit = null;
                        var moveBall = null;
                        if (pair.bodyA.layaSprite && pair.bodyA.layaSprite["$owner"]) {
                            if (pair.bodyA.layaSprite["$owner"] instanceof ball.ScoreUnit) {
                                scoreUnit = pair.bodyA.layaSprite["$owner"];
                            }
                            if (pair.bodyA.layaSprite["$owner"] instanceof ball.MoveBallItem) {
                                moveBall = pair.bodyA.layaSprite["$owner"];
                                moveBall.collision();
                            }
                        }
                        if (pair.bodyB.layaSprite && pair.bodyB.layaSprite["$owner"]) {
                            if (pair.bodyB.layaSprite["$owner"] instanceof ball.ScoreUnit) {
                                scoreUnit = pair.bodyB.layaSprite["$owner"];
                            }
                            if (pair.bodyB.layaSprite["$owner"] instanceof ball.MoveBallItem) {
                                moveBall = pair.bodyB.layaSprite["$owner"];
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
            };
            BallPanel.prototype._createUnit = function () {
                var _this = this;
                ball.ScoreUnit.hash = {};
                var hash = dataMgr.unitProxy.getData();
                if (!this._clickAniHandler) {
                    this._clickAniHandler = Laya.Handler.create(this, function () {
                        _this.m_clickAni.visible = false;
                    });
                }
                ;
                for (var id in hash) {
                    var scoreUnitVo = hash[id];
                    if (scoreUnitVo.iHp <= 0)
                        continue;
                    var scoreUnit = fairygui.UIPackage.createObject(EnumUIPackage.ball, "ScoreUnit", ball.ScoreUnit);
                    scoreUnit.setData(scoreUnitVo);
                    ball.ScoreUnit.hash[scoreUnitVo.id] = scoreUnit;
                    Matter.Body.setPosition(scoreUnit.body, { x: scoreUnitVo.x, y: scoreUnitVo.y });
                    Matter.World.add(this.world, scoreUnit.body);
                    scoreUnit.on("dead", this, function (_scoteUnit) {
                        var deadAni = fairygui.UIPackage.createObject(EnumUIPackage.ball, "DeadAni").asMovieClip;
                        _this.addChild(deadAni);
                        deadAni.setPivot(0.5, 0.5, true);
                        deadAni.x = _scoteUnit.x;
                        deadAni.y = _scoteUnit.y;
                        deadAni.setPlaySettings(0, -1, 1, deadAni.movieClip.frameCount, Laya.Handler.create(_this, function (ani) {
                            ani.dispose();
                        }, [deadAni]));
                        Matter.World.remove(_this.world, _scoteUnit.body);
                    }, [scoreUnit]);
                    scoreUnit.on("playAni", this, function (x, y) {
                        _this.m_clickAni.visible = true;
                        _this.m_clickAni.x = x;
                        _this.m_clickAni.y = y;
                        _this.m_clickAni.setPlaySettings(0, -1, 1, _this.m_clickAni.movieClip.frameCount, _this._clickAniHandler);
                    }, [scoreUnitVo.x, scoreUnitVo.y]);
                }
            };
            BallPanel.prototype._initBall = function () {
                var ballHash = dataMgr.ballProxy.getData();
                for (var key in ballHash) {
                    this.addBall(ballHash[key]);
                }
            };
            BallPanel.prototype._initShop = function () {
                var hash = dataMgr.sys_ballHash.getAllRes();
                var magicIdList = [];
                var ballIdList = [];
                for (var key in hash) {
                    var ballRes = hash[key];
                    if (ballRes.eType == SeEnumBalleType.MoFaQiu) {
                        magicIdList.push(ballRes.kId);
                    }
                    else {
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
                var shopIdList = [];
                var rechargeHash = dataMgr.sys_recharge.getAllRes();
                for (var key in rechargeHash) {
                    var rechargeRes = rechargeHash[key];
                    shopIdList.push({ kId: rechargeRes.kId, type: ball.EnumChargeItemType.Recharge });
                }
                var skillHash = dataMgr.sys_skill.getAllRes();
                for (var key in skillHash) {
                    var skillRes = skillHash[key];
                    if (skillRes.eTab == SeEnumSkilleTab.JiNen) {
                        skillIdList.push(skillRes.kId);
                    }
                    else if (skillRes.eTab == SeEnumSkilleTab.ShangCheng) {
                        shopIdList.push({ kId: skillRes.kId, type: ball.EnumChargeItemType.Cost });
                    }
                }
                this.m_skillList.setVirtual();
                this.m_skillList.itemRenderer = Laya.Handler.create(this, this._renderList, [skillIdList], false);
                this.m_shopList.setVirtual();
                this.m_shopList.itemRenderer = Laya.Handler.create(this, this._renderList, [shopIdList], false);
                this.m_skillList.numItems = skillIdList.length;
                this.m_shopList.numItems = shopIdList.length;
            };
            BallPanel.prototype._renderList = function (idList, index, cell) {
                var ballId = idList[index];
                cell.setData(ballId);
            };
            BallPanel.prototype.onResize = function () {
                // 设置鼠标的坐标缩放
                // Laya.stage.clientScaleX代表舞台缩放
                // Laya.stage._canvasTransform代表画布缩放
                // Matter.Mouse.setScale(this.mouseConstraint.mouse, { x: 1 / (Laya.stage.clientScaleX * Laya.stage._canvasTransform.a), y: 1 / (Laya.stage.clientScaleY * Laya.stage._canvasTransform.d) });
            };
            return BallPanel;
        }(ui.ball.UI_GameWnd));
    })(ball = app.ball || (app.ball = {}));
})(app || (app = {}));
//# sourceMappingURL=IdleBall.js.map