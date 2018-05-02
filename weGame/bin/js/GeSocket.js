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
var GeSocket = /** @class */ (function (_super) {
    __extends(GeSocket, _super);
    function GeSocket(url) {
        var _this = _super.call(this) || this;
        _this._isConnected = false;
        _this._session = "";
        _this.zlib_open = false;
        if (url) {
            _this.connect(url);
        }
        return _this;
    }
    GeSocket.prototype.Utf8ArrayToStr = function (array) {
        var out, i, len, c;
        var char2, char3;
        out = "";
        len = array.length;
        i = 0;
        while (i < len) {
            c = array[i++];
            switch (c >> 4) {
                case 0:
                case 1:
                case 2:
                case 3:
                case 4:
                case 5:
                case 6:
                case 7:
                    // 0xxxxxxx
                    out += String.fromCharCode(c);
                    break;
                case 12:
                case 13:
                    // 110x xxxx   10xx xxxx
                    char2 = array[i++];
                    out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                    break;
                case 14:
                    // 1110 xxxx  10xx xxxx  10xx xxxx
                    char2 = array[i++];
                    char3 = array[i++];
                    out += String.fromCharCode(((c & 0x0F) << 12) |
                        ((char2 & 0x3F) << 6) |
                        ((char3 & 0x3F) << 0));
                    break;
            }
        }
        return out;
    };
    GeSocket.prototype.connect = function (url) {
        var _this = this;
        if (this._isConnected) {
            this.debug("已连接");
            return;
        }
        this._url = url;
        var config = {
            timeout: 5000,
            reconnection: false,
        };
        config.forceNew = true;
        config.transports = ['websocket'];
        this._socket = io.connect(url, config);
        // this.mySocket = io.connect('http://127.0.0.1:6005',{'force new connection': true});
        this._socket.on('connect', this._connected.bind(this));
        this._socket.on("session", this._onSession.bind(this));
        this._socket.on('disconnect', (function (msg) {
            // window.location.reload(true);
            _this._isConnected = false;
            gNative.log(msg);
            _this.event(SOCKET_EVENT.DISCONNECT, msg);
        }).bind(this));
        this._socket.on('zlib', function (open) {
            _this.zlib_open = open;
        });
        this._socket.on("data", this._procCmd.bind(this));
        this._socket.on("zlibdata", function (data) {
            try {
                var ss = new Zlib.Inflate(new Uint8Array(data));
                data = JSON.parse(_this.Utf8ArrayToStr([].slice.call(ss.decompress())));
                _this._procCmd(data);
            }
            catch (e) {
                gNative.log(e.toString());
            }
        });
        this._socket.on('error', (function (err) {
            _this.event(SOCKET_EVENT.ERROR, err);
            gNative.log(err);
        }).bind(this));
        this._socket.on('connect_error', (function (err) {
            _this.event(SOCKET_EVENT.ERROR, err);
            gNative.log(err);
        }).bind(this));
    };
    GeSocket.prototype.send = function (data) {
        gNative.log("发送消息" + JSON.stringify(data) + '  netstate:' + this._isConnected);
        if (this.zlib_open) {
            var msg = JSON.stringify(data);
            if (msg.length > 512) {
                try {
                    var ss = new Zlib.Deflate(msg);
                    this._socket.emit('zlibdata', ss.compress());
                    return;
                }
                catch (e) {
                }
            }
        }
        this._socket.emit('data', data);
    };
    GeSocket.prototype._connected = function () {
        gNative.log("connect success");
        this._isConnected = true;
        this.event(SOCKET_EVENT.CONNECT);
    };
    GeSocket.prototype._onSession = function (session) {
        if (this._session == "") {
            this._session = session;
        }
        this._socket.emit("session", this._session);
    };
    GeSocket.prototype.disconnect = function () {
        // this._socket.disconnect();
        this._socket.connect();
    };
    //处理服务器返回消息
    GeSocket.prototype._procCmd = function (data) {
        var parseJson = JSON.stringify(data);
        gNative.log("收到消息:" + parseJson);
        this.event(SOCKET_EVENT.DATA, data);
    };
    GeSocket.prototype.debug = function () {
        var arg = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            arg[_i] = arguments[_i];
        }
        console.log.apply(console, [arg.shift()].concat(arg));
    };
    Object.defineProperty(GeSocket.prototype, "transport", {
        get: function () {
            var path = "io.engine.transport.query.transport".split(".");
            var result = this._socket;
            while (result && path.length > 0) {
                result = result[path.shift()];
            }
            return result;
        },
        enumerable: true,
        configurable: true
    });
    return GeSocket;
}(Laya.EventDispatcher));
var SOCKET_EVENT = {
    CONNECT: "connect",
    DISCONNECT: "disconnect",
    DATA: "data",
    ERROR: "error",
};
//# sourceMappingURL=GeSocket.js.map