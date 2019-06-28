'use strict';

const OneK = 1000;

export function literal_number(num: number): string {
    if (num < OneK) {
        return num.toString();
    }
    num /= OneK;
    if (num < OneK) {
        return num.toFixed(1) + 'K';
    }
    num /= OneK;
    if (num < OneK) {
        return num.toFixed(1) + 'M';
    }
    num /= OneK;
    return num.toFixed(1) + 'G';
}


export function literal_to_number(literal: string): number {
    if (!literal) return 0;

    if (typeof literal == 'number') return literal;

    let num = Number.parseFloat(literal);
    literal = literal.toLowerCase();
    let c = literal.slice(-1);
    if ('kmg'.includes(c)) {
        switch (c) {
            case 'k':
                num *= OneK;
                break;
            case 'm':
                num *= OneK * OneK;
                break;
            case 'm':
                num *= OneK * OneK * OneK;
                break;
        }
    }
    return num;
}
