'use strict';

import { defaultLibrary } from 'chord/library/core/library';


/**
 * Check whether song, artist, album, collection exists at library
 */
export function makeItem<T>(item: T): T {
    if (!item) return item;

    if (defaultLibrary.exists(<any>item)) {
        (<any>item).like = true;
    }
    return item;
}

export function makeItems<T>(items: Array<T>): Array<T> {
    if (!items) return items;

    return (items).map(item => item ? makeItem(item) : item);
}
