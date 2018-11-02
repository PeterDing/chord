'use strict';

import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';

import { IUserProfile } from 'chord/music/api/user';

import {
    getMoreFavoriteSongs,
    getMoreFavoriteArtists,
    getMoreFavoriteAlbums,
    getMoreFavoriteCollections,
    getMoreCreatedCollections,
} from 'chord/workbench/parts/mainView/browser/action/userProfile';
import { initiateOffset } from 'chord/workbench/api/common/state/offset';

import { musicApi } from 'chord/music/core/api';


export async function handleShowUserProfileView(userProfile: IUserProfile): Promise<IShowUserProfileAct> {
    let { songs, songsOffset } = await getMoreFavoriteSongs(userProfile, initiateOffset());
    let { artists, artistsOffset } = await getMoreFavoriteArtists(userProfile, initiateOffset());
    let { albums, albumsOffset } = await getMoreFavoriteAlbums(userProfile, initiateOffset());
    let { collections: favoriteCollections, collectionsOffset: favoriteCollectionsOffset } = await getMoreFavoriteCollections(userProfile, initiateOffset());
    let { collections: createdCollections, collectionsOffset: createdCollectionsOffset } = await getMoreCreatedCollections(userProfile, initiateOffset());

    userProfile.songs = songs;
    userProfile.artists = artists;
    userProfile.albums = albums;
    userProfile.favoriteCollections = favoriteCollections;
    userProfile.createdCollections = createdCollections;

    return {
        type: 'c:mainView:showUserProfileView',
        act: 'c:mainView:showUserProfileView',
        userProfile,
        songsOffset,
        artistsOffset,
        albumsOffset,
        favoriteCollectionsOffset,
        createdCollectionsOffset,
    };
}


export async function handleShowUserProfileViewById(userId: string): Promise<IShowUserProfileAct> {
    let userProfile = await musicApi.userProfile(userId);
    return handleShowUserProfileView(userProfile);
}
