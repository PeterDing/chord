'use strict';

import { IArtist } from 'chord/music/api/artist';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface IArtistViewState {
    // For artist navigation bar
    // 'overview' | 'songs' | 'albums'
    view: string;

    artist: IArtist;

    songsOffset: IOffset;
    albumsOffset: IOffset;
}


export function initiateArtistViewState() {
    return {
        view: 'overview',

        artist: null,

        songsOffset: initiateOffset(),
        albumsOffset: initiateOffset(),
    }
}
