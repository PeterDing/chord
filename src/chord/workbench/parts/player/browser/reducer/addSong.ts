'use strict';

import { equal } from 'chord/base/common/assert';
import { IPlayerState } from 'chord/workbench/api/common/state/player';
import { IAddSongAct } from 'chord/workbench/api/common/action/player';


export function addSong(state: IPlayerState, act: IAddSongAct): IPlayerState {
    equal(act.act, 'c:player:addSong');

    let playList = [...state.playList, ...act.songs.filter(song => song.audios.length > 0)];
    return { ...state, playList };
}
