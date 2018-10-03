'use strict';

import { IAlbum } from 'chord/music/api/album';

import { IAddLibraryAlbumAct } from 'chord/workbench/api/common/action/mainView';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface IAlbumMenuProps {
    view: string;

    top: number;
    left: number;
    album: IAlbum;

    handleAddLibraryAlbum: (album) => IAddLibraryAlbumAct;
    handleAddToQueue: (item: IAlbum, direction: string) => Promise<IAddToQueueAct>;
    handleRemoveFromLibrary: (item: IAlbum) => IRemoveFromLibraryAct;
}

