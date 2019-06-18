'use strict';

import { ISearchViewState, initiateSearchViewState } from 'chord/workbench/api/common/state/mainView/searchView';
import { IAlbumViewState, initiateAlbumViewState } from 'chord/workbench/api/common/state/mainView/albumView';
import { IArtistViewState, initiateArtistViewState } from 'chord/workbench/api/common/state/mainView/artistView';
import { ICollectionViewState, initiateCollectionViewState } from 'chord/workbench/api/common/state/mainView/collectionView';
import { IUserProfileViewState, initiateUserProfileViewState } from 'chord/workbench/api/common/state/mainView/userProfileView';
import { IPodcastViewState, initiatePodcastViewState } from 'chord/workbench/api/common/state/mainView/podcastView';
import {IRadioViewState, initiateRadioViewState} from 'chord/workbench/api/common/state/mainView/radioView';
import { ILibraryViewState, initiateLibraryViewState } from 'chord/workbench/api/common/state/mainView/libraryView';
import { IHomeViewState, initiateHomeViewState } from 'chord/workbench/api/common/state/mainView/home/homeView';


export interface IMainViewState {
    // current view: 'searchView' | 'albumView' | 'artistView' | 'collectionView' | 'userProfileView' | 'podcastView' | 'libraryView'
    view: string;

    searchView: ISearchViewState;
    albumView: IAlbumViewState;
    artistView: IArtistViewState;
    collectionView: ICollectionViewState;

    userProfileView: IUserProfileViewState;

    podcastView: IPodcastViewState;
    radioView: IRadioViewState;

    libraryView: ILibraryViewState;

    homeView: IHomeViewState;
}


export function initiateMainViewState(): IMainViewState {
    return {
        view: 'searchView',

        searchView: initiateSearchViewState(),
        albumView: initiateAlbumViewState(),
        artistView: initiateArtistViewState(),
        collectionView: initiateCollectionViewState(),

        userProfileView: initiateUserProfileViewState(),

        podcastView: initiatePodcastViewState(),
        radioView: initiateRadioViewState(),

        libraryView: initiateLibraryViewState(),

        homeView: initiateHomeViewState(),
    }
}
