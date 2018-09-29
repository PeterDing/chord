'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IPage } from 'chord/workbench/api/common/state/page';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';

import { musicApi } from 'chord/music/core/api';


export async function getMoreSongs(artist: IArtist, page: IPage): Promise<IGetMoreArtistSongsAct> {
    let songs = [];
    if (page.more) {
        songs = await musicApi.artistSongs(artist.artistId, page.page, page.size);
        page.page += 1;
    }
    if (songs.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:getMoreArtistSongs',
        act: 'c:mainView:getMoreArtistSongs',
        songs: songs,
        songsPage: page,
    };
}

export async function getMoreAlbums(artist: IArtist, page: IPage): Promise<IGetMoreArtistAlbumsAct> {
    let albums = [];
    if (page.more) {
        albums = await musicApi.artistAlbums(artist.artistId, page.page, page.size, artist.artistMid);
        page.page += 1;
    }
    if (albums.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:getMoreArtistAlbums',
        act: 'c:mainView:getMoreArtistAlbums',
        albums: albums,
        albumsPage: page,
    };
}
