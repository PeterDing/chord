'use strict';


export function getHumanDuration(millisecond: number): string {
    let duration = Math.floor(millisecond / 1000);
    let min = Math.floor(duration / 60);
    let sec = duration % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`
}


export function getDateYear(millisecond: number): number {
    return new Date(millisecond).getFullYear();
}


export function sleep(millisecond: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millisecond));
}


/**
 * Parse a time string to millisecond
 */
export function parseToMillisecond(info: string): number {
    let c = Array.from(info).filter(i => i == ':').length;
    let tm;
    switch (c) {
        case 0:
            tm = `00:00:${info}`;
            break;
        case 1:
            tm = `00:${info}`;
            break;
        case 2:
            tm = info;
            break;
    }
    return Date.parse(`1970-01-01 ${tm} UTC`);
}
