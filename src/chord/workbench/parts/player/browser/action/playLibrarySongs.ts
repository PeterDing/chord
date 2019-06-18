'use strict';

import { ISong } from 'chord/music/api/song';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addPlayItemAudiosIter } from 'chord/workbench/api/utils/playItem';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';

import { defaultLibrary } from 'chord/library/core/library';


const MAX_ID = 2 ** 32 - 1;
const SIZE = MAX_ID;  // TODO: handle OOM


export async function handlePlayLibrarySongs(): Promise<IPlayManyAct> {
    let songs = defaultLibrary.librarySongs(MAX_ID, SIZE, '').map(librarySong => librarySong.song);
    let count = songs.length;

    songs = (await addPlayItemAudiosIter(songs)) as Array<ISong>;
    let item = { type: 'list', listName: 'Library List' };
    noticePlayItem(item, count, count - songs.length);

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        playItems: songs,
    };
}
