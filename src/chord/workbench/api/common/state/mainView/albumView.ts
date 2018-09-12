'use strict';

import { IAlbum } from 'chord/music/api/album';


export interface IAlbumViewState {
    album: IAlbum;
}


export function initiateAlbumViewState(): IAlbumViewState {
    return {
        album: null,
    }
}
