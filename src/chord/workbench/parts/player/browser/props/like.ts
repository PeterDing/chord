'use strict';

import { ISong } from 'chord/music/api/song';

import { IAddLibrarySongAct } from 'chord/workbench/api/common/action/mainView';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface ILikeButtonProps {
    song: ISong;
    handleAddLibrarySong: (song: ISong) => IAddLibrarySongAct;
    handleRemoveFromLibrary: (item: ISong) => IRemoveFromLibraryAct;
}
