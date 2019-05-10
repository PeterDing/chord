'use strict';

import { encryptAES, md5 } from 'chord/base/node/crypto';


export function encryptParams(params: object): string {
    const KEY = Buffer.from("DBEECF8C50FD160E");
    const IV = Buffer.from("1231021386755796");

    let buf = Object.keys(params).sort().map(k => k + '=' + encodeURIComponent(params[k])).join('&');
    let enc = encryptAES(buf, KEY, IV, 'utf8', 'base64', 'cbc');
    return enc;
}


export function encryptPass(params: object): any {
    let tm = Math.floor(Date.now() / 1000);
    let e = md5("baidu_taihe_music_secret_key" + tm).slice(8, 24);
    let KEY = Buffer.from(e);
    let IV = Buffer.from(e);

    let buf = Object.keys(params).sort().map(k => k + '=' + encodeURIComponent(params[k])).join('&');
    let param = encryptAES(buf, KEY, IV, 'utf8', 'base64', 'cbc');
    let sign = md5("baidu_taihe_music" + param + tm);
    return {
        timestamp: tm,
        param,
        sign
    };
}
