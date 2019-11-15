'use strict';

import * as crypto from 'crypto';
import * as cryptojs from 'crypto-js';

import { encryptRSA, md5 } from 'chord/base/node/crypto';

const PUBLIC_KEY = "-----BEGIN PUBLIC KEY-----\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC8asrfSaoOb4je+DSmKdriQJKW\nVJ2oDZrs3wi5W67m3LwTB9QVR+cE3XWU21Nx+YBxS0yun8wDcjgQvYt625ZCcgin\n2ro/eOkNyUOTBIbuj9CvMnhUYiR61lC1f1IGbrSYYimqBVSjpifVufxtx/I3exRe\nZosTByYp4Xwpb1+WAQIDAQAB\n-----END PUBLIC KEY-----";


export function encrypt(buf: string): any {
    let key = md5((1e3 * Math.random()).toString()).toString();

    let secKey = encryptRSA(
        key,
        { key: PUBLIC_KEY, padding: crypto.constants.RSA_PKCS1_PADDING },
        'utf8',
        'base64'
    );

    let encBuf = cryptojs.AES.encrypt(buf, key).toString();
    return { secKey, encBuf };
}
