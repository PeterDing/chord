'use strict';

import { equal } from 'chord/base/common/assert';

import { ILibraryResultState } from 'chord/workbench/api/common/state/mainView/libraryView';

import {
    IAddLibrarySongAct,
    IAddLibraryArtistAct,
    IAddLibraryAlbumAct,
    IAddLibraryCollectionAct,
} from 'chord/workbench/api/common/action/mainView';


export function addLibrarySong(state: ILibraryResultState, act: IAddLibrarySongAct): ILibraryResultState {
    equal(act.act, 'c:mainView:addLibrarySong');

    let songs = [act.song, ...state.songs];
    return { ...state, songs };
}

export function addLibraryArtist(state: ILibraryResultState, act: IAddLibraryArtistAct): ILibraryResultState {
    equal(act.act, 'c:mainView:addLibraryArtist');

    let artists = [act.artist, ...state.artists];
    return { ...state, artists };
}

export function addLibraryAlbum(state: ILibraryResultState, act: IAddLibraryAlbumAct): ILibraryResultState {
    equal(act.act, 'c:mainView:addLibraryAlbum');

    let albums = [act.album, ...state.albums];
    return { ...state, albums };
}

export function addLibraryCollection(state: ILibraryResultState, act: IAddLibraryCollectionAct): ILibraryResultState {
    equal(act.act, 'c:mainView:addLibraryCollection');

    let collections = [act.collection, ...state.collections];
    return { ...state, collections };
}
