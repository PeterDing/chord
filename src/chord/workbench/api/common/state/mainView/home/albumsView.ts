'use strict';

import { IAlbum } from 'chord/music/api/album';
import { IListOption } from 'chord/music/api/listOption';
import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface IAlbumsViewState {
    // 'options' | 'albums'
    view: string;

    origin: string;

    optionsSet: { [origin: string]: Array<IListOption> };

    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}


export function initiateAlbumsViewState(): IAlbumsViewState {
    return {
        view: 'options',

        origin: null,

        optionsSet: {},

        albums: [],
        albumsOffset: initiateOffset(),
    };
}
