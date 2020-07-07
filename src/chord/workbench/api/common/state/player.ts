'use strict';

import { TPlayItem } from 'chord/unity/api/items';


// Repeat Kinds
// `No`: No repeat
// `Repeat`: Repeat playlist relentlessly
// `RepeatOne`: Repeat single `TPlayItem` relentlessly
export enum RepeatKind {
    No,
    Repeat,
    RepeatOne,
}


export interface IPlayerState {
    // currently playing song's index of play list
    index: number;
    kbps: number;
    playList: Array<TPlayItem>;
    volume: number;
    playing: boolean;
    shuffle: boolean;

    repeat: RepeatKind;

    // Play list id is an unique number, default the timestamp where changing is active
    // When `playList` changes, the id changes
    id: number;
}


export function initiatePlayerState() {
    return {
        index: null,
        kbps: null,
        playList: [],
        volume: 0.5,
        playing: false,
        shuffle: false,
        repeat: RepeatKind.No,
        id: 0,
    };
}
