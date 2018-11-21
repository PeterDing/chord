'use strict';

import { Cookie } from 'tough-cookie';
import * as rp from 'request-promise';
import { CookieJar } from 'request';


export type Cookie = Cookie;
export type CookieJar = CookieJar;


export function makeCookieJar(): CookieJar {
    return rp.jar();
}

export function makeCookies(rawCookies: Array<string>, jar?: CookieJar): Array<Cookie> {
    let cookies = [];
    rawCookies.forEach(r => {
        let cookie = Cookie.parse(r);
        cookies.push(cookie);
    });
    return cookies;
}

export function makeCookie(key: string, value: string, domain?: string): Cookie {
    return Cookie.fromJSON({ key, value, domain });
}

export function makeCookieFrom(input: string): Cookie {
    return Cookie.parse(input);
}
