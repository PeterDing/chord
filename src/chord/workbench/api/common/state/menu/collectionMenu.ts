'use strict';

import { ICollection } from 'chord/music/api/collection';


export interface ICollectionMenuState {
    top: number;
    left: number;

    collection: ICollection;
}


export function initiateCollectionMenuState(): ICollectionMenuState {
    return {
        top: 0,
        left: 0,
        collection: null,
    };
}
