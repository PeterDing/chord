'use strict';

import * as crypto from 'crypto';


export function md5(data: string | Buffer): string {
    return crypto.createHash('md5').update(data).digest('hex');
}


export function encodeBase64(data: string): string {
    if (!data) return data;
    return Buffer.from(data).toString('base64');
}


export function decodeBase64(data: string): string {
    if (!data) return data;
    return Buffer.from(data, 'base64').toString();
}
