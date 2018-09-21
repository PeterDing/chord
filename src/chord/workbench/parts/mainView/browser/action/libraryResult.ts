'use strict';

import {
    IGetMoreLibrarySongsAct,
    IGetMoreLibraryAlbumsAct,
    IGetMoreLibraryArtistsAct,
    IGetMoreLibraryCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import { defaultUser } from 'chord/user/core/user';


export function getMoreSongs(keyword: string, offset: IOffset): IGetMoreLibrarySongsAct {
    let userSongs = [];
    if (offset.more) {
        userSongs = defaultUser.userSongs(offset.offset, offset.limit, keyword);
    }
    if (userSongs.length == 0) {
        offset.more = false;
    } else {
        offset.offset = userSongs[userSongs.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibrarySongs',
        act: 'c:mainView:getMoreLibrarySongs',
        songs: userSongs,
        songsOffset: offset,
    };
}

export function getMoreArtists(keyword: string, offset: IOffset): IGetMoreLibraryArtistsAct {
    let userArtists = [];
    if (offset.more) {
        userArtists = defaultUser.userArtists(offset.offset, offset.limit, keyword);
    }
    if (userArtists.length == 0) {
        offset.more = false;
    } else {
        offset.offset = userArtists[userArtists.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibraryArtists',
        act: 'c:mainView:getMoreLibraryArtists',
        artists: userArtists,
        artistsOffset: offset,
    };
}

export function getMoreAlbums(keyword: string, offset: IOffset): IGetMoreLibraryAlbumsAct {
        let userAlbums = [];
    if (offset.more) {
        userAlbums = defaultUser.userAlbums(offset.offset, offset.limit, keyword);
    }
    if (userAlbums.length == 0) {
        offset.more = false;
    } else {
        offset.offset = userAlbums[userAlbums.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibraryAlbums',
        act: 'c:mainView:getMoreLibraryAlbums',
        albums: userAlbums,
        albumsOffset: offset,
    };
}

export function getMoreCollections(keyword: string, offset: IOffset): IGetMoreLibraryCollectionsAct {
    let userCollections = [];
    if (offset.more) {
        userCollections = defaultUser.userCollections(offset.offset, offset.limit, keyword);
    }
    if (userCollections.length == 0) {
        offset.more = false;
    } else {
        offset.offset = userCollections[userCollections.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibraryCollections',
        act: 'c:mainView:getMoreLibraryCollections',
        collections: userCollections,
        collectionsOffset: offset,
    };
}
