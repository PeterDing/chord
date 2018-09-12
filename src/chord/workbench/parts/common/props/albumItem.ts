'use strict';

import { IAlbum } from 'chord/music/api/album';
import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';
import { IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';


export interface IAlbumItemViewProps {
    album: IAlbum;
    handlePlayAlbum: (album: IAlbum) => Promise<IPlayAlbumAct>;
    handleShowAlbumView: (album: IAlbum) => Promise<IShowAlbumAct>;
}
