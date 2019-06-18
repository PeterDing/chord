'use strict';


export function insertMerge<T>(list: Array<Array<T>>): Array<T> {
    let items = [];
    let maxLength = Math.max(...list.map(i => i.length));
    for (let index = 0; index < maxLength; index++) {
        for (let array of list) {
            let item = array[index];
            if (item) items.push(item);
        }
    }
    return items;
}
