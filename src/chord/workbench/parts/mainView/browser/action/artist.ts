'use strict';

import { IArtist } from 'chord/music/api/artist';

import { aliMusicApi } from 'chord/music/xiami/api';
import { IPage } from 'chord/workbench/api/common/state/page';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';


export async function getMoreSongs(artist: IArtist, page: IPage): Promise<IGetMoreArtistSongsAct> {
    let songs = [];
    if (page.more) {
        songs = await aliMusicApi.artistSongs(artist.artistOriginalId, page.page + 1, page.size);
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
        albums = await aliMusicApi.artistAlbums(artist.artistOriginalId, page.page + 1, page.size);
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
