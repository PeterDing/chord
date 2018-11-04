'use strict';

import { equal } from 'chord/base/common/assert';
import {
    ISearchInputAct,
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';
import { ISearchViewState, ISearchResultState } from 'chord/workbench/api/common/state/mainView/searchView';


export function showSearchResult(state: ISearchViewState, act: ISearchInputAct): ISearchViewState {
    equal(act.act, 'c:mainView:searchInput');

    let result = {
        ...state.result,
        view: 'top',
        songs: act.songs,
        albums: act.albums,
        artists: act.artists,
        collections: act.collections,
    };
    let keywords = act.keyword == state.history.keywords[0] ?
        [...state.history.keywords] : [act.keyword, ...state.history.keywords.slice(0, 100)];
    let history = { keywords };
    return { ...state, view: 'searchResult', keyword: act.keyword, history, result };
}

export function addSearchSongs(state: ISearchResultState, act: ISearchMoreSongsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreSongs')

    let songsOffset = act.songsOffset;
    let songs = [...state.songs, ...act.songs];
    return { ...state, songs, songsOffset };
}

export function addSearchAlbums(state: ISearchResultState, act: ISearchMoreAlbumsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreAlbums')

    let albumsOffset = act.albumsOffset;
    let albums = [...state.albums, ...act.albums];
    return { ...state, albums, albumsOffset };
}

export function addSearchArtists(state: ISearchResultState, act: ISearchMoreArtistsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreArtists')

    let artistsOffset = act.artistsOffset;
    let artists = [...state.artists, ...act.artists];
    return { ...state, artists, artistsOffset };
}

export function addSearchCollections(state: ISearchResultState, act: ISearchMoreCollectionsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreCollections')

    let collectionsOffset = act.collectionsOffset;
    let collections = [...state.collections, ...act.collections];
    return { ...state, collections, collectionsOffset };
}
