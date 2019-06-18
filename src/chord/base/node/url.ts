'use strict';

import * as url from 'url';
import * as querystring from 'querystring';


type URL = url.URL;


export function getAbsolutUrl(input: string, base?: string | URL): string {
    if (!input) return input;
    if (!base) {
        if (input.startsWith('//')) {
            return 'http:' + input;
        }
        return input;
    } else {
        return new url.URL(input, base).href;
    }
}


export function querystringify(input: any): string {
    return querystring.stringify(input);
}


export function getHost(input: string): string {
    return url.parse(input).host;
}
