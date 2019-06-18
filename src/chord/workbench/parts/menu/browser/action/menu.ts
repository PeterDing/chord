'use strict';

import * as React from 'react';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import {
    IShowSongMenuAct,
    IShowArtistMenuAct,
    IShowAlbumMenuAct,
    IShowCollectionMenuAct,
    IShowUserProfileMenuAct,

    IShowEpisodeMenuAct,
    IShowPodcastMenuAct,
    IShowRadioMenuAct,
} from 'chord/workbench/api/common/action/menu';


export function showSongMenu(e: React.MouseEvent<HTMLDivElement>, song: ISong): IShowSongMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showSongMenu',
        act: 'c:menu:showSongMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        song
    }
}

export function showArtistMenu(e: React.MouseEvent<HTMLDivElement>, artist: IArtist): IShowArtistMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showArtistMenu',
        act: 'c:menu:showArtistMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        artist
    }
}

export function showAlbumMenu(e: React.MouseEvent<HTMLDivElement>, album: IAlbum): IShowAlbumMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showAlbumMenu',
        act: 'c:menu:showAlbumMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        album
    }
}

export function showCollectionMenu(e: React.MouseEvent<HTMLDivElement>, collection: ICollection): IShowCollectionMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showCollectionMenu',
        act: 'c:menu:showCollectionMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        collection
    }
}

export function showUserProfileMenu(e: React.MouseEvent<HTMLDivElement>, userProfile: IUserProfile): IShowUserProfileMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showUserProfileMenu',
        act: 'c:menu:showUserProfileMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        userProfile
    }
}


// Sound

export function showEpisodeMenu(e: React.MouseEvent<HTMLDivElement>, episode: IEpisode): IShowEpisodeMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showEpisodeMenu',
        act: 'c:menu:showEpisodeMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        episode
    }
}

export function showPodcastMenu(e: React.MouseEvent<HTMLDivElement>, podcast: IPodcast): IShowPodcastMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showPodcastMenu',
        act: 'c:menu:showPodcastMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        podcast
    }
}

export function showRadioMenu(e: React.MouseEvent<HTMLDivElement>, radio: IRadio): IShowRadioMenuAct {
    e.preventDefault();
    return {
        type: 'c:menu:showRadioMenu',
        act: 'c:menu:showRadioMenu',

        top: e.screenY - 50,
        left: e.screenX - 50,
        radio
    }
}
