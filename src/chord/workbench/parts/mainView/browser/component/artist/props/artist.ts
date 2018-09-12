'use strict';

import { IArtist } from 'chord/music/api/artist';
import { IPage } from 'chord/workbench/api/common/state/page';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';


export interface IArtistViewProps {
    // 'overview' | 'songs' | 'albums'
    // For searching result navigation
    view: string;

    artist: IArtist;

    songsPage: IPage;
    albumsPage: IPage;

    getMoreSongs: (artist, page) => Promise<IGetMoreArtistSongsAct>;
    getMoreAlbums: (artist, page) => Promise<IGetMoreArtistAlbumsAct>;
    handlePlayArtist: (artist) => Promise<IPlayArtistAct>;
}
