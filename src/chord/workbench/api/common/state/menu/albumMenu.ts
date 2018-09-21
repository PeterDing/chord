'use strict';

import { IAlbum } from 'chord/music/api/album';


export interface IAlbumMenuState {
    top: number;
    left: number;

    album: IAlbum;
}


export function initiateAlbumMenuState(): IAlbumMenuState {
    return {
        top: 0,
        left: 0,
        album: null,
    };
}
