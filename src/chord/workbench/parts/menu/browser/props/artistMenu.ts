'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IAddLibraryArtistAct } from 'chord/workbench/api/common/action/mainView';


export interface IArtistMenuProps {
    view: string;

    top: number;
    left: number;
    artist: IArtist;

    handleAddLibraryArtist: (artist) => IAddLibraryArtistAct;
}
