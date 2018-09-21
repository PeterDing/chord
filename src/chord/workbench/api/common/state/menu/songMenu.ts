'use strict';

import { ISong } from 'chord/music/api/song';


export interface ISongMenuState {
    top: number;
    left: number;

    song: ISong;
}


export function initiateSongMenuState(): ISongMenuState {
    return {
        top: 0,
        left: 0,
        song: null,
    };
}
