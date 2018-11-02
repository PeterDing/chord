'use strict';

import { IUserProfile } from 'chord/music/api/user';


export interface IUserProfileMenuState {
    top: number;
    left: number;

    userProfile: IUserProfile;
}


export function initiateUserProfileMenuState(): IUserProfileMenuState {
    return {
        top: 0,
        left: 0,
        userProfile: null,
    };
}
