'use strict';

import * as React from 'react';

import { ISong } from 'chord/music/api/song';

import { IShowArtistAct, IShowAlbumAct } from 'chord/workbench/api/common/action/mainView';
import { IAddLibrarySongAct } from 'chord/workbench/api/common/action/mainView';
import { IRemoveFromLibraryAct } from 'chord/workbench/api/common/action/mainView';
import { IPlayAct } from 'chord/workbench/api/common/action/player';

import { IPlayerState } from 'chord/workbench/api/common/state/player';


export interface IPlayListButtomProps {
    playListContent: React.RefObject<HTMLDivElement>;
}


export interface IPlayListContentProps extends IPlayerState {
    handlePlay: (index: number) => Promise<IPlayAct>;
}


export interface IPlayListSongDetailProps {
    song: ISong;
    handleShowArtistViewById: (artistId: string) => Promise<IShowArtistAct>;
    handleShowAlbumViewById: (albumId: string) => Promise<IShowAlbumAct>;
    handleAddLibrarySong: (song: ISong) => IAddLibrarySongAct;
    handleRemoveFromLibrary: (item: ISong) => IRemoveFromLibraryAct;

    lyricOn: boolean;
    toggleLyric: () => void;
}
