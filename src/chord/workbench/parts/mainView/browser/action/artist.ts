'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IOffset } from 'chord/workbench/api/common/state/offset';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';

import { makeOffsets, setCurrectOffset } from 'chord/workbench/api/utils/offset';

import { musicApi } from 'chord/music/core/api';


export async function getMoreSongs(artist: IArtist, offset: IOffset, size: number = 10): Promise<IGetMoreArtistSongsAct> {
    let songs = [];
    if (offset.more) {
        let offsets = makeOffsets(artist.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.artistSongs(artist.artistId, _offset.offset, _offset.limit));
        let songsList = await Promise.all(futs);
        songs = songs.concat(...songsList).slice(0, size);
        offset = setCurrectOffset(artist.origin, offset, songs.length);
    }
    if (songs.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreArtistSongs',
        act: 'c:mainView:getMoreArtistSongs',
        songs: songs,
        songsOffset: offset,
    };
}

export async function getMoreAlbums(artist: IArtist, offset: IOffset, size: number = 10): Promise<IGetMoreArtistAlbumsAct> {
    let albums = [];
    if (offset.more) {
        let offsets = makeOffsets(artist.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.artistAlbums(artist.artistId, _offset.offset, _offset.limit, artist.artistMid));
        let albumsList = await Promise.all(futs);
        albums = albums.concat(...albumsList).slice(0, size);
        offset = setCurrectOffset(artist.origin, offset, albums.length);
    }
    if (albums.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreArtistAlbums',
        act: 'c:mainView:getMoreArtistAlbums',
        albums: albums,
        albumsOffset: offset,
    };
}
