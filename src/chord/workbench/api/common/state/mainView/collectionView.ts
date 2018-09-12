'use strict';

import { ICollection } from 'chord/music/api/collection';


export interface ICollectionViewState {
    collection: ICollection;
}


export function initiateCollectionViewState(): ICollectionViewState {
    return {
        collection: null,
    }
}
