'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';
import { playItems } from 'chord/workbench/parts/player/browser/reducer/playItems';


export function playOne(state: IPlayerState, act: IPlayOneAct): IPlayerState {
    equal(act.act, 'c:player:playOne');

    // Filter playItem which has not audio
    if (act.playItem.audios.length == 0) {
        return { ...state };
    }

    let playList = [act.playItem];
    return playItems(state, playList);
}
