'use strict';

import { IUserProfile } from "chord/music/api/user";


export interface ILibraryUserProfile {
    // id for database
    id: number;
    addAt: number;  // millisecond
    userProfile: IUserProfile;
}

