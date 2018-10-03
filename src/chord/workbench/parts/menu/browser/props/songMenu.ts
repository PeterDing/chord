'use strict';

import { ISong } from 'chord/music/api/song';

import { IAddLibrarySongAct } from 'chord/workbench/api/common/action/mainView';
import { IAddToQueueAct } from 'chord/workbench/api/common/action/player';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface ISongMenuProps {
    view: string;

    top: number;
    left: number;
    song: ISong;

    handleAddLibrarySong: (song: ISong) => IAddLibrarySongAct;
    handleAddToQueue: (item: ISong, direction: string) => Promise<IAddToQueueAct>;
    handleRemoveFromLibrary: (item: ISong) => IRemoveFromLibraryAct;
}
