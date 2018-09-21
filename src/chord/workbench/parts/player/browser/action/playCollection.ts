'use strict';

import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    let songs = filterSongWithAudios(collection.songs);

    if (!songs.length) {
        // TODO, Check collection origin to pick correct api
        collection = await aliMusicApi.collection(collection.collectionOriginalId);
    }
    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection,
    };
}
