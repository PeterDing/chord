'use strict';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface ILibraryResultState {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;

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
