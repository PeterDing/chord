'use strict';

import { ISong } from 'chord/music/api/song';
import { IPlayOneAct } from 'chord/workbench/api/common/action/player';
import { IShowArtistAct, IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';


export interface ISongItemViewProps {
    /**
     * An active song is playing or selected
     */
    active: boolean;

    /**
     * If short is true, no showing artist name and album name
     */
    short: boolean;
    song: ISong;
    handlePlay: () => any | null;
    handlePlayOne: (song: ISong) => IPlayOneAct;
    handleShowArtistViewById: (artistId: string) => Promise<IShowArtistAct>;
    handleShowAlbumViewById: (albumId: string) => Promise<IShowAlbumAct>;
}
