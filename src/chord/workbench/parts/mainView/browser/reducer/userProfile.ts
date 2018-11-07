'use strict';

import { equal } from 'chord/base/common/assert';

import {
    IGetMoreUserFavoriteSongsAct,
    IGetMoreUserFavoriteAlbumsAct,
    IGetMoreUserFavoriteArtistsAct,
    IGetMoreUserFavoriteCollectionsAct,
    IGetMoreUserCreatedCollectionsAct,
    IGetMoreUserFollowingsAct,
} from 'chord/workbench/api/common/action/mainView';

import { IUserProfileViewState } from 'chord/workbench/api/common/state/mainView/userProfileView';


export function getMoreUserFavoriteSongs(state: IUserProfileViewState, act: IGetMoreUserFavoriteSongsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserFavoriteSongs');

    let songsOffset = act.songsOffset;
    let songs = [...state.userProfile.songs, ...act.songs];
    let userProfile = { ...state.userProfile, songs };
    return { ...state, userProfile, songsOffset };
}

export function getMoreUserFavoriteArtists(state: IUserProfileViewState, act: IGetMoreUserFavoriteArtistsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserFavoriteArtists');

    let artistsOffset = act.artistsOffset;
    let artists = [...state.userProfile.artists, ...act.artists];
    let userProfile = { ...state.userProfile, artists };
    return { ...state, userProfile, artistsOffset };
}

export function getMoreUserFavoriteAlbums(state: IUserProfileViewState, act: IGetMoreUserFavoriteAlbumsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserFavoriteAlbums');

    let albumsOffset = act.albumsOffset;
    let albums = [...state.userProfile.albums, ...act.albums];
    let userProfile = { ...state.userProfile, albums };
    return { ...state, userProfile, albumsOffset };
}

export function getMoreUserFavoriteCollections(state: IUserProfileViewState, act: IGetMoreUserFavoriteCollectionsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserFavoriteCollections');

    let favoriteCollectionsOffset = act.collectionsOffset;
    let favoriteCollections = [...state.userProfile.favoriteCollections, ...act.collections];
    let userProfile = { ...state.userProfile, favoriteCollections };
    return { ...state, userProfile, favoriteCollectionsOffset };
}

export function getMoreUserCreatedCollections(state: IUserProfileViewState, act: IGetMoreUserCreatedCollectionsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserCreatedCollections');

    let createdCollectionsOffset = act.collectionsOffset;
    let createdCollections = [...state.userProfile.createdCollections, ...act.collections];
    let userProfile = { ...state.userProfile, createdCollections };
    return { ...state, userProfile, createdCollectionsOffset };
}

export function getMoreUserFollowings(state: IUserProfileViewState, act: IGetMoreUserFollowingsAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:getMoreUserFollowings');

    let followingsOffset = act.followingsOffset;
    let followings = [...state.userProfile.followings, ...act.followings];
    let userProfile = { ...state.userProfile, followings };
    return { ...state, userProfile, followingsOffset };
}
