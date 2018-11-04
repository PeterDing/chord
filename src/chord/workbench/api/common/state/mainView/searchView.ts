'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface ISearchResultState {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;
}


export interface ISearchHistoryState {
    keywords: Array<string>;
}


export interface ISearchViewState {
    // current view ('searchHistory' or 'searchResult')
    view: string;

    // search input keyword
    keyword: string;

    history: ISearchHistoryState;
    result: ISearchResultState;
}


export function initiateSearchResultState(): ISearchResultState {
    return {
        view: 'top',

        songs: [],
        albums: [],
        artists: [],
        collections: [],

        songsOffset: initiateOffset(),
        albumsOffset: initiateOffset(),
        artistsOffset: initiateOffset(),
        collectionsOffset: initiateOffset(),
    };
}


export function initiateSearchHistoryState(): ISearchHistoryState {
    return {
        keywords: [],
    };
}


export function initiateSearchViewState(): ISearchViewState {
    return {
        view: 'searchHistory',
        keyword: '',
        history: initiateSearchHistoryState(),
        result: initiateSearchResultState(),
    }
}
