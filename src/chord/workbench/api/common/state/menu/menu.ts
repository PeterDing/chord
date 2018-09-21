'use strict';

import { ISongMenuState, initiateSongMenuState } from 'chord/workbench/api/common/state/menu/songMenu';
import { IArtistMenuState, initiateArtistMenuState } from 'chord/workbench/api/common/state/menu/artistMenu';
import { IAlbumMenuState, initiateAlbumMenuState } from 'chord/workbench/api/common/state/menu/albumMenu';
import { ICollectionMenuState, initiateCollectionMenuState } from 'chord/workbench/api/common/state/menu/collectionMenu';


export interface IMenuState {
    // 'songMenuView' | 'artistMenuView' | 'albumMenuView' | 'collectionMenuView' | null
    view: string;

    songMenu: ISongMenuState;
    artistMenu: IArtistMenuState;
    albumMenu: IAlbumMenuState;
    collectionMenu: ICollectionMenuState;
}


export function initiateMenuState(): IMenuState {
    return {
        view: null,
        songMenu: initiateSongMenuState(),
        artistMenu: initiateArtistMenuState(),
        albumMenu: initiateAlbumMenuState(),
        collectionMenu: initiateCollectionMenuState(),
    };
}
