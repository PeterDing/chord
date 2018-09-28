'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';
import { playSongs } from 'chord/workbench/parts/player/browser/reducer/playSongs';


export function playAlbum(state: IPlayerState, act: IPlayAlbumAct): IPlayerState {
    equal(act.act, 'c:player:playAlbum');

    let playList = act.album.songs;
    return playSongs(state, playList);
}
