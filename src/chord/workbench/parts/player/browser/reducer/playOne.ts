'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';
import { playSongs } from 'chord/workbench/parts/player/browser/reducer/playSongs';


export function playOne(state: IPlayerState, act: IPlayOneAct): IPlayerState {
    equal(act.act, 'c:player:playOne');

    // Filter song which has not audio
    if (act.song.audios.length == 0) {
        return { ...state };
    }

    let playList = [act.song];
    return playSongs(state, playList);
}
