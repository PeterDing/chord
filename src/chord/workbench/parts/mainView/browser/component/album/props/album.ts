'use strict';

import { IAlbum } from 'chord/music/api/album';
import { IPlayAlbumAct } from 'chord/workbench/api/common/action/player';

import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';


export interface IAlbumViewProps {
    album: IAlbum;
    handlePlayAlbum: (album: IAlbum) => Promise<IPlayAlbumAct>;
    handleShowArtistViewById: (artistId: string) => Promise<IShowArtistAct>;
}
