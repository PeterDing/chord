'use strict';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IRewindAct, IPlayPauseAct, IForwardAct } from 'chord/workbench/api/common/action/player'

import { addSongAudios } from 'chord/workbench/api/utils/song';


export async function handleRewind(): Promise<IRewindAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    // directly change song which is in state
    let index = Math.max(state.player.index - 1, 0);
    let song = state.player.playList[index];
    if (song) {
        await addSongAudios(song);
    }

    return {
        type: 'c:player:rewind',
        act: 'c:player:rewind',
    };
}

export async function handlePlayPause(): Promise<IPlayPauseAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    // directly change song which is in state
    let index = state.player.index || 0;
    let song = state.player.playList[index];
    if (song) {
        await addSongAudios(song);
    }

    return {
        type: 'c:player:playPause',
        act: 'c:player:playPause',
    };
}

export async function handleForward(): Promise<IForwardAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    // directly change song which is in state
    let index = Math.max(state.player.index + 1, 0);
    let song = state.player.playList[index];
    if (song) {
        await addSongAudios(song);
    }

    return {
        type: 'c:player:forward',
        act: 'c:player:forward',
    };
}
