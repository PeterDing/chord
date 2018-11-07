'use strict';

import { ORIGIN } from 'chord/music/common/origin';

import { IUserProfile } from 'chord/music/api/user';

import { IOffset } from 'chord/workbench/api/common/state/offset';

import {
    IGetMoreUserFavoriteSongsAct,
    IGetMoreUserFavoriteArtistsAct,
    IGetMoreUserFavoriteAlbumsAct,
    IGetMoreUserFavoriteCollectionsAct,
    IGetMoreUserCreatedCollectionsAct,
    IGetMoreUserFollowingsAct,
} from 'chord/workbench/api/common/action/mainView';

import { makeOffsets, setCurrectOffset } from 'chord/workbench/api/utils/offset';

import { musicApi } from 'chord/music/core/api';


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
        let collectonsList = await Promise.all(futs);
        collections = collections.concat(...collectonsList).slice(0, size);
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
        let collectonsList = await Promise.all(futs);
        collections = collections.concat(...collectonsList).slice(0, size);
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

export async function getMoreFollowings(userProfile: IUserProfile, offset: IOffset, size: number = 10): Promise<IGetMoreUserFollowingsAct> {
    let followings = [];
    if (offset.more) {
        let offsets = makeOffsets(userProfile.origin, offset, size);
        let futs = offsets.map(_offset => musicApi.userFollowings(userProfile.userId, _offset.offset, _offset.limit, userProfile.userMid));
        let userProfilesList = await Promise.all(futs);
        followings = followings.concat(...userProfilesList).slice(0, size);
        offset = setCurrectOffset(userProfile.origin, offset, followings.length);
    }
    if (followings.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:getMoreUserFollowings',
        act: 'c:mainView:getMoreUserFollowings',
        followings: followings,
        followingsOffset: offset,
    };
}
