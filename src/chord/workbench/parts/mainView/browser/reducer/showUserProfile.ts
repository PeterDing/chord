'use strict';

import { equal } from 'chord/base/common/assert';

import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';

import { IUserProfileViewState } from 'chord/workbench/api/common/state/mainView/userProfileView';


export function showUserProfile(state: IUserProfileViewState, act: IShowUserProfileAct): IUserProfileViewState {
    equal(act.act, 'c:mainView:showUserProfileView');

    return { 
        view: 'overview',
        userProfile: act.userProfile,

        songsOffset: act.songsOffset,
        artistsOffset: act.artistsOffset,
        albumsOffset: act.albumsOffset,
        favoriteCollectionsOffset: act.favoriteCollectionsOffset,
        createdCollectionsOffset: act.createdCollectionsOffset,
        followingsOffset: act.followingsOffset,
    };
}

