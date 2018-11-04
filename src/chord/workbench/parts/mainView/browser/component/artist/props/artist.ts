'use strict';

import { IArtist } from 'chord/music/api/artist';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import { IGetMoreArtistSongsAct, IGetMoreArtistAlbumsAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';
import { IShowArtistMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IArtistViewProps {
    // 'overview' | 'songs' | 'albums'
    // For searching result navigation
    view: string;

    artist: IArtist;

    songsOffset: IOffset;
    albumsOffset: IOffset;

    getMoreSongs: (artist, offset, size) => Promise<IGetMoreArtistSongsAct>;
    getMoreAlbums: (artist, offset, size) => Promise<IGetMoreArtistAlbumsAct>;
    handlePlayArtist: (artist) => Promise<IPlayArtistAct>;
    showArtistMenu: (e: React.MouseEvent<HTMLDivElement>, artist: IArtist) => IShowArtistMenuAct;
}
