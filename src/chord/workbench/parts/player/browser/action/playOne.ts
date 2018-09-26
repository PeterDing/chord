'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';

import { musicApi } from 'chord/music/core/api';

import { hasSongAudio } from 'chord/workbench/api/utils/song';


export async function handlePlayOne(song: ISong): Promise<IPlayOneAct> {
    if (!hasSongAudio(song)) {
        song.audios = await musicApi.audios(song.songId);
    }

    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        song: song,
    };
}
