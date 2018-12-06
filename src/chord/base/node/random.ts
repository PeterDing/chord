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
    let indexRange = [...Array(range).keys()];
    while (result.length < size) {
        let index = getRandomInt(0, indexRange.length - 1);
        result.push(array[indexRange[index]]);
        indexRange = [...indexRange.slice(0, index), ...indexRange.slice(index + 1)];
    }
    return result;
}
