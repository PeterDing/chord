'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';
import { playSongs } from 'chord/workbench/parts/player/browser/reducer/playSongs';


export function playArtist(state: IPlayerState, act: IPlayArtistAct): IPlayerState {
    equal(act.act, 'c:player:playArtist');

    let playList = act.artist.songs;
    return playSongs(state, playList);
}
