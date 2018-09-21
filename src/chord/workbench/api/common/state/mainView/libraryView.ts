'use strict';

import { IUserSong } from 'chord/user/api/song';
import { IUserAlbum } from 'chord/user/api/album';
import { IUserArtist } from 'chord/user/api/artist';
import { IUserCollection } from 'chord/user/api/collection';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface ILibraryResultState {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    songs: Array<IUserSong>;
    albums: Array<IUserAlbum>;
    artists: Array<IUserArtist>;
    collections: Array<IUserCollection>;

    // offset is lastId
    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;
}

export interface ILibraryViewState {
    // library searching input keyword
    keyword: string;

    result: ILibraryResultState;
}


const MAX_ID = 2 ** 32 - 1;

export function initiateLibraryResultState(): ILibraryResultState {
    return {
        view: 'top',

        songs: [],
        albums: [],
        artists: [],
        collections: [],

        songsOffset: { ...initiateOffset(), offset: MAX_ID },
        albumsOffset: { ...initiateOffset(), offset: MAX_ID },
        artistsOffset: { ...initiateOffset(), offset: MAX_ID },
        collectionsOffset: { ...initiateOffset(), offset: MAX_ID },
    };
}

export function initiateLibraryViewState(): ILibraryViewState {
    return {
        keyword: '',
        result: initiateLibraryResultState(),
    }
}
