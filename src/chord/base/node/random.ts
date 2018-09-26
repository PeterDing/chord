'use strict';


export function getRandom() {
  return Math.random();
}

export function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum and the minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum and the minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomSample(array: Array<any>, size: number): Array<any> {
    let range = array.length;
    let result = [];
    while (result.length < size) {
        let index = Math.floor(getRandom() * range);
        result.push(array[index]);
    }
    return result;
}
