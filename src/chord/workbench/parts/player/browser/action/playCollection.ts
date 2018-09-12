'use strict';

import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    if (!collection.songs || !collection.songs.length) {
        // TODO, Check collection origin to pick correct api
        collection = await aliMusicApi.collection(collection.collectionOriginalId);
    }
    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection,
    };
}
