'use strict';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IPlayAct } from 'chord/workbench/api/common/action/player';

import { addSongAudios } from 'chord/workbench/api/utils/song';


export async function handlePlay(index: number): Promise<IPlayAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let playList = state.player.playList;
    let song;

    while (index < playList.length) {
        // directly change song which is in state
        song = playList[index];
        if (song) {
            await addSongAudios(song);
            if (song.audios.length > 0) {
                break;
            }
            // TODO: Warning and logging
            index += 1;
            continue;
        }
        break;
    }

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}
