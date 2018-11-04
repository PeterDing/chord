'use strict';

import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';

import { IArtist } from 'chord/music/api/artist';

import { getMoreSongs, getMoreAlbums } from 'chord/workbench/parts/mainView/browser/action/artist';
import { initiateOffset } from 'chord/workbench/api/common/state/offset';

import { musicApi } from 'chord/music/core/api';


export async function handleShowArtistView(artist: IArtist): Promise<IShowArtistAct> {
    let { songs, songsOffset } = await getMoreSongs(artist, initiateOffset());
    let { albums, albumsOffset } = await getMoreAlbums(artist, initiateOffset());

    artist.songs = songs;
    artist.albums = albums;

    return {
        type: 'c:mainView:showArtistView',
        act: 'c:mainView:showArtistView',
        artist,
        songsOffset,
        albumsOffset,
    };
}


export async function handleShowArtistViewById(artistId: string): Promise<IShowArtistAct> {
    let artist = await musicApi.artist(artistId);
    return handleShowArtistView(artist);
}
