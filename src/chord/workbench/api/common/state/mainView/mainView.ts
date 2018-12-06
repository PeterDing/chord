'use strict';

import { ISearchViewState, initiateSearchViewState } from 'chord/workbench/api/common/state/mainView/searchView';
import { IAlbumViewState, initiateAlbumViewState } from 'chord/workbench/api/common/state/mainView/albumView';
import { IArtistViewState, initiateArtistViewState } from 'chord/workbench/api/common/state/mainView/artistView';
import { ICollectionViewState, initiateCollectionViewState } from 'chord/workbench/api/common/state/mainView/collectionView';
import { IUserProfileViewState, initiateUserProfileViewState } from 'chord/workbench/api/common/state/mainView/userProfileView';
import { ILibraryViewState, initiateLibraryViewState } from 'chord/workbench/api/common/state/mainView/libraryView';


export interface IMainViewState {
    // current view: 'searchView' | 'albumView' | 'artistView' | 'collectionView' | 'libraryView'
    view: string;

    searchView: ISearchViewState;
    albumView: IAlbumViewState;
    artistView: IArtistViewState;
    collectionView: ICollectionViewState;

    userProfileView: IUserProfileViewState;

    libraryView: ILibraryViewState;
}


export function initiateMainViewState(): IMainViewState {
    return {
        view: 'searchView',

        searchView: initiateSearchViewState(),
        albumView: initiateAlbumViewState(),
        artistView: initiateArtistViewState(),
        collectionView: initiateCollectionViewState(),

        userProfileView: initiateUserProfileViewState(),

        libraryView: initiateLibraryViewState(),
    }
}
