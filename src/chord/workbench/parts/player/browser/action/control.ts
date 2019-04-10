'use strict';

import { getRandomSample } from 'chord/base/node/random';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IPlayerState } from 'chord/workbench/api/common/state/player';

import { IPlayPauseAct, IPlayAct } from 'chord/workbench/api/common/action/player'

import { addSongAudios } from 'chord/workbench/api/utils/song';

import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';


let SHUFFLE_SONG_ID_LIST: Array<number>;
let PLAYLIST_ID: number;


function getShuffleIndex(max: number, originalIndex: number): number {
    let { id: playListId, playList } = (<any>window).store.getState().player;
    if (playListId != PLAYLIST_ID || SHUFFLE_SONG_ID_LIST.length == 0) {
        SHUFFLE_SONG_ID_LIST = getRandomSample([...Array(playList.length).keys()], playList.length);
        PLAYLIST_ID = playListId;
    }

    return SHUFFLE_SONG_ID_LIST.pop();
}


export async function handleShuffle(): Promise<IPlayAct> {
    let state: IStateGlobal = (<any>window).store.getState();

    let index = getShuffleIndex(Math.max(state.player.playList.length - 1, 0), state.player.index);

    return handlePlay(index);
}


export async function handleRewind(): Promise<IPlayAct> {
    let player: IPlayerState = (window as any).store.getState().player;
    if (player.shuffle) {
        return handleShuffle();
    }

    let state: IStateGlobal = (<any>window).store.getState();

    let index = Math.max(state.player.index - 1, 0);
    return handlePlay(index);
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

    return handlePlay(index);
}
