'use strict';

import { ISong } from 'chord/music/api/song';
import {IPlayAct} from 'chord/workbench/api/common/action/player';


export interface IPlayListProps {
    index: number;
    playList: Array<ISong>;
    handlePlay: (index: number) => IPlayAct;
}

export interface ISongItemProps {
    song: ISong;
    index: number;
    currentlyPlaying: boolean;
    handlePlay: (index: number) => IPlayAct;
}
