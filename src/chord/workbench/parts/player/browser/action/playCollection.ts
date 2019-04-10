'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio, addSongAudiosIter } from 'chord/workbench/api/utils/song';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    let songs = collection.songs || [];
    let count = collection.songCount || songs.length;

    if (!songs.length) {
        let _collection = await musicApi.collection(collection.collectionId);
        count = _collection.songCount || _collection.songs.length;
        songs = _collection.songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasSongAudio(song));

    }

    songs = await addSongAudiosIter(songs);

    noticePlayItem(collection, count, count - songs.length);

    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection: { ...collection, songs },
    };
}
