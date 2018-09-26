'use strict';

import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { filterSongWithAudios } from 'chord/workbench/api/utils/song';

import { musicApi } from 'chord/music/core/api';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    let songs = filterSongWithAudios(collection.songs);

    if (!songs.length) {
        collection = await musicApi.collection(collection.collectionId);
        let _songs = collection.songs;
        if (!filterSongWithAudios(_songs).length) {
            let songsAudios = await musicApi.songsAudios(_songs.map(song => song.songId));
            _songs.forEach((song, index) => song.audios = songsAudios[index]);
        }
        collection.songs = _songs;
    }
    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection,
    };
}
