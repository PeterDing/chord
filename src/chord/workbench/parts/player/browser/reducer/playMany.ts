'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayManyAct } from 'chord/workbench/api/common/action/player';
import { playSongs } from 'chord/workbench/parts/player/browser/reducer/playSongs';


export function playMany(state: IPlayerState, act: IPlayManyAct): IPlayerState {
    equal(act.act, 'c:player:playMany');

    let playList = act.songs;
    return playSongs(state, playList);
}
