'use strict';

import { ISong } from 'chord/music/api/song';


export type IPlayerList = Array<ISong>;

export interface IPlayerState {
    // currently playing song's index of play list
    index: number;
    kbps: number;
    playList: IPlayerList;
    volume: number;
    playing: boolean;
}


export function initiatePlayerState() {
    return {
        index: null,
        kbps: null,
        playList: [],
        volume: 0.5,
        playing: false,
    };
}
