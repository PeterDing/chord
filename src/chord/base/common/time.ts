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
