/*
* name;
*/
module framework.net{
    export class GeSocket extends Laya.EventDispatcher {
        private _socket: SocketIOClient.Socket;
        private _url: string;
        private _isConnected: boolean = false;
        private _session: string = "";

        private zlib_open = false;

        constructor(url: string) {
            super();
            if (url) {
                this.connect(url);
            }
        }

        private Utf8ArrayToStr(array) {
            var out, i, len, c;
            var char2, char3;

            out = "";
            len = array.length;
            i = 0;
            while (i < len) {
                c = array[i++];
                switch (c >> 4) {
                    case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                        // 0xxxxxxx
                        out += String.fromCharCode(c);
                        break;
                    case 12: case 13:
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
        }

        public connect(url: string) {
            if (this._isConnected) {
                this.debug("已连接");
                return;
            }
            this._url = url;
            var config: SocketIOClient.ConnectOpts = {
                timeout: 5000,
                reconnection: false,
            };
            config.forceNew = true;
            config.transports = ['websocket'];
            this._socket = io.connect(url, config);
            // this.mySocket = io.connect('http://127.0.0.1:6005',{'force new connection': true});
            this._socket.on('connect', this._connected.bind(this));
            this._socket.on("session", this._onSession.bind(this));
            this._socket.on('disconnect', ((msg) => {
                // window.location.reload(true);
                this._isConnected = false;
                this.debug(msg);
                this.event(SOCKET_EVENT.DISCONNECT, msg);
            }).bind(this));
            this._socket.on('zlib', (open) => {
                this.zlib_open = open;
            });
            this._socket.on("data", this._procCmd.bind(this));
            this._socket.on("zlibdata", (data) => {
                try {
                    var ss = new Zlib.Inflate(new Uint8Array(data));
                    data = JSON.parse(this.Utf8ArrayToStr([].slice.call(ss.decompress())));
                    this._procCmd(data);
                }
                catch (e) {
                    this.debug(e.toString());
                }
            })
            this._socket.on('error', ((err) => {
                this.event(SOCKET_EVENT.ERROR, err);
                this.debug(err);
            }).bind(this));
            this._socket.on('connect_error', ((err) => {
                this.event(SOCKET_EVENT.ERROR, err);
                this.debug(err);
            }).bind(this));
        }

        public send(data: any) {
            this.debug("发送消息" + JSON.stringify(data) + '  netstate:' + this._isConnected);
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
        }

        private _connected(): void {
            this.debug("connect success");
            this._isConnected = true;
            this.event(SOCKET_EVENT.CONNECT);
        }

        private _onSession(session) {
            if (this._session == "") {
                this._session = session;
            }
            this._socket.emit("session", this._session);
        }

        public disconnect() {
            // this._socket.disconnect();
            this._socket.connect();
        }

        //处理服务器返回消息
        private _procCmd(data: any): void {
            var parseJson = JSON.stringify(data);
            this.debug("收到消息:" + parseJson);
            this.event(SOCKET_EVENT.DATA, data);
        }

        public debug(...arg) {
            native.DebugTool.log(arg.shift(),...arg);
        }

        public get transport():string{
            var path="io.engine.transport.query.transport".split(".");
            var result:any=this._socket;
            while(result && path.length>0){
                result=result[path.shift()];
            }
            return <string>result;
        }
    }

    const SOCKET_EVENT = {
        CONNECT: "connect",
        DISCONNECT: "disconnect",
        DATA: "data",
        ERROR: "error",
    }
}