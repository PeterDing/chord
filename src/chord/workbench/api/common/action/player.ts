'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { Act } from 'chord/workbench/api/common/action/proto';



export interface IPlayAct extends Act {
    // 'c:player:play'

    // type is key that must be included
    // In chord, type is equal act
    type: string;
    act: string;
    index: number;
}

/**
 * Play one song once
 */
export interface IPlayOneAct extends Act {
    // 'c:player:playOne'

    type: string;
    act: string;
    song: ISong;
}

/**
 * Play many songs once
 */
export interface IPlayManyAct extends Act {
    // 'c:player:playMany'

    type: string;
    act: string;
    songs: Array<ISong>;
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

export interface IAddSongAct extends Act {
    // 'c:player:addSong'
    type: string;
    act: string;
    songs: Array<ISong>;
}
