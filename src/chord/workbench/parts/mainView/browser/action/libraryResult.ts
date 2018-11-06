'use strict';

import { IOffset } from 'chord/workbench/api/common/state/offset';

import {
    IGetMoreLibrarySongsAct,
    IGetMoreLibraryAlbumsAct,
    IGetMoreLibraryArtistsAct,
    IGetMoreLibraryCollectionsAct,
    IGetMoreLibraryUserProfilesAct,
} from 'chord/workbench/api/common/action/mainView';

import { defaultLibrary } from 'chord/library/core/library';


export function getMoreSongs(keyword: string, offset: IOffset, size: number = 10): IGetMoreLibrarySongsAct {
    let librarySongs = [];
    if (offset.more) {
        librarySongs = defaultLibrary.librarySongs(offset.offset, size, keyword);
    }
    if (librarySongs.length == 0) {
        offset.more = false;
    } else {
        // offset = lastId
        offset.offset = librarySongs[librarySongs.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibrarySongs',
        act: 'c:mainView:getMoreLibrarySongs',
        songs: librarySongs,
        songsOffset: offset,
    };
}

export function getMoreArtists(keyword: string, offset: IOffset, size: number = 10): IGetMoreLibraryArtistsAct {
    let userArtists = [];
    if (offset.more) {
        userArtists = defaultLibrary.libraryArtists(offset.offset, size, keyword);
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

export function getMoreAlbums(keyword: string, offset: IOffset, size: number = 10): IGetMoreLibraryAlbumsAct {
        let userAlbums = [];
    if (offset.more) {
        userAlbums = defaultLibrary.libraryAlbums(offset.offset, size, keyword);
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

export function getMoreCollections(keyword: string, offset: IOffset, size: number = 10): IGetMoreLibraryCollectionsAct {
    let userCollections = [];
    if (offset.more) {
        userCollections = defaultLibrary.libraryCollections(offset.offset, size, keyword);
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

export function getMoreUserProfiles(keyword: string, offset: IOffset, size: number = 10): IGetMoreLibraryUserProfilesAct {
    let userProfile = [];
    if (offset.more) {
        userProfile = defaultLibrary.libraryUserProfiles(offset.offset, size, keyword);
    }
    if (userProfile.length == 0) {
        offset.more = false;
    } else {
        offset.offset = userProfile[userProfile.length - 1].id;
    }
    return {
        type: 'c:mainView:getMoreLibraryUserProfiles',
        act: 'c:mainView:getMoreLibraryUserProfiles',
        userProfiles: userProfile,
        userProfilesOffset: offset,
    };
}
