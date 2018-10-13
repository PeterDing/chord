'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio, addSongAudios, filterSongWithAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    let songs = filterSongWithAudios(collection.songs);

    if (!songs.length) {
        let _collection = await musicApi.collection(collection.collectionId);
        songs = _collection.songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));

    }
    if (songs.length) {
        await addSongAudios(songs[0]);
    }

    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection: { ...collection, songs },
    };
}
