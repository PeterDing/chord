'use strict';

import { equal } from 'chord/base/common/assert';

import {
    IShowSongMenuAct,
    IShowArtistMenuAct,
    IShowAlbumMenuAct,
    IShowCollectionMenuAct,
    IShowUserProfileMenuAct,
} from 'chord/workbench/api/common/action/menu';

import { ISongMenuState } from 'chord/workbench/api/common/state/menu/songMenu';
import { IArtistMenuState } from 'chord/workbench/api/common/state/menu/artistMenu';
import { IAlbumMenuState } from 'chord/workbench/api/common/state/menu/albumMenu';
import { ICollectionMenuState } from 'chord/workbench/api/common/state/menu/collectionMenu';
import { IUserProfileMenuState } from 'chord/workbench/api/common/state/menu/userProfileMenu';


export function showSongMenu(state: ISongMenuState, act: IShowSongMenuAct): ISongMenuState {
    equal(act.act, 'c:menu:showSongMenu');

    return {
        top: act.top,
        left: act.left,
        song: act.song,
    }
}

export function showArtistMenu(state: IArtistMenuState, act: IShowArtistMenuAct): IArtistMenuState {
    equal(act.act, 'c:menu:showArtistMenu');

    return {
        top: act.top,
        left: act.left,
        artist: act.artist,
    }
}

export function showAlbumMenu(state: IAlbumMenuState, act: IShowAlbumMenuAct): IAlbumMenuState {
    equal(act.act, 'c:menu:showAlbumMenu');

    return {
        top: act.top,
        left: act.left,
        album: act.album,
    }
}

export function showCollectionMenu(state: ICollectionMenuState, act: IShowCollectionMenuAct): ICollectionMenuState {
    equal(act.act, 'c:menu:showCollectionMenu');

    return {
        top: act.top,
        left: act.left,
        collection: act.collection,
    }
}

export function showUserProfileMenu(state: IUserProfileMenuState, act: IShowUserProfileMenuAct): IUserProfileMenuState {
    equal(act.act, 'c:menu:showUserProfileMenu');

    return {
        top: act.top,
        left: act.left,
        userProfile: act.userProfile,
    }
}
