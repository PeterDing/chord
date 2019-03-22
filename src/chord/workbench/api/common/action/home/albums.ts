'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { IListOption } from 'chord/music/api/listOption';

import { IAlbum } from 'chord/music/api/album';

import { IOffset } from 'chord/workbench/api/common/state/offset';


export interface IShowAlbumListOptionsViewAct extends Act {
    // 'c:mainView:home:showAlbumListOptionsView'
    type: string;
    act: string;

    optionsSet: { [origin: string]: Array<IListOption> };
}

export interface IShowAlbumListViewAct extends Act {
    // 'c:mainView:home:showAlbumListView'
    type: string;
    act: string;

    origin: string;

    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreAlbumsAct extends Act {
    // 'c:mainView:home:albums:getMoreAlbums'
    type: string;
    act: string;

    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}
