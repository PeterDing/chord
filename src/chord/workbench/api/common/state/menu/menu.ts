'use strict';

import { ISongMenuState, initiateSongMenuState } from 'chord/workbench/api/common/state/menu/songMenu';
import { IArtistMenuState, initiateArtistMenuState } from 'chord/workbench/api/common/state/menu/artistMenu';
import { IAlbumMenuState, initiateAlbumMenuState } from 'chord/workbench/api/common/state/menu/albumMenu';
import { ICollectionMenuState, initiateCollectionMenuState } from 'chord/workbench/api/common/state/menu/collectionMenu';
import { IUserProfileMenuState, initiateUserProfileMenuState } from 'chord/workbench/api/common/state/menu/userProfileMenu';

import { IEpisodeMenuState, initiateEpisodeMenuState } from 'chord/workbench/api/common/state/menu/episodeMenu';
import { IPodcastMenuState, initiatePodcastMenuState } from 'chord/workbench/api/common/state/menu/podcastMenu';
import { IRadioMenuState, initiateRadioMenuState } from 'chord/workbench/api/common/state/menu/radioMenu';


export interface IMenuState {
    // 'songMenuView' 
    // | 'artistMenuView' 
    // | 'albumMenuView' 
    // | 'collectionMenuView' 
    // | 'userProfileMenuView' 
    // | 'episodeMenuView' 
    // | 'podcastMenuView' 
    // | 'radioMenuView'
    // | null
    view: string;

    songMenu: ISongMenuState;
    artistMenu: IArtistMenuState;
    albumMenu: IAlbumMenuState;
    collectionMenu: ICollectionMenuState;
    userProfileMenu: IUserProfileMenuState;

    episodeMenu: IEpisodeMenuState;
    podcastMenu: IPodcastMenuState;
    radioMenu: IRadioMenuState;
}


export function initiateMenuState(): IMenuState {
    return {
        view: null,
        songMenu: initiateSongMenuState(),
        artistMenu: initiateArtistMenuState(),
        albumMenu: initiateAlbumMenuState(),
        collectionMenu: initiateCollectionMenuState(),
        userProfileMenu: initiateUserProfileMenuState(),

        episodeMenu: initiateEpisodeMenuState(),
        podcastMenu: initiatePodcastMenuState(),
        radioMenu: initiateRadioMenuState(),

    };
}
