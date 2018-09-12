'use strict';

export interface IPage {
    // current page
    page: number;

    // size of each page
    size: number;

    // count of all items
    count?: number;

    // more is true, there are more items
    // more is false, there are no more items
    more: boolean;
}


export function initiatePage(): IPage {
    return {
        page: 0,
        size: 10,
        more: true,
    };
}
