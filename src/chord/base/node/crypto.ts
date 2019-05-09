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


export function encryptAES(
    buf: string,
    key: Buffer,
    iv: Buffer,
    inputEncoding?: string,
    outputEncoding?: string,
    mode: string = 'cbc',
): string {
    let algorithm = 'aes-' + key.length * 8 + '-' + mode;

    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted = cipher.update(buf, inputEncoding as any, outputEncoding as any);
    encrypted += cipher.final(outputEncoding);

    return encrypted;
}


export function decryptAES(
    buf: string,
    key: Buffer,
    iv: Buffer,
    inputEncoding?: string,
    outputEncoding?: string,
    mode: string = 'cbc',
): string {
    let algorithm = 'aes-' + key.length * 8 + '-' + mode;

    const decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(buf, inputEncoding as any, outputEncoding as any);
    decrypted += decipher.final(outputEncoding);
    return decrypted;
}

