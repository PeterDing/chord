'use strict';

import { ISong } from 'chord/music/api/song';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addSongAudiosIter } from 'chord/workbench/api/utils/song';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayManySongs(songs: Array<ISong>): Promise<IPlayManyAct> {
    let count = songs.length;
    songs = await addSongAudiosIter(songs);

    let item = { type: 'list', listName: 'PlayList' };
    noticePlayItem(item, count, count - songs.length);

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        songs,
    };
}
