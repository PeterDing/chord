'use strict';


export interface IOffset {
    // current offset
    offset: number;

    // amount of each action
    limit: number;

    // count of all items
    count?: number;

    // more is true, there are more items
    // more is false, there are no more items
    more?: boolean;
}


export function initiateOffset(): IOffset {
    return {
        offset: 0,
        limit: 10,
        more: true,
    };
}
