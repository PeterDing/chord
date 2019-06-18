'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { TPlayItem } from 'chord/unity/api/items';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { IPodcast } from 'chord/sound/api/podcast';


export interface IPlayAct extends Act {
    // 'c:player:play'

    // type is key that must be included
    // In chord, type is equal act
    type: string;
    act: string;
    index: number;
}

/**
 * Play one TPlayItem once
 */
export interface IPlayOneAct extends Act {
    // 'c:player:playOne'

    type: string;
    act: string;
    playItem: TPlayItem;
}

/**
 * Play many TPlayItem once
 */
export interface IPlayManyAct extends Act {
    // 'c:player:playMany'

    type: string;
    act: string;
    playItems: Array<TPlayItem>;
}

/**
 * Play top songs of an artist once
 */
export interface IPlayArtistAct extends Act {
    // 'c:player:playArtist'

    type: string;
    act: string;
    artist: IArtist;
}

/**
 * Play an album once
 */
export interface IPlayAlbumAct extends Act {
    // 'c:player:playAlbum'

    type: string;
    act: string;
    album: IAlbum;
}

/**
 * Play a collection once
 */
export interface IPlayCollectionAct extends Act {
    // 'c:player:playCollection'
    type: string;
    act: string;
    collection: ICollection;
}

export interface IPlayUserFavoriteSongsAct extends Act {
    // 'c:player:playUserFavoriteSongs'
    type: string;
    act: string;
    songs: Array<ISong>;
}

export interface IPlayPodcastAct extends Act {
    // 'c:player:playPodcast'
    type: string;
    act: string;
    podcast: IPodcast;
}

export interface IVolumeAct extends Act {
    // 'c:player:volume'
    type: string;
    act: string;
    volume: number;
}

export interface ISeekAct extends Act {
    // 'c:player:seek'
    type: string;
    act: string;
    percent: number;
}

export interface IRewindAct extends Act {
    // 'c:player:rewind'
    type: string;
    act: string;
}

export interface IPlayPauseAct extends Act {
    // 'c:player:playPause'
    type: string;
    act: string;
}

export interface IForwardAct extends Act {
    // 'c:player:forward'
    type: string;
    act: string;
}

// add TPlayItem to play queue
export interface IAddToQueueAct extends Act {
    // 'c:player:addToQueue'
    type: string;
    act: string;
    playItems: Array<TPlayItem>;
    direction: string;
}
