'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';


export interface IShowSongMenuAct extends Act {
    // 'c:menu:showSongMenu'
    type: string;
    act: string;

    top: number;
    left: number;

    song: ISong;
}

export interface IShowArtistMenuAct extends Act {
    // 'c:menu:showArtistMenu'
    type: string;
    act: string;

    top: number;
    left: number;

    artist: IArtist;
}

export interface IShowAlbumMenuAct extends Act {
    // 'c:menu:showAlbumMenu'
    type: string;
    act: string;

    top: number;
    left: number;

    album: IAlbum;
}

export interface IShowCollectionMenuAct extends Act {
    // 'c:menu:showCollectionMenu'
    type: string;
    act: string;

    top: number;
    left: number;

    collection: ICollection;
}

export interface IShowUserProfileMenuAct extends Act {
    // 'c:menu:showUserProfileMenu'
    type: string;
    act: string;

    top: number;
    left: number;

    userProfile: IUserProfile;
}
