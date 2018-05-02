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
        var ScoreUnit = /** @class */ (function (_super) {
            __extends(ScoreUnit, _super);
            function ScoreUnit() {
                return _super.call(this) || this;
            }
            ScoreUnit.prototype.constructFromResource = function () {
                _super.prototype.constructFromResource.call(this);
                this.body = Matter.Bodies.circle(0, 0, this.width / 2, {
                    restitution: 1,
                    // friction: 0,
                    frictionAir: 0,
                    frictionStatic: 0,
                    slop: 0,
                    isStatic: true,
                    layaSprite: this.displayObject,
                    collisionFilter: {
                        category: ball.UnitScoreCategory
                    },
                });
                this.onClick(this, this._clickSelf);
                this.on(Laya.Event.MOUSE_DOWN, this, this._mouseDown);
                this.on(Laya.Event.MOUSE_UP, this, this._mouseUp);
                this.on(Laya.Event.MOUSE_OUT, this, this._mouseUp);
            };
            ScoreUnit.prototype.setData = function (scoreUnitVo) {
                this._unitVo = scoreUnitVo;
                this.m_scoreTxt.text = app.formula.numToShowStr(this._unitVo.iHp);
                this.m_iconImg.url = fairygui.UIPackage.getItemURL(EnumUIPackage.ball, scoreUnitVo.kSkin);
            };
            ScoreUnit.prototype.getData = function () {
                return this._unitVo;
            };
            ScoreUnit.prototype.hit = function (damage) {
                if (!this._unitVo)
                    return;
                if (!dataMgr.unitProxy.damageUnit(this._unitVo.id, damage))
                    return 0;
                this.m_scoreTxt.text = app.formula.numToShowStr(this._unitVo.iHp);
                if (this._unitVo.iHp == 0) {
                    this._onDead();
                }
                else {
                    this.m_hitAni.play(null, 1);
                }
                return damage;
            };
            ScoreUnit.prototype._mouseDown = function () {
                Laya.timer.once(300, this, this._loopClick);
            };
            ScoreUnit.prototype._mouseUp = function () {
                Laya.timer.clear(this, this._loopClick);
                Laya.timer.clear(this, this._clickSelf);
            };
            ScoreUnit.prototype._loopClick = function () {
                Laya.timer.loop(9 / 30 * 1000, this, this._clickSelf);
            };
            ScoreUnit.prototype._clickSelf = function () {
                var clickBall = dataMgr.ballProxy.clickBall;
                if (!clickBall)
                    return;
                var ballRes = dataMgr.sys_ballHash.getData(clickBall.kId);
                var defaultAttack = app.formula.getBallAttack(clickBall.kId, clickBall.iLevel);
                var attack = defaultAttack * Math.max(1, dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.DianJiJiaCheng));
                this.hit(attack);
                this.displayObject.event("playAni");
            };
            ScoreUnit.prototype._onDead = function () {
                debug.log(this._unitVo.id + "被删除");
                delete ScoreUnit.hash[this._unitVo.id];
                this._unitVo = null;
                this.displayObject.event("dead");
                this.dispose();
            };
            ScoreUnit.hash = {};
            return ScoreUnit;
        }(ui.ball.UI_ScoreUnit));
        ball.ScoreUnit = ScoreUnit;
        var MoveBallItem = /** @class */ (function (_super) {
            __extends(MoveBallItem, _super);
            function MoveBallItem() {
                var _this = _super.call(this) || this;
                _this.normalSpeed = 0;
                return _this;
            }
            MoveBallItem.prototype.constructFromResource = function () {
                _super.prototype.constructFromResource.call(this);
            };
            MoveBallItem.prototype.setData = function (d) {
                this._ballVo = d;
                var ballRes = dataMgr.sys_ballHash.getData(this._ballVo.kId);
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
                        mask: ball.defaultCategory | ball.UnitScoreCategory
                    },
                });
                if (d.velocity) {
                    Matter.Body.setVelocity(this.body, d.velocity);
                }
                else {
                    var angle = Math.random() * 360;
                    Matter.Body.setVelocity(this.body, { x: Math.cos(angle / Math.PI) * ballRes.iSpeed, y: Math.sin(angle / Math.PI) * ballRes.iSpeed });
                }
                this.normalSpeed = ballRes.iSpeed;
            };
            MoveBallItem.prototype.collision = function () {
                var nowVer = this.body.velocity;
                var scale = this.body.speed != 0 ? this.normalSpeed * Math.max(dataMgr.skillProxy.getBuffValue(SeEnumSkilleType.ZhuangJiJiaCheng), 1) / this.body.speed : 0;
                if (Math.abs(nowVer.x) < 0.1) {
                    nowVer.x = nowVer.x > 0 ? 1 : -1;
                }
                if (Math.abs(nowVer.y) < 0.1) {
                    nowVer.y = nowVer.y > 0 ? 1 : -1;
                }
                nowVer.x *= scale;
                nowVer.y *= scale;
                Matter.Body.setVelocity(this.body, nowVer);
            };
            MoveBallItem.prototype.hitUnit = function (unit) {
                var attack = app.formula.getBallRealAttack(this._ballRes.kId);
                unit.hit(attack);
            };
            MoveBallItem.prototype.dispose = function () {
                this._ballRes = null;
                this._ballVo = null;
                _super.prototype.dispose.call(this);
            };
            return MoveBallItem;
        }(ui.ball.UI_MoveBallItem));
        ball.MoveBallItem = MoveBallItem;
        var MagicMoveBall = /** @class */ (function (_super) {
            __extends(MagicMoveBall, _super);
            function MagicMoveBall() {
                return _super !== null && _super.apply(this, arguments) || this;
            }
            MagicMoveBall.prototype.hitUnit = function (unit) {
                var attack = app.formula.getBallRealAttack(this._ballRes.kId);
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
            };
            return MagicMoveBall;
        }(MoveBallItem));
        ball.MagicMoveBall = MagicMoveBall;
    })(ball = app.ball || (app.ball = {}));
})(app || (app = {}));
//# sourceMappingURL=PhyCls.js.map