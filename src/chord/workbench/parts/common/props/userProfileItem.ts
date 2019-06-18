'use strict';

import { IUserProfile } from 'chord/music/api/user';
import { IShowUserProfileAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';
import { IShowUserProfileMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IUserProfileItemViewProps {
    userProfile: IUserProfile;

    handleShowUserProfileView: (userProfile: IUserProfile) => Promise<IShowUserProfileAct>;
    handlePlayUserFavoriteSongs: (userProfile) => Promise<IPlayUserFavoriteSongsAct>;
    showUserProfileMenu: (e: React.MouseEvent<HTMLDivElement>, userProfile: IUserProfile) => IShowUserProfileMenuAct;
}
