'use strict';

import * as React from 'react';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import {
    IShowSongMenuAct,
    IShowArtistMenuAct,
    IShowAlbumMenuAct,
    IShowCollectionMenuAct,
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
