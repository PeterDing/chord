'use strict';

import { defaultLibrary } from 'chord/library/core/library';


/**
 * Check whether song, artist, album, collection exists at library
 */
export function makeItem<T>(item: T): T {
    if (defaultLibrary.exists(<any>item)) {
        (<any>item).like = true;
    }
    return item;
}

export function makeItems<T>(items: Array<T>): Array<T> {
    return items.map(item => makeItem(item));
}
