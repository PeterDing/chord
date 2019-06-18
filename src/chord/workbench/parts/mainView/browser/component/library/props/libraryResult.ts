'use strict';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { ILibraryUserProfile } from 'chord/library/api/userProfile';

import { ILibraryEpisode } from 'chord/library/api/episode';
import { ILibraryPodcast } from 'chord/library/api/podcast';
import { ILibraryRadio } from 'chord/library/api/radio';

import { IOffset } from 'chord/workbench/api/common/state/offset';

import {
    IGetMoreLibrarySongsAct,
    IGetMoreLibraryAlbumsAct,
    IGetMoreLibraryArtistsAct,
    IGetMoreLibraryCollectionsAct,
    IGetMoreLibraryUserProfilesAct,

    IGetMoreLibraryEpisodesAct,
    IGetMoreLibraryPodcastsAct,
    IGetMoreLibraryRadiosAct,
} from 'chord/workbench/api/common/action/mainView';
import { IPlayManyAct } from 'chord/workbench/api/common/action/player';


export interface ILibraryResultProps {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections' | 'userProfiles'
    // For library searching result navigation
    view: string;

    keyword: string;

    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;
    userProfiles: Array<ILibraryUserProfile>;

    episodes: Array<ILibraryEpisode>;
    podcasts: Array<ILibraryPodcast>;
    radios: Array<ILibraryRadio>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;
    userProfilesOffset: IOffset;

    episodesOffset: IOffset;
    podcastsOffset: IOffset;
    radiosOffset: IOffset;

    getMoreSongs: (keyword, offset, size) => IGetMoreLibrarySongsAct;
    getMoreAlbums: (keyword, offset, size) => IGetMoreLibraryAlbumsAct;
    getMoreArtists: (keyword, offset, size) => IGetMoreLibraryArtistsAct;
    getMoreCollections: (keyword, offset, size) => IGetMoreLibraryCollectionsAct;
    getMoreUserProfiles: (keyword, offset, size) => IGetMoreLibraryUserProfilesAct;

    getMoreEpisodes: (keyword, offset, size) => IGetMoreLibraryEpisodesAct;
    getMorePodcasts: (keyword, offset, size) => IGetMoreLibraryPodcastsAct;
    getMoreRadios: (keyword, offset, size) => IGetMoreLibraryRadiosAct;

    handlePlayLibrarySongs: () => Promise<IPlayManyAct>;
}
