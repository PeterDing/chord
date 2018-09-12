'use strict';

import { Cookie } from 'tough-cookie';
import * as rp from 'request-promise';
import { CookieJar } from 'request';


export type CookieJar = CookieJar;

export function makeCookieJar(rawCookies: Array<string>): CookieJar {
    let cookieJar = rp.jar();
    rawCookies.forEach(r => {
        let cookie = Cookie.parse(r);
        let domain = cookie.domain;
        cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
    });
    return cookieJar;
}
