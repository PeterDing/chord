'use strict';

import * as crypto from 'crypto';


export function md5(data: string | Buffer): string {
    return crypto.createHash('md5').update(data).digest('hex');
}


export function sha256(
    data: string,
    inputEncoding: crypto.Utf8AsciiLatin1Encoding = 'utf8',
    outputEncoding: crypto.HexBase64Latin1Encoding = 'hex',
): string {
    return crypto.createHash('sha256').update(data, inputEncoding).digest(outputEncoding);
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
    keySize?: number,
): string {
    let algorithm = 'aes-' + (keySize ? keySize : key.length * 8) + '-' + mode;

    let cipher = crypto.createCipheriv(algorithm, key, iv);

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
    keySize?: number,
): string {
    let algorithm = 'aes-' + (keySize ? keySize : key.length * 8) + '-' + mode;

    let decipher = crypto.createDecipheriv(algorithm, key, iv);

    let decrypted = decipher.update(buf, inputEncoding as any, outputEncoding as any);
    decrypted += decipher.final(outputEncoding);
    return decrypted;
}


// type BufferEncoding = "ascii" | "utf8" | "utf-8" | "utf16le" | "ucs2" | "ucs-2" | "base64" | "latin1" | "binary" | "hex";

export function encryptRSA(
    buf: string,
    publicKey: string | any,
    inputEncoding?: BufferEncoding,
    outputEncoding?: string,
): string {
    let _buf = Buffer.from(buf, inputEncoding);
    let encrypted = crypto.publicEncrypt(publicKey, _buf);
    return encrypted.toString(outputEncoding);
}

export function decryptRSA(
    buf: string,
    publicKey: string,
    inputEncoding?: BufferEncoding,
    outputEncoding?: string,
): string {
    let _buf = Buffer.from(buf, inputEncoding);
    let decrypted = crypto.publicDecrypt(publicKey, _buf);
    return decrypted.toString(outputEncoding);
}
