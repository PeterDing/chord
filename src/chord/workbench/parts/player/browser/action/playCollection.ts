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
        let _songs = _collection.songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));

        if (_songs.length) {
            await addSongAudios(_songs[0]);
        }
        collection.songs = _songs;
    }

    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection,
    };
}
