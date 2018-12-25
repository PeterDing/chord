'use strict';

import { ISong } from 'chord/music/api/song';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayManySongs(songs: Array<ISong>): Promise<IPlayManyAct> {
    if (songs.length) {
        await addSongAudios(songs[0]);
    }

    return {
        'type': 'c:player:playMany',
        'act': 'c:player:playMany',
        songs,
    };
}
