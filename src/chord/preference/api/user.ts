'use strict';

import { USER_LIBRARY_PATH } from 'chord/preference/common/user';

import { IAccount } from 'chord/music/api/user';


export interface IUserConfiguration {
    xiami?: { account: IAccount };
    netease?: { account: IAccount };
    qq?: { account: IAccount };

    libraryPath: string;
}


export function initiateUserConfiguration(): IUserConfiguration {
    return {
        libraryPath: USER_LIBRARY_PATH,
    };
}
