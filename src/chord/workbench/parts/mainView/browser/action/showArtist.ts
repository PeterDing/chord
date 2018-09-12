'use strict';

import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';

import { IArtist } from 'chord/music/api/artist';

import { getMoreSongs, getMoreAlbums } from 'chord/workbench/parts/mainView/browser/action/artist';
import { initiatePage } from 'chord/workbench/api/common/state/page';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function handleShowArtistView(artist: IArtist): Promise<IShowArtistAct> {
    let songsPage = initiatePage();
    let albumsPage = initiatePage();

    // TODO, Check album origin to pick correct api
    let { songs } = await getMoreSongs(artist, songsPage);
    let { albums } = await getMoreAlbums(artist, albumsPage);

    artist.songs = songs;
    artist.albums = albums;

    return {
        type: 'c:mainView:showArtistView',
        act: 'c:mainView:showArtistView',
        artist,
        songsPage,
        albumsPage,
    };
}


export async function handleShowArtistViewById(artistId: string): Promise<IShowArtistAct> {
    let artist = await aliMusicApi.artist(artistId.split('|')[2]);
    return handleShowArtistView(artist);
}
