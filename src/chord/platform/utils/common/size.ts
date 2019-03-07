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
