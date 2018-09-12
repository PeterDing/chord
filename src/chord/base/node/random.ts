'use strict';


export function getRandom() {
  return Math.random();
}

export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum and the minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    //The maximum and the minimum are inclusive
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
