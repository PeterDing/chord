'use strict';

import { IAlbum } from 'chord/music/api/album';

import { IAddLibraryAlbumAct } from 'chord/workbench/api/common/action/mainView';


export interface IAlbumMenuProps {
    view: string;

    top: number;
    left: number;
    album: IAlbum;

    handleAddLibraryAlbum: (album) => IAddLibraryAlbumAct;
}

