'use strict';

import { ISong } from 'chord/music/api/song';
import { IArtist } from 'chord/music/api/artist';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';


export interface IUserProfile {
    userId: string;

    // 'userProfile'
    type: string;

    origin: string;

    userOriginalId?: string;

    // for qq music
    userMid?: string;

    url?: string;

    userName?: string;


    userAvatarUrl?: string;
    userAvatarPath?: string;

    followersCount?: number;
    followingsCount?: number;

    followers?: Array<IUserProfile>;
    followings?: Array<IUserProfile>;

    listenCount?: number;

    songCount?: number;
    artistCount?: number;
    albumCount?: number;
    createdCollectionCount?: number;
    favoriteCollectionCount?: number;

    songs?: Array<ISong>;
    artists?: Array<IArtist>;
    albums?: Array<IAlbum>;
    createdCollections?: Array<ICollection>;
    favoriteCollections?: Array<ICollection>;

    description?: string;

    like?: boolean;
}


export interface IAccount {
    user: IUserProfile;

    // 'account'
    type: string;

    accessToken?: string;
    refreshToken?: string;

    cookies?: { [key: string]: string };
}
