'use strict';

import { IUserProfile } from 'chord/music/api/user';

import { IAddLibraryUserProfileAct } from 'chord/workbench/api/common/action/mainView';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface IUserProfileMenuProps {
    view: string;

    top: number;
    left: number;
    userProfile: IUserProfile;

    handleAddLibraryUserProfile: (userProfile) => IAddLibraryUserProfileAct;
    handleAddToQueue: (item: IUserProfile, direction: string) => Promise<IAddToQueueAct>;
    handleRemoveFromLibrary: (item: IUserProfile) => IRemoveFromLibraryAct;
}
