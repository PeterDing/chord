'use strict';

import { TPlayItem } from 'chord/unity/api/items';

import { IAddLibrarySongAct, IAddLibraryEpisodeAct } from 'chord/workbench/api/common/action/mainView';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';


export interface ILikeButtonProps {
    playItem: TPlayItem;

    handleAddLibrarySong: (playItem: TPlayItem) => IAddLibrarySongAct;
    handleAddLibraryEpisode: (playItem: TPlayItem) => IAddLibraryEpisodeAct;

    handleRemoveFromLibrary: (item: TPlayItem) => IRemoveFromLibraryAct;
}
