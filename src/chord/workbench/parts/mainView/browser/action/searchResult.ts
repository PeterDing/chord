'use strict';

import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,

    ISearchMoreEpisodesAct,
    ISearchMorePodcastsAct,
    ISearchMoreRadiosAct,
} from 'chord/workbench/api/common/action/mainView';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import { musicApi } from 'chord/music/core/api';
import { soundApi } from 'chord/sound/core/api';


export async function searchMoreSongs(keyword: string, offset: IOffset): Promise<ISearchMoreSongsAct> {
    let songs = [];
    if (offset.more) {
        offset.offset += 1;
        songs = await musicApi.searchSongs(keyword, offset.offset, offset.limit);
    }
    if (songs.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreSongs',
        act: 'c:mainView:searchMoreSongs',
        keyword,
        songs,
        songsOffset: offset,
    };
}

export async function searchMoreAlbums(keyword: string, offset: IOffset): Promise<ISearchMoreAlbumsAct> {
    let albums = [];
    if (offset.more) {
        offset.offset += 1;
        albums = await musicApi.searchAlbums(keyword, offset.offset, offset.limit);
    }
    if (albums.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreAlbums',
        act: 'c:mainView:searchMoreAlbums',
        keyword,
        albums,
        albumsOffset: offset,
    };
}

export async function searchMoreArtists(keyword: string, offset: IOffset): Promise<ISearchMoreArtistsAct> {
    let artists = [];
    if (offset.more) {
        offset.offset += 1;
        artists = await musicApi.searchArtists(keyword, offset.offset, offset.limit);
    }
    if (artists.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreArtists',
        act: 'c:mainView:searchMoreArtists',
        keyword,
        artists,
        artistsOffset: offset,
    };
}

export async function searchMoreCollections(keyword: string, offset: IOffset): Promise<ISearchMoreCollectionsAct> {
    let collections = [];
    if (offset.more) {
        offset.offset += 1;
        collections = await musicApi.searchCollections(keyword, offset.offset, offset.limit);
    }
    if (collections.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreCollections',
        act: 'c:mainView:searchMoreCollections',
        keyword,
        collections,
        collectionsOffset: offset,
    };
}


// Sound

export async function searchMoreEpisodes(keyword: string, offset: IOffset): Promise<ISearchMoreEpisodesAct> {
    let episodes = [];
    if (offset.more) {
        offset.offset += 1;
        episodes = await soundApi.searchEpisodes(keyword, offset.offset, offset.limit);
    }
    if (episodes.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreEpisodes',
        act: 'c:mainView:searchMoreEpisodes',
        keyword,
        episodes,
        episodesOffset: offset,
    };
}

export async function searchMorePodcasts(keyword: string, offset: IOffset): Promise<ISearchMorePodcastsAct> {
    let podcasts = [];
    if (offset.more) {
        offset.offset += 1;
        podcasts = await soundApi.searchPodcasts(keyword, offset.offset, offset.limit);
    }
    if (podcasts.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMorePodcasts',
        act: 'c:mainView:searchMorePodcasts',
        keyword,
        podcasts,
        podcastsOffset: offset,
    };
}

export async function searchMoreRadios(keyword: string, offset: IOffset): Promise<ISearchMoreRadiosAct> {
    let radios = [];
    if (offset.more) {
        offset.offset += 1;
        radios = await soundApi.searchRadios(keyword, offset.offset, offset.limit);
    }
    if (radios.length == 0) {
        offset.more = false;
    }
    return {
        type: 'c:mainView:searchMoreRadios',
        act: 'c:mainView:searchMoreRadios',
        keyword,
        radios,
        radiosOffset: offset,
    };
}
