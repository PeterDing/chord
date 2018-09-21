'use strict';

import * as React from 'react';

import { IArtist } from 'chord/music/api/artist';
import { IShowArtistAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayArtistAct } from 'chord/workbench/api/common/action/player';
import { IShowArtistMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IArtistItemViewProps {
    artist: IArtist;

    handleShowArtistView: (artist: IArtist) => Promise<IShowArtistAct>;
    handlePlayArtist: (artist) => Promise<IPlayArtistAct>;
    showArtistMenu: (e: React.MouseEvent<HTMLDivElement>, artist: IArtist) => IShowArtistMenuAct;
}
