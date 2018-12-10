'use strict';

import { Logger } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const logger = new Logger(filenameToNodeName(__filename));

import { equal } from 'chord/base/common/assert';

import { ILibraryResultState } from 'chord/workbench/api/common/state/mainView/libraryView';

import {
    IAddLibrarySongAct,
    IAddLibraryArtistAct,
    IAddLibraryAlbumAct,
    IAddLibraryCollectionAct,
    IAddLibraryUserProfileAct,
    IRemoveFromLibraryAct,
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

export function addLibraryUserProfile(state: ILibraryResultState, act: IAddLibraryUserProfileAct): ILibraryResultState {
    equal(act.act, 'c:mainView:addLibraryUserProfile');

    let userProfiles = [act.userProfile, ...state.userProfiles];
    return { ...state, userProfiles };
}

export function removeFromLibrary(state: ILibraryResultState, act: IRemoveFromLibraryAct): ILibraryResultState {
    equal(act.act, 'c:mainView:removeFromLibrary');

    let item = act.item;

    switch (item.type) {
        case 'song':
            let songs = state.songs.filter(song => song.song.songId != (<any>item).songId);
            return { ...state, songs };
        case 'artist':
            let artists = state.artists.filter(artist => artist.artist.artistId != (<any>item).artistId);
            return { ...state, artists };
        case 'album':
            let albums = state.albums.filter(album => album.album.albumId != (<any>item).albumId);
            return { ...state, albums };
        case 'collection':
            let collections = state.collections.filter(collection => collection.collection.collectionId != (<any>item).collectionId);
            return { ...state, collections };
        case 'userProfile':
            let userProfiles = state.userProfiles.filter(userProfile => userProfile.userProfile.userId != (<any>item).userId);
            return { ...state, userProfiles };
        default:
            logger.error('`removeFromLibrary` reducer: unknown item\'s type:', item.type, item);
    }

    return { ...state };
}
