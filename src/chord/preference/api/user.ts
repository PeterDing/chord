'use strict';

import { USER_LIBRARY_PATH } from 'chord/preference/common/user';

import { IAccount } from 'chord/music/api/user';


export interface IOriginConfiguration {
    account: IAccount;
    syncAddRemove: boolean;
}


export interface IUserConfiguration {
    xiami?: IOriginConfiguration;
    netease?: IOriginConfiguration;
    qq?: IOriginConfiguration;

    libraryPath: string;
}


export function initiateUserConfiguration(): IUserConfiguration {
    return {
        libraryPath: USER_LIBRARY_PATH,
    };
}
