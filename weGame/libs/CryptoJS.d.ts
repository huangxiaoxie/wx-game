declare module CryptoJS {
    function HmacSHA256(message:string,pwd:string):any;
}
declare module CryptoJS.enc.Base64{
    function stringify(hash:any):string;
    function parse(str:string):any;
}

declare module CryptoJS.enc{
    var Utf8:any;
}

declare module CryptoJS.util{
    function base64ToBytes(any):any;
}

declare module CryptoJS.mode{
    class CBC {
        constructor(d:any);
    }
}

declare module CryptoJS.AES{
    function decrypt(...arg):any;
}

declare module CryptoJS.pad{
    var Pkcs7:any;
}
