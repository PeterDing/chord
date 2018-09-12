'use strict';

import { IArtist } from 'chord/music/api/artist';
import { IPage, initiatePage } from 'chord/workbench/api/common/state/page';


export interface IArtistViewState {
    // For artist navigation bar
    // 'overview' | 'songs' | 'albums'
    view: string;

    artist: IArtist;

    songsPage: IPage;
    albumsPage: IPage;
}


export function initiateArtistViewState() {
    return {
        view: 'overview',

        artist: null,

        songsPage: initiatePage(),
        albumsPage: initiatePage(),
    }
}
