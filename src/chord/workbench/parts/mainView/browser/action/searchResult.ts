'use strict';

import { aliMusicApi } from 'chord/music/xiami/api';
import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';
import { IPage } from 'chord/workbench/api/common/state/page';


export async function searchMoreSongs(keyword: string, page: IPage): Promise<ISearchMoreSongsAct> {
    let songs = [];
    if (page.more) {
        songs = await aliMusicApi.searchSongs(keyword, page.page + 1, page.size);
        page.page += 1;
    }
    if (songs.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:searchMoreSongs',
        act: 'c:mainView:searchMoreSongs',
        keyword,
        songs,
        songsPage: page,
    };
}

export async function searchMoreAlbums(keyword: string, page: IPage): Promise<ISearchMoreAlbumsAct> {
    let albums = [];
    if (page.more) {
        albums = await aliMusicApi.searchAlbums(keyword, page.page + 1, page.size);
        page.page += 1;
    }
    if (albums.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:searchMoreAlbums',
        act: 'c:mainView:searchMoreAlbums',
        keyword,
        albums,
        albumsPage: page,
    };
}

export async function searchMoreArtists(keyword: string, page: IPage): Promise<ISearchMoreArtistsAct> {
    let artists = [];
    if (page.more) {
        artists = await aliMusicApi.searchArtists(keyword, page.page + 1, page.size);
        page.page += 1;
    }
    if (artists.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:searchMoreArtists',
        act: 'c:mainView:searchMoreArtists',
        keyword,
        artists,
        artistsPage: page,
    };
}

export async function searchMoreCollections(keyword: string, page: IPage): Promise<ISearchMoreCollectionsAct> {
    let collections = [];
    if (page.more) {
        collections = await aliMusicApi.searchCollections(keyword, page.page + 1, page.size);
        page.page += 1;
    }
    if (collections.length == 0) {
        page.more = false;
    }
    return {
        type: 'c:mainView:searchMoreCollections',
        act: 'c:mainView:searchMoreCollections',
        keyword,
        collections,
        collectionsPage: page,
    };
}
