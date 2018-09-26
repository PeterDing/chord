'use strict';

import * as crypto from 'crypto';

import bigInt = require('big-integer');

import { ASCII_LETTER_DIGIT } from 'chord/base/common/constants';
import { getRandomSample } from 'chord/base/node/random';


const AES_MOD = 'AES-128-CBC';
const AES_CBC_INIT_VECTOR = '0102030405060708';
const NETEASE_INIT_AES_INPUT = '0CoJUm6Qyw8W8jud';
const RSA_MOD = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const RSA_PUB_KEY = '010001';

interface INeteaseEncryptParams {
    params: string;
    encSecKey: string;
}

export function toAES(input: string, key: string): string {
    let cipher = crypto.createCipheriv(
        AES_MOD,
        Buffer.from(key, 'binary'),
        Buffer.from(AES_CBC_INIT_VECTOR, 'binary')
    );
    return cipher.update(input, 'utf8', 'base64') + cipher.final('base64');
}

export function toRSA(input: string, pubKey: string, mod: string): string {
    let reverseInput = Array.from(input).reverse().join('');
    let bigInput = bigInt(Buffer.from(reverseInput).toString('hex'), 16);
    let bigPubKey = bigInt(RSA_PUB_KEY, 16);
    let bigMod = bigInt(mod, 16);
    let result = bigInput.modPow(bigPubKey, bigMod);
    return result.toString(16).padStart(256);
}

export function encrypt(obj: any): INeteaseEncryptParams {
    let str = JSON.stringify(obj);
    let secKey = getRandomSample(Array.from(ASCII_LETTER_DIGIT), 16).join('');
    let encStr = toAES(toAES(str, NETEASE_INIT_AES_INPUT), secKey);
    let encSecKey = toRSA(secKey, RSA_PUB_KEY, RSA_MOD);
    return { params: encStr, encSecKey };
}

export function encryptLinux(obj: any): any {
    let input = JSON.stringify(obj);
    let cipher = crypto.createCipheriv(
        'AES-128-ECB',
        Buffer.from('7246674226682325323F5E6544673A51', 'hex'),
        ''
    );
    let r = cipher.update(input, 'utf8', 'base64') + cipher.final('base64');
    // r = '045913148E5D4B33D53D16D283F3C3445BCA8A188E1BE398DB4C9A3FC117E19CFD5383E018356CEB3F0AE94452892D4ED77FA1307DCE569066821F538183EC9A11BA253DED5B5D7883C32F6A60F50658C227FE4CC1F2076243736E2A36B635D0E8864A120B597EE567CEB5693CCE750C7EF54E238436BDE0CA8F376126AA1104';
    r = Buffer.from(r, 'base64').toString('hex').toUpperCase();
    return { 'eparams': r };
}
