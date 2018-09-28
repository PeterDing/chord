'use strict';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IPlayAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';


export async function handlePlay(index: number): Promise<IPlayAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    // directly change song which is in state
    let song = state.player.playList[index];
    await addSongAudios(song);

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}
