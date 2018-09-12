'use strict';

import { IArtist } from 'chord/music/api/artist';
import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';


export interface IArtistItemViewProps {
    artist: IArtist;

    handleShowArtistView: (artist: IArtist) => Promise<IShowArtistAct>;
    handlePlayArtist: (artist) => Promise<IPlayArtistAct>;
}
