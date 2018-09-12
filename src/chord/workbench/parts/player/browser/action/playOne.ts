'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';


export function handlePlayOne(song: ISong): IPlayOneAct {
    return {
        type: 'c:player:playOne',
        act: 'c:player:playOne',
        song: song,
    };
}
