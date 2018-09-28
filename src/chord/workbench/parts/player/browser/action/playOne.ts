'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';


export async function handlePlayOne(song: ISong): Promise<IPlayOneAct> {
    await addSongAudios(song);

    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        song: song,
    };
}
