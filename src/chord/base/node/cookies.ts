'use strict';

import { Cookie, CookieJar } from 'tough-cookie';
export { Cookie, CookieJar };


export function makeCookieJar(): CookieJar {
    return new CookieJar();
}

export function makeCookies(rawCookies: Array<string>, jar?: CookieJar): Array<Cookie> {
    let cookies = rawCookies.map(rawCookie => makeCookieFromString(rawCookie));
    return cookies;
}

export function makeCookie(key: string, value: string, domain?: string): Cookie {
    return new Cookie({ key, value, domain });
}

export function makeCookieFromString(rawCookie: string): Cookie {
    return Cookie.parse(rawCookie);
}

export function dumpCookies(jar: CookieJar): string {
    return jar.toJSON().cookies.map(c => c.key + '=' + escape(c.value) + ';').join(' ');
}
