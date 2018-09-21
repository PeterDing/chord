'use strict';

import { ISearchViewState, initiateSearchViewState } from 'chord/workbench/api/common/state/mainview/searchview';
import { IAlbumViewState, initiateAlbumViewState } from 'chord/workbench/api/common/state/mainview/albumview';
import { IArtistViewState, initiateArtistViewState } from 'chord/workbench/api/common/state/mainview/artistView';
import { ICollectionViewState, initiateCollectionViewState } from 'chord/workbench/api/common/state/mainview/collectionView';
import { ILibraryViewState, initiateLibraryViewState } from 'chord/workbench/api/common/state/mainView/libraryView';


export interface IMainViewState {
    // current view: 'searchView' | 'albumView' | 'artistView' | 'collectionView' | 'libraryView'
    view: string;

    searchView: ISearchViewState;
    albumView: IAlbumViewState;
    artistView: IArtistViewState;
    collectionView: ICollectionViewState;

    libraryView: ILibraryViewState;
}


export function initiateMainViewState(): IMainViewState {
    return {
        view: 'searchView',

        searchView: initiateSearchViewState(),
        albumView: initiateAlbumViewState(),
        artistView: initiateArtistViewState(),
        collectionView: initiateCollectionViewState(),

        libraryView: initiateLibraryViewState(),
    }
}
