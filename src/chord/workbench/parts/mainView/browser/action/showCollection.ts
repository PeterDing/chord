'use strict';

import { IShowCollectionAct } from 'chord/workbench/api/common/action/mainView';

import { ICollection } from 'chord/music/api/collection';

import { musicApi } from 'chord/music/core/api';


export async function handleShowCollectionView(collection: ICollection): Promise<IShowCollectionAct> {
    if (!collection.songs
        || !collection.songs.length
        || !collection.songCount
        || collection.songCount != collection.songs.length) {
        collection = await musicApi.collection(collection.collectionId);
    }
    return {
        type: 'c:mainView:showCollectionView',
        act: 'c:mainView:showCollectionView',
        collection,
    };
}
