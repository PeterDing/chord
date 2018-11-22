'use strict';

import { getRandomInt } from 'chord/base/node/random';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IPlayerState } from 'chord/workbench/api/common/state/player';

import { IPlayPauseAct, IPlayAct } from 'chord/workbench/api/common/action/player'

import { addSongAudios } from 'chord/workbench/api/utils/song';


function getShuffleIndex(max: number, originalIndex: number): number {
    while (true) {
        let index = getRandomInt(0, max);
        if (index != originalIndex) {
            return index;
        }
    }
}


export async function handleShuffle(): Promise<IPlayAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let index = getShuffleIndex(Math.max(state.player.playList.length - 1, 0), state.player.index);
    let song = state.player.playList[index];
    if (song) {
        // directly change song which is in state
        await addSongAudios(song);
    }

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}


export async function handleRewind(): Promise<IPlayAct> {
    let player: IPlayerState = (window as any).store.getState().player;
    if (player.shuffle) {
        return handleShuffle();
    }

    let state: IStateGlobal = (<any>window).store.getState();

    let index = Math.max(state.player.index - 1, 0);
    let song = state.player.playList[index];
    if (song) {
        // directly change song which is in state
        await addSongAudios(song);
    }

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}

export async function handlePlayPause(): Promise<IPlayPauseAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let index = state.player.index || 0;
    let song = state.player.playList[index];
    if (song) {
        // directly change song which is in state
        await addSongAudios(song);
    }

    return {
        type: 'c:player:playPause',
        act: 'c:player:playPause',
    };
}

export async function handleForward(): Promise<IPlayAct> {
    let player: IPlayerState = (window as any).store.getState().player;
    if (player.shuffle) {
        return handleShuffle();
    }

    let state: IStateGlobal = (<any>window).store.getState();

    let index = Math.max(state.player.index + 1, 0);
    if (player.repeat) {
        index = index % state.player.playList.length;
    }
    let song = state.player.playList[index];
    if (song) {
        // directly change song which is in state
        await addSongAudios(song);
    }

    return {
        type: 'c:player:play',
        act: 'c:player:play',
        index,
    };
}
