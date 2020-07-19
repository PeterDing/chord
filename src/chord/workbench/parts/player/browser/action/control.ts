'use strict';

import { getRandomSample } from 'chord/base/node/random';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IPlayerState, RepeatKind } from 'chord/workbench/api/common/state/player';

import { IPlayPauseAct, IPlayAct } from 'chord/workbench/api/common/action/player'

import { addPlayItemAudios } from 'chord/workbench/api/utils/playItem';

import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';


let SHUFFLE_SONG_ID_LIST: Array<number> = [];
let PLAYLIST_ID: number;


function shuffleIndex(): number {
    let { playList } = (<any>window).store.getState().player;
    if (SHUFFLE_SONG_ID_LIST.length == 0) {
        SHUFFLE_SONG_ID_LIST = getRandomSample([...Array(playList.length).keys()], playList.length);
    }
    let index = SHUFFLE_SONG_ID_LIST.pop();
    return index;
}


export async function handleRewind(): Promise<IPlayAct> {
    let player: IPlayerState = (window as any).store.getState().player;
    if (player.shuffle) {
        let index = shuffleIndex();
        return handlePlay(index);
    }

    let state: IStateGlobal = (<any>window).store.getState();

    let index = Math.max(state.player.index - 1, 0);
    return handlePlay(index);
}

export async function handlePlayPause(): Promise<IPlayPauseAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let index = state.player.index || 0;
    let playItem = state.player.playList[index];
    if (playItem) {
        // directly change playItem which is in state
        await addPlayItemAudios(playItem);
    }

    return {
        type: 'c:player:playPause',
        act: 'c:player:playPause',
    };
}

export async function handleForward(): Promise<IPlayAct> {
    let player: IPlayerState = (window as any).store.getState().player;
    if (player.shuffle) {
        let index = shuffleIndex();
        return handlePlay(index);
    }

    let state: IStateGlobal = (<any>window).store.getState();

    let index: number;
    switch (player.repeat) {
        case RepeatKind.No:
            index = Math.max(state.player.index + 1, 0);
            break;
        case RepeatKind.Repeat:
            index = Math.max(state.player.index + 1, 0);
            index = index % state.player.playList.length;
            break;
        case RepeatKind.RepeatOne:
            index = Math.max(state.player.index, 0);
            break;
    }

    return handlePlay(index);
}
