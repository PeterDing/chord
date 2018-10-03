'use strict';

import { IArtist } from 'chord/music/api/artist';

import { IAddLibraryArtistAct } from 'chord/workbench/api/common/action/mainView';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface IArtistMenuProps {
    view: string;

    top: number;
    left: number;
    artist: IArtist;

    handleAddLibraryArtist: (artist) => IAddLibraryArtistAct;
    handleAddToQueue: (item: IArtist, direction: string) => Promise<IAddToQueueAct>;
    handleRemoveFromLibrary: (item: IArtist) => IRemoveFromLibraryAct;
}
