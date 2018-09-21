'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';

import { aliMusicApi } from 'chord/music/xiami/api';

import { hasSongAudio } from 'chord/workbench/api/utils/song';


export async function handlePlayOne(song: ISong): Promise<IPlayOneAct> {
    if (!hasSongAudio(song)) {
        song = await aliMusicApi.song(song.songOriginalId);
    }

    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        song: song,
    };
}
