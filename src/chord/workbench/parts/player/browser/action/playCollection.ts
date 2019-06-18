'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { ISong } from 'chord/music/api/song';
import { ICollection } from 'chord/music/api/collection';

import { IPlayCollectionAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasPlayItemAudio, addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayCollection(collection: ICollection): Promise<IPlayCollectionAct> {
    let songs = collection.songs || [];
    let count = collection.songCount || songs.length;

    if (!songs.length) {
        let _collection = await musicApi.collection(
            collection.collectionId, 0, collection.songCount || 1000);
        count = _collection.songCount || _collection.songs.length;
        songs = _collection.songs
            .filter(song => !song.disable)
            .filter(song => song.origin != ORIGIN.xiami || hasPlayItemAudio(song));

    }

    songs = (await addPlayItemAudiosIter(songs)) as Array<ISong>;

    noticePlayItem(collection, count, count - songs.length);

    return {
        type: 'c:player:playCollection',
        act: 'c:player:playCollection',
        collection: { ...collection, songs },
    };
}
