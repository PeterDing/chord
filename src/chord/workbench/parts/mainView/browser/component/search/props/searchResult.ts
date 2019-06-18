'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import { IOffset } from 'chord/workbench/api/common/state/offset';
import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,

    ISearchMoreEpisodesAct,
    ISearchMorePodcastsAct,
    ISearchMoreRadiosAct,
} from 'chord/workbench/api/common/action/mainView';


export interface ISearchResultProps {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    keyword: string;

    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;

    episodes: Array<IEpisode>;
    podcasts: Array<IPodcast>;
    radios: Array<IRadio>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;

    episodesOffset: IOffset;
    podcastsOffset: IOffset;
    radiosOffset: IOffset;

    searchMoreSongs: (keyword, offset) => Promise<ISearchMoreSongsAct>;
    searchMoreAlbums: (keyword, offset) => Promise<ISearchMoreAlbumsAct>;
    searchMoreArtists: (keyword, offset) => Promise<ISearchMoreArtistsAct>;
    searchMoreCollections: (keyword, offset) => Promise<ISearchMoreCollectionsAct>;

    searchMoreEpisodes: (keyword, offset) => Promise<ISearchMoreEpisodesAct>;
    searchMorePodcasts: (keyword, offset) => Promise<ISearchMorePodcastsAct>;
    searchMoreRadios: (keyword, offset) => Promise<ISearchMoreRadiosAct>;
}
