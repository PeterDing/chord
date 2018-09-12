'use strict';

import { ISong } from 'chord/music/api/song';


export type IPlayerList = Array<ISong>;

export interface IPlayerState {
    // currently playing song's index of play list
    index: number | null;
    playList: IPlayerList;
    volume: number;
    playing: boolean;
}


export function initiatePlayerState() {
    return {
        index: null,
        playList: [],
        volume: 0.5,
        playing: false,
    };
}
