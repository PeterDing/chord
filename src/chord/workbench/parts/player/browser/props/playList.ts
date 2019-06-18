'use strict';

import * as React from 'react';

import { TPlayItem } from 'chord/unity/api/items';

import { IShowArtistAct, IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';
import { IAddLibrarySongAct, IAddLibraryEpisodeAct } from 'chord/workbench/api/common/action/mainView';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayAct } from 'chord/workbench/api/common/action/player';

import { IPlayerState } from 'chord/workbench/api/common/state/player';


export interface IPlayListButtomProps {
    playListContent: React.RefObject<HTMLDivElement>;
}


export interface IPlayListContentProps extends IPlayerState {
    handlePlay: (index: number) => Promise<IPlayAct>;
}


export interface IPlayListItemDetailProps {
    playItem: TPlayItem;
    handleShowArtistViewById: (artistId: string) => Promise<IShowArtistAct>;
    handleShowAlbumViewById: (albumId: string) => Promise<IShowAlbumAct>;
    handleAddLibrarySong: (playItem: TPlayItem) => IAddLibrarySongAct;

    handleAddLibraryEpisode: (playItem: TPlayItem) => IAddLibraryEpisodeAct;

    handleRemoveFromLibrary: (item: TPlayItem) => IRemoveFromLibraryAct;

    lyricOn: boolean;
    toggleLyric: () => void;
}
