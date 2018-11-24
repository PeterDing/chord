'use strict';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';

import { defaultLibrary } from 'chord/library/core/library';

const MAX_ID = 2 ** 32 - 1;
const SIZE = MAX_ID;  // TODO: handle OOM


export async function handlePlayLibrarySongs(): Promise<IPlayManyAct> {
    let songs = defaultLibrary.librarySongs(MAX_ID, SIZE, '').map(librarySong => librarySong.song);

    if (songs.length) {
        await addSongAudios(songs[0]);
    }

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        songs,
    };
}
