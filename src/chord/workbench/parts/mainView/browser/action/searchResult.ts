'use strict';

import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import { musicApi } from 'chord/music/core/api';


export async function searchMoreSongs(keyword: string, offset: IOffset): Promise<ISearchMoreSongsAct> {
    let songs = [];
    if (offset.more) {
        songs = await musicApi.searchSongs(keyword, offset.offset, offset.limit);
        offset.offset += 1;
    }
    if (songs.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreSongs',
        act: 'c:mainView:searchMoreSongs',
        keyword,
        songs,
        songsOffset: offset,
    };
}

export async function searchMoreAlbums(keyword: string, offset: IOffset): Promise<ISearchMoreAlbumsAct> {
    let albums = [];
    if (offset.more) {
        albums = await musicApi.searchAlbums(keyword, offset.offset, offset.limit);
        offset.offset += 1;
    }
    if (albums.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreAlbums',
        act: 'c:mainView:searchMoreAlbums',
        keyword,
        albums,
        albumsOffset: offset,
    };
}

export async function searchMoreArtists(keyword: string, offset: IOffset): Promise<ISearchMoreArtistsAct> {
    let artists = [];
    if (offset.more) {
        artists = await musicApi.searchArtists(keyword, offset.offset, offset.limit);
        offset.offset += 1;
    }
    if (artists.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreArtists',
        act: 'c:mainView:searchMoreArtists',
        keyword,
        artists,
        artistsOffset: offset,
    };
}

export async function searchMoreCollections(keyword: string, offset: IOffset): Promise<ISearchMoreCollectionsAct> {
    let collections = [];
    if (offset.more) {
        collections = await musicApi.searchCollections(keyword, offset.offset, offset.limit);
        offset.offset += 1;
    }
    if (collections.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreCollections',
        act: 'c:mainView:searchMoreCollections',
        keyword,
        collections,
        collectionsOffset: offset,
    };
}
