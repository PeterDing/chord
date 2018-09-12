'use strict';

import { IShowCollectionAct } from 'chord/workbench/api/common/action/mainView';

import { ICollection } from 'chord/music/api/collection';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handleShowCollectionView(collection: ICollection): Promise<IShowCollectionAct> {
    if (!collection.songs || !collection.songs.length) {
        // TODO, Check collection origin to pick correct api
        collection = await aliMusicApi.collection(collection.collectionOriginalId);
    }
    return {
        type: 'c:mainView:showCollectionView',
        act: 'c:mainView:showCollectionView',
        collection,
    };
}
