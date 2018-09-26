'use strict';

import { ASCII_LETTER_DIGIT } from 'chord/base/common/constants';
import { getRandomSample } from 'chord/base/node/random';

import { Cookie, makeCookie } from 'chord/base/node/cookies';


const DOMAIN = 'music.163.com';

export function initiateCookies(): Array<Cookie> {
    let date = Date.now().toString();
    let jsessionId = getRandomSample(Array.from(ASCII_LETTER_DIGIT + '/\\+'), 176).join('') + date;
    let nuid = getRandomSample(Array.from(ASCII_LETTER_DIGIT), 32).join('');

    let cookies = [
        ['JSESSIONID-WYYY', jsessionId],
        ['_iuqxldmzr_', '32'],
        ['_ntes_nnid', nuid + ',' + date],
        ['_ntes_nuid', nuid],
    ].map(item => makeCookie(item[0], item[1], DOMAIN));

    return cookies;
}
