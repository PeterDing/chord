'use strict';

import { IReducerMap } from 'chord/workbench/api/common/reducer/reducerMap';

import { showSearchView } from 'chord/workbench/parts/mainView/browser/reducer/searchView';
import {
    showSearchResult,
    addSearchSongs,
    addSearchAlbums,
    addSearchArtists,
    addSearchCollections,
} from 'chord/workbench/parts/mainView/browser/reducer/searchResult';
import { showAlbumView } from 'chord/workbench/parts/mainView/browser/reducer/showAlbum';
import { showCollectionView } from 'chord/workbench/parts/mainView/browser/reducer/showCollection';
import { showArtistView } from 'chord/workbench/parts/mainView/browser/reducer/showArtist';
import { comebackView } from 'chord/workbench/parts/mainView/browser/reducer/comeback';

import { getMoreArtistSongs, getMoreArtistAlbums } from 'chord/workbench/parts/mainView/browser/reducer/artist';


export function map(act: string): IReducerMap {
    switch (act) {
        case 'c:mainView:searchView':
            return {
                reducer: showSearchView,
                node: 'searchView',
            };

        case 'c:mainView:searchInput':
            return {
                reducer: showSearchResult,
                node: 'searchView',
            };

        case 'c:mainView:searchMoreSongs':
            return {
                reducer: addSearchSongs,
                node: 'searchView.result',
            };
        case 'c:mainView:searchMoreAlbums':
            return {
                reducer: addSearchAlbums,
                node: 'searchView.result',
            };
        case 'c:mainView:searchMoreArtists':
            return {
                reducer: addSearchArtists,
                node: 'searchView.result',
            };
        case 'c:mainView:searchMoreCollections':
            return {
                reducer: addSearchCollections,
                node: 'searchView.result',
            };

        // show album view
        case 'c:mainView:showAlbumView':
            return {
                reducer: showAlbumView,
                node: 'albumView',
            };

        // show collection view
        case 'c:mainView:showCollectionView':
            return {
                reducer: showCollectionView,
                node: 'collectionView',
            };

        case 'c:mainView:comeback':
            return {
                reducer: comebackView,
                node: '.',
            };

        // show artist view
        case 'c:mainView:showArtistView':
            return {
                reducer: showArtistView,
                node: 'artistView',
            };

        // artist
        case 'c:mainView:getMoreArtistSongs':
            return {
                reducer: getMoreArtistSongs,
                node: 'artistView',
            };
        case 'c:mainView:getMoreArtistAlbums':
            return {
                reducer: getMoreArtistAlbums,
                node: 'artistView',
            };

        default:
            return null;
    }
}
