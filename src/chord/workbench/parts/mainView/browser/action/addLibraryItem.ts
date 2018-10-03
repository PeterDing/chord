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

import { defaultUser as user } from 'chord/user/core/user';


export function handleAddLibrarySong(song: ISong): IAddLibrarySongAct {
    song.like = true;
    let userSong = user.addSong(song);
    return {
        type: 'c:mainView:addLibrarySong',
        act: 'c:mainView:addLibrarySong',
        song: userSong,
    };
}

export function handleAddLibraryArtist(artist: IArtist): IAddLibraryArtistAct {
    artist.like = true;
    let userArtist = user.addArtist(artist);
    return {
        type: 'c:mainView:addLibraryArtist',
        act: 'c:mainView:addLibraryArtist',
        artist: userArtist,
    };
}

export function handleAddLibraryAlbum(album: IAlbum): IAddLibraryAlbumAct {
    album.like = true;
    let userAlbum = user.addAlbum(album);
    return {
        type: 'c:mainView:addLibraryAlbum',
        act: 'c:mainView:addLibraryAlbum',
        album: userAlbum,
    };
}

export function handleAddLibraryCollection(collection: ICollection): IAddLibraryCollectionAct {
    collection.like = true;
    let userCollection = user.addCollection(collection);
    return {
        type: 'c:mainView:addLibraryCollection',
        act: 'c:mainView:addLibraryCollection',
        collection: userCollection,
    };
}
