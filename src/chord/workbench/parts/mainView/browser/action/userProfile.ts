'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IUserProfile } from 'chord/music/api/user';

import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';

import {
    IGetMoreUserFavoriteSongsAct,
    IGetMoreUserFavoriteArtistsAct,
    IGetMoreUserFavoriteAlbumsAct,
    IGetMoreUserFavoriteCollectionsAct,
    IGetMoreUserCreatedCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';

import { musicApi } from 'chord/music/core/api';


function makeOffsets(origin: string, offset: IOffset, size: number): Array<IOffset> {
    const findPages = (page: number, size: number, total: number, offsets: Array<IOffset>): void => {
        let nowOffset = page * size;
        if (nowOffset >= total) {
            return;
        }
        if (page == 0) {
            let _offset = initiateOffset();
            _offset.offset = 1;
            _offset.limit = size;
            offsets.push(_offset);
            return;
        }

        // max size is 100 for xiami music
        let chunk = 100;
        while (true) {
            if ((nowOffset % chunk == 0) && (nowOffset + chunk <= total)) {
                let _offset = initiateOffset();
                _offset.offset = nowOffset / chunk + 1;
                _offset.limit = chunk;
                offsets.push(_offset);
                findPages(1, nowOffset + chunk, total, offsets);
                return;
            } else {
                chunk -= 10;
            }
        }
    };

    let offsets = [];
    let total;
    switch (origin) {
        case ORIGIN.xiami:
            total = offset.offset * offset.limit + size;
            findPages(offset.offset, offset.limit, total, offsets);
            break;
        case ORIGIN.netease:
        case ORIGIN.qq:
            // TODO: user's favorites do not need offset * limit in apis
            let _offset = initiateOffset();
            _offset.offset = offset.offset;
            _offset.limit = size;
            offsets.push(_offset);
            break;
    }
    return offsets;
}

function setCurrectOffset(origin: string, offset: IOffset, size: number): IOffset {
    let total;
    let _offset;
    switch (origin) {
        case ORIGIN.xiami:
            total = offset.offset * offset.limit + size;
            _offset = initiateOffset();
            _offset.offset = total % 10 == 0 ? total / 10 : Math.floor(total / 10) + 1;
            _offset.limit = 10;
            break;
        case ORIGIN.netease:
        case ORIGIN.qq:
            _offset = initiateOffset();
            _offset.offset = offset.offset + size;
            _offset.limit = 0;
            break;
    }
    return _offset;
}


// size: how many items to be get
export async function getMoreFavoriteSongs(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserFavoriteSongsAct> {
    let songs = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userFavoriteSongs(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let songsList = await Promise.all(futs);

        songs = songs.concat(...songsList);
        // user favorite songs api of netease does not support offset
        if (userProfile.origin != ORIGIN.netease) {
            songs = songs.slice(0, size);
        }

        offset = setCurrectOffset(userProfile.origin, offset, songs.length);
    }

    // user favorite songs api of netease does not support offset
    if (songs.length == 0 || userProfile.origin == ORIGIN.netease) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserFavoriteSongs',
        act: 'c:mainView:getMoreUserFavoriteSongs',
        songs: songs,
        songsOffset: offset,
    };
}

export async function getMoreFavoriteArtists(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserFavoriteArtistsAct> {
    let artists = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userFavoriteArtists(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let artistsList = await Promise.all(futs);
        artists = artists.concat(...artistsList).slice(0, size);
        offset = setCurrectOffset(userProfile.origin, offset, artists.length);
    }
    if (artists.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserFavoriteArtists',
        act: 'c:mainView:getMoreUserFavoriteArtists',
        artists: artists,
        artistsOffset: offset,
    };
}

export async function getMoreFavoriteAlbums(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserFavoriteAlbumsAct> {
    let albums = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userFavoriteAlbums(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let albumsList = await Promise.all(futs);
        albums = albums.concat(...albumsList).slice(0, size);
        offset = setCurrectOffset(userProfile.origin, offset, albums.length);
    }
    if (albums.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserFavoriteAlbums',
        act: 'c:mainView:getMoreUserFavoriteAlbums',
        albums: albums,
        albumsOffset: offset,
    };
}

export async function getMoreFavoriteCollections(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserFavoriteCollectionsAct> {
    let collections = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userFavoriteCollections(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let albumsList = await Promise.all(futs);
        collections = collections.concat(...albumsList).slice(0, size);
        offset = setCurrectOffset(userProfile.origin, offset, collections.length);
    }
    if (collections.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserFavoriteCollections',
        act: 'c:mainView:getMoreUserFavoriteCollections',
        collections: collections,
        collectionsOffset: offset,
    };
}

export async function getMoreCreatedCollections(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserCreatedCollectionsAct> {
    let collections = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userCreatedCollections(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let albumsList = await Promise.all(futs);
        collections = collections.concat(...albumsList).slice(0, size);
        offset = setCurrectOffset(userProfile.origin, offset, collections.length);
    }
    if (collections.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserCreatedCollections',
        act: 'c:mainView:getMoreUserCreatedCollections',
        collections: collections,
        collectionsOffset: offset,
    };
}
