'use strict';

import * as React from 'react';

import { IUserProfile } from 'chord/music/api/user';
import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayUserSongsAct } from 'chord/workbench/api/common/action/player';
import { IShowUserProfileMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IUserProfileItemViewProps {
    userProfile: IUserProfile;

    handleShowUserProfileView: (userProfile: IUserProfile) => Promise<IShowUserProfileAct>;
    handlePlayUserSongs: (userProfile) => Promise<IPlayUserSongsAct>;
    showUserProfileMenu: (e: React.MouseEvent<HTMLDivElement>, userProfile: IUserProfile) => IShowUserProfileMenuAct;
}
