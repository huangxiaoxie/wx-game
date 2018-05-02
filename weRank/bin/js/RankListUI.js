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
/*
* name;
*/
var RankListUI = /** @class */ (function (_super) {
    __extends(RankListUI, _super);
    function RankListUI() {
        var _this = _super.call(this) || this;
        _this._cache = [];
        _this.list.vScrollBarSkin = "";
        _this.list.renderHandler = Laya.Handler.create(_this, _this._renderList, null, false);
        return _this;
    }
    RankListUI.prototype.setData = function (d) {
        var _this = this;
        var key = d.key;
        var valueMsg = d.valueMsg || "";
        if (this._cache[key]) {
            this._updateList(this._cache[key], valueMsg, key);
        }
        else {
            var _self = this;
            wx.getFriendCloudStorage({ keyList: [key, "vip"], success: function (res) {
                    console.log(res);
                    _this._cache[key] = res.data;
                    _this._updateList(res.data, valueMsg, key);
                } });
        }
    };
    RankListUI.prototype.hide = function () {
        this.list = null;
        this._cache = [];
    };
    RankListUI.prototype._renderList = function (cell, index) {
        var avatarCon = cell.getChildByName("avatarIcon");
        var numTxt = cell.getChildByName("numTxt");
        var vipImg = cell.getChildByName("vipImg");
        var nameTxt = cell.getChildByName("nameTxt");
        var valueTxt = cell.getChildByName("valueTxt");
        var data = cell.dataSource;
        avatarCon.skin = data.avatar;
        numTxt.dataSource = index + 1;
        vipImg.visible = data.isVip;
        nameTxt.text = data.name;
        valueTxt.text = data.valueMsg;
    };
    RankListUI.prototype._updateList = function (list, valueMsg, key) {
        this.list.array = [];
        var rankList = [];
        for (var i = 0; list && i < list.length; i++) {
            var keyHash = {};
            for (var j = 0; j < list[i].KVDataList.length; j++) {
                keyHash[list[i].KVDataList[j].key] = list[i].KVDataList[j].value;
            }
            var value = Number(keyHash[key]) || 0;
            console.log(list[i].nickname, value, keyHash[key]);
            if (value <= 0)
                continue;
            rankList.push({
                value: value,
                isVip: !!keyHash["vip"],
                avatar: list[i].avatarUrl,
                name: list[i].nickname,
                valueMsg: valueMsg.replace(/\{value\}/g, this.numToShowStr(value)),
            });
        }
        rankList.sort(function (a, b) {
            if (a.value > b.value)
                return -1;
            if (a.value < b.value)
                return 1;
            return 0;
        });
        this.list.array = rankList;
    };
    RankListUI.prototype.numToShowStr = function (num) {
        var StartCode = 65; //A
        var numStr = Math.round(num).toString();
        var numLen = numStr.length;
        if (numStr.indexOf("e+") != -1) {
            var arr = numStr.split("e+");
            numLen = parseInt(arr[1]) + 1;
            numStr = arr[0];
        }
        if (numLen <= 3)
            return numStr;
        var code = Math.floor(numLen / 3);
        var moreLen = numLen % 3;
        if (moreLen == 0) {
            code -= 1;
        }
        var limitNum = num / Math.pow(1000, code);
        var fixLen = moreLen == 0 ? 1 : Math.pow(10, 3 - moreLen);
        limitNum = Math.floor(limitNum * fixLen) / fixLen;
        return limitNum + String.fromCharCode(code + StartCode - 1);
    };
    return RankListUI;
}(ui.RankListUI));
var RankTxt = /** @class */ (function (_super) {
    __extends(RankTxt, _super);
    function RankTxt() {
        var _this = _super.call(this) || this;
        _this._numList = [];
        while (_this.numChildren > 0) {
            _this._numList.push(_this.removeChildAt(0));
        }
        return _this;
    }
    Object.defineProperty(RankTxt.prototype, "dataSource", {
        get: function () {
            return this._dataSource;
        },
        set: function (val) {
            this._dataSource = val;
            var skinList = [];
            if (val == 1) {
                skinList.push("1-1");
            }
            else if (val == 2) {
                skinList.push("2-1");
            }
            else if (val == 3) {
                skinList.push("3-1");
            }
            else {
                skinList = val.toString().split("");
            }
            var totalW = 0;
            for (var i = 0; i < skinList.length; i++) {
                var skin = skinList[i];
                var img = (i < this.numChildren ? this.getChildAt(i) : this._createImg());
                img.skin = "comp/" + skin + ".png";
                if (skin == "1" || skin == "1-1") {
                    img.width = 21;
                }
                else {
                    img.width = 28;
                }
                totalW += img.width;
                if (!img.parent) {
                    this.addChild(img);
                }
            }
            var startX = (this.width - totalW) / 2;
            for (var i = 0; i < this.numChildren; i++) {
                var img = this.getChildAt(i);
                if (!skin[i]) {
                    img.removeSelf();
                    this._numList.push(img);
                    i--;
                }
                else {
                    img.x = startX + img.width;
                    startX += img.width;
                }
            }
        },
        enumerable: true,
        configurable: true
    });
    RankTxt.prototype._createImg = function () {
        if (this._numList.length > 0) {
            return this._numList.shift();
        }
        return new Laya.Image();
    };
    return RankTxt;
}(Laya.Sprite));
//# sourceMappingURL=RankListUI.js.map