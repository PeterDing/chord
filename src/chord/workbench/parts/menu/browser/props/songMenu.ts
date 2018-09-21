'use strict';

import { ISong } from 'chord/music/api/song';

import { IAddLibrarySongAct } from 'chord/workbench/api/common/action/mainView';


export interface ISongMenuProps {
    view: string;

    top: number;
    left: number;
    song: ISong;

    handleAddLibrarySong: (song) => IAddLibrarySongAct;
}
