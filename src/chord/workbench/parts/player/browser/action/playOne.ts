'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';

import { noticePlayItem } from 'chord/workbench/parts/notification/action/notice';


export async function handlePlayOne(song: ISong): Promise<IPlayOneAct> {
    await addSongAudios(song);

    noticePlayItem(song);

    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        song: song,
    };
}
