'use strict';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { ILibraryUserProfile } from 'chord/library/api/userProfile';

import { ILibraryEpisode } from 'chord/library/api/episode';
import { ILibraryPodcast } from 'chord/library/api/podcast';
import { ILibraryRadio } from 'chord/library/api/radio';

import { IOffset, initiateOffset } from 'chord/workbench/api/common/state/offset';


export interface ILibraryResultState {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections' | 'episode' | 'podcast' | 'radio'
    // For searching result navigation
    view: string;

    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;
    userProfiles: Array<ILibraryUserProfile>;

    episodes: Array<ILibraryEpisode>;
    podcasts: Array<ILibraryPodcast>;
    radios: Array<ILibraryRadio>;

    // offset is lastId
    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;
    userProfilesOffset: IOffset;

    episodesOffset: IOffset;
    podcastsOffset: IOffset;
    radiosOffset: IOffset;
}

export interface ILibraryViewState {
    // library searching input keyword
    keyword: string;

    result: ILibraryResultState;
}


const MAX_ID = 2 ** 32 - 1;

export function initiateLibraryResultState(): ILibraryResultState {
    return {
        view: 'top',

        songs: [],
        albums: [],
        artists: [],
        collections: [],
        userProfiles: [],

        episodes: [],
        podcasts: [],
        radios: [],

        songsOffset: { ...initiateOffset(), offset: MAX_ID },
        albumsOffset: { ...initiateOffset(), offset: MAX_ID },
        artistsOffset: { ...initiateOffset(), offset: MAX_ID },
        collectionsOffset: { ...initiateOffset(), offset: MAX_ID },
        userProfilesOffset: { ...initiateOffset(), offset: MAX_ID },

        episodesOffset: { ...initiateOffset(), offset: MAX_ID },
        podcastsOffset: { ...initiateOffset(), offset: MAX_ID },
        radiosOffset: { ...initiateOffset(), offset: MAX_ID },
    };
}

export function initiateLibraryViewState(): ILibraryViewState {
    return {
        keyword: '',
        result: initiateLibraryResultState(),
    }
}
