'use strict';


export function decrypt(enStr: string): string {
    let str = enStr.slice(1);
    const len = str.length;
    const rows = parseInt(enStr[0]);

    const cols = Math.floor(len / rows);
    const rowsEx = len % rows;

    let mat = [];
    for (let r = 0; r < rows; r++) {
        let length = r < rowsEx ? cols + 1 : cols;
        mat.push(str.slice(0, length));
        str = str.slice(length);
    }

    str = '';
    for (let i = 0; i < len; i++) {
        str += mat[i % rows][Math.floor(i / rows)];
    }

    str = unescape(str).replace(/\^/g, '0');

    if (str.startsWith('//')) {
        str = 'http:' + str;
    }

    return str;
}
