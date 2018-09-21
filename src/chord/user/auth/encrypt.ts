'use strict';


import { md5 } from 'chord/base/node/crypto';


const SALT = '--chord--@@--chord--';


export function encryptPassword(password: string): string {
    return md5(password + SALT);
}
