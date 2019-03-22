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

import { showLibraryResult } from 'chord/workbench/parts/mainView/browser/reducer/libraryResult';
import {
    getMoreLibrarySongs,
    getMoreLibraryArtists,
    getMoreLibraryAlbums,
    getMoreLibraryCollections,
    getMoreLibraryUserProfiles,
} from 'chord/workbench/parts/mainView/browser/reducer/libraryResult';
import {
    addLibrarySong,
    addLibraryArtist,
    addLibraryAlbum,
    addLibraryCollection,
    addLibraryUserProfile,
    removeFromLibrary,
} from 'chord/workbench/parts/mainView/browser/reducer/library';

import { showPreference } from 'chord/workbench/parts/mainView/browser/reducer/preference';

import { showUserProfile } from 'chord/workbench/parts/mainView/browser/reducer/showUserProfile';
import {
    getMoreUserFavoriteSongs,
    getMoreUserFavoriteAlbums,
    getMoreUserFavoriteArtists,
    getMoreUserFavoriteCollections,
    getMoreUserCreatedCollections,
    getMoreUserFollowings,
} from 'chord/workbench/parts/mainView/browser/reducer/userProfile';

import { changeHomeView } from 'chord/workbench/parts/mainView/browser/reducer/home/nagivation';
import { showRecommendView } from 'chord/workbench/parts/mainView/browser/reducer/home/recommend';
import { showCollectionListOptions, showCollectionListView, getMoreCollections } from 'chord/workbench/parts/mainView/browser/reducer/home/collections';
import { showAlbumListOptions, showAlbumList, getMoreAlbums } from 'chord/workbench/parts/mainView/browser/reducer/home/albums';


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

        // library
        case 'c:mainView:libraryInput':
            return {
                reducer: showLibraryResult,
                node: 'libraryView',
            };
        case 'c:mainView:getMoreLibrarySongs':
            return {
                reducer: getMoreLibrarySongs,
                node: 'libraryView.result',
            };
        case 'c:mainView:getMoreLibraryArtists':
            return {
                reducer: getMoreLibraryArtists,
                node: 'libraryView.result',
            };
        case 'c:mainView:getMoreLibraryAlbums':
            return {
                reducer: getMoreLibraryAlbums,
                node: 'libraryView.result',
            };
        case 'c:mainView:getMoreLibraryCollections':
            return {
                reducer: getMoreLibraryCollections,
                node: 'libraryView.result',
            };
        case 'c:mainView:getMoreLibraryUserProfiles':
            return {
                reducer: getMoreLibraryUserProfiles,
                node: 'libraryView.result',
            };
        case 'c:mainView:addLibrarySong':
            return {
                reducer: addLibrarySong,
                node: 'libraryView.result',
            };
        case 'c:mainView:addLibraryArtist':
            return {
                reducer: addLibraryArtist,
                node: 'libraryView.result',
            };
        case 'c:mainView:addLibraryAlbum':
            return {
                reducer: addLibraryAlbum,
                node: 'libraryView.result',
            };
        case 'c:mainView:addLibraryCollection':
            return {
                reducer: addLibraryCollection,
                node: 'libraryView.result',
            };
        case 'c:mainView:addLibraryUserProfile':
            return {
                reducer: addLibraryUserProfile,
                node: 'libraryView.result',
            };
        case 'c:mainView:removeFromLibrary':
            return {
                reducer: removeFromLibrary,
                node: 'libraryView.result',
            };

        // preference
        case 'c:mainView:preferenceView':
            return {
                reducer: showPreference,
                node: '.',
            };

        // user profile
        case 'c:mainView:showUserProfileView':
            return {
                reducer: showUserProfile,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserFavoriteSongs':
            return {
                reducer: getMoreUserFavoriteSongs,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserFavoriteArtists':
            return {
                reducer: getMoreUserFavoriteArtists,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserFavoriteAlbums':
            return {
                reducer: getMoreUserFavoriteAlbums,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserFavoriteCollections':
            return {
                reducer: getMoreUserFavoriteCollections,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserCreatedCollections':
            return {
                reducer: getMoreUserCreatedCollections,
                node: 'userProfileView',
            };
        case 'c:mainView:getMoreUserFollowings':
            return {
                reducer: getMoreUserFollowings,
                node: 'userProfileView',
            };

        // home view
        case 'c:mainView:home:navigation:changeView':
            return {
                reducer: changeHomeView,
                node: 'homeView',
            };
        case 'c:mainView:home:showRecommendView':
            return {
                reducer: showRecommendView,
                node: 'homeView',
            };
        case 'c:mainView:home:showCollectionListOptionsView':
            return {
                reducer: showCollectionListOptions,
                node: 'homeView',
            };
        case 'c:mainView:home:showCollectionListView':
            return {
                reducer: showCollectionListView,
                node: 'homeView.collectionsView',
            };
        case 'c:mainView:home:collections:getMoreCollections':
            return {
                reducer: getMoreCollections,
                node: 'homeView.collectionsView',
            };
        case 'c:mainView:home:showAlbumListOptionsView':
            return {
                reducer: showAlbumListOptions,
                node: 'homeView',
            };
        case 'c:mainView:home:showAlbumListView':
            return {
                reducer: showAlbumList,
                node: 'homeView',
            };
        case 'c:mainView:home:albums:getMoreAlbums':
            return {
                reducer: getMoreAlbums,
                node: 'homeView.albumsView',
            };

        default:
            return null;
    }
}
