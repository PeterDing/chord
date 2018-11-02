'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';
import { playSongs } from 'chord/workbench/parts/player/browser/reducer/playSongs';


export function playUserFavoriteSongs(state: IPlayerState, act: IPlayUserFavoriteSongsAct): IPlayerState {
    equal(act.act, 'c:player:playUserFavoriteSongs');

    let playList = act.songs;
    return playSongs(state, playList);
}
