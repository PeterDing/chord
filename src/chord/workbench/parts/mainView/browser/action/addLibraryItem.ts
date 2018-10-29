'use strict';

import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';

import {
    IAddLibrarySongAct,
    IAddLibraryArtistAct,
    IAddLibraryAlbumAct,
    IAddLibraryCollectionAct,
} from 'chord/workbench/api/common/action/mainView';

import { defaultLibrary as library } from 'chord/library/core/library';


export function handleAddLibrarySong(song: ISong): IAddLibrarySongAct {
    song.like = true;
    let librarySong = library.addSong(song);
    return {
        type: 'c:mainView:addLibrarySong',
        act: 'c:mainView:addLibrarySong',
        song: librarySong,
    };
}

export function handleAddLibraryArtist(artist: IArtist): IAddLibraryArtistAct {
    artist.like = true;
    let libraryArtist = library.addArtist(artist);
    return {
        type: 'c:mainView:addLibraryArtist',
        act: 'c:mainView:addLibraryArtist',
        artist: libraryArtist,
    };
}

export function handleAddLibraryAlbum(album: IAlbum): IAddLibraryAlbumAct {
    album.like = true;
    let libraryAlbum = library.addAlbum(album);
    return {
        type: 'c:mainView:addLibraryAlbum',
        act: 'c:mainView:addLibraryAlbum',
        album: libraryAlbum,
    };
}

export function handleAddLibraryCollection(collection: ICollection): IAddLibraryCollectionAct {
    collection.like = true;
    let libraryCollection = library.addCollection(collection);
    return {
        type: 'c:mainView:addLibraryCollection',
        act: 'c:mainView:addLibraryCollection',
        collection: libraryCollection,
    };
}
