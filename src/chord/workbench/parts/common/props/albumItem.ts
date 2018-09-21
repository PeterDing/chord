'use strict';

import * as React from 'react';

import { IAlbum } from 'chord/music/api/album';
import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';
import { IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';
import { IShowAlbumMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IAlbumItemViewProps {
    album: IAlbum;
    handlePlayAlbum: (album: IAlbum) => Promise<IPlayAlbumAct>;
    handleShowAlbumView: (album: IAlbum) => Promise<IShowAlbumAct>;
    showAlbumMenu: (e: React.MouseEvent<HTMLDivElement>, album: IAlbum) => IShowAlbumMenuAct;
}
