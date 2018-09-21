'use strict';

import { IArtist } from 'chord/music/api/artist';


export interface IArtistMenuState {
    top: number;
    left: number;

    artist: IArtist;
}


export function initiateArtistMenuState(): IArtistMenuState {
    return {
        top: 0,
        left: 0,
        artist: null,
    };
}
