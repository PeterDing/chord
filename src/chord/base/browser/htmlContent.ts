'use strict';

import * as cheerio from 'cheerio';


export function decodeHtml(html: string): string {
    if (!html) { return null; }
    let result = cheerio.parseHTML(html)[0];
    return (<any>result).data;
}
