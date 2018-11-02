'use strict';

import { IUserProfile } from 'chord/music/api/user';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface IUserProfileViewState {
    // 'overview' | 'songs' | 'artists' | 'album' | 'favoriteCollections' | 'createdCollections' | 'followings'
    view: string;

    userProfile: IUserProfile;

    songsOffset: IOffset;
    artistsOffset: IOffset;
    albumsOffset: IOffset;
    favoriteCollectionsOffset: IOffset;
    createdCollectionsOffset: IOffset;
    followingsOffset: IOffset;
}

export function initiateUserProfileViewState(): IUserProfileViewState {
    return {
        view: 'overview',

        userProfile: null,

        songsOffset: initiateOffset(),
        artistsOffset: initiateOffset(),
        albumsOffset: initiateOffset(),
        favoriteCollectionsOffset: initiateOffset(),
        createdCollectionsOffset: initiateOffset(),
        followingsOffset: initiateOffset(),
    };
}
