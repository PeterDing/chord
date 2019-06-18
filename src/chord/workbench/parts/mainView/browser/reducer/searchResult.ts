'use strict';

import { equal } from 'chord/base/common/assert';
import {
    ISearchInputAct,
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,

    ISearchMoreEpisodesAct,
    ISearchMorePodcastsAct,
    ISearchMoreRadiosAct,
} from 'chord/workbench/api/common/action/mainView';
import { ISearchViewState, ISearchResultState } from 'chord/workbench/api/common/state/mainView/searchView';


export function showSearchResult(state: ISearchViewState, act: ISearchInputAct): ISearchViewState {
    equal(act.act, 'c:mainView:searchInput');

    let result = {
        ...state.result,
        view: 'top',
        songs: act.songs,
        albums: act.albums,
        artists: act.artists,
        collections: act.collections,

        episodes: act.episodes,
        podcasts: act.podcasts,
        radios: act.radios,
    };
    let keywords = act.keyword == state.history.keywords[0] ? [...state.history.keywords] : [act.keyword, ...state.history.keywords.filter(keyword => keyword != act.keyword).slice(0, 999)];
    let history = { keywords };
    return { ...state, view: 'searchResult', keyword: act.keyword, history, result };
}

export function addSearchSongs(state: ISearchResultState, act: ISearchMoreSongsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreSongs')

    let songsOffset = act.songsOffset;
    let songs = [...state.songs, ...act.songs];
    return { ...state, songs, songsOffset };
}

export function addSearchAlbums(state: ISearchResultState, act: ISearchMoreAlbumsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreAlbums')

    let albumsOffset = act.albumsOffset;
    let albums = [...state.albums, ...act.albums];
    return { ...state, albums, albumsOffset };
}

export function addSearchArtists(state: ISearchResultState, act: ISearchMoreArtistsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreArtists')

    let artistsOffset = act.artistsOffset;
    let artists = [...state.artists, ...act.artists];
    return { ...state, artists, artistsOffset };
}

export function addSearchCollections(state: ISearchResultState, act: ISearchMoreCollectionsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreCollections')

    let collectionsOffset = act.collectionsOffset;
    let collections = [...state.collections, ...act.collections];
    return { ...state, collections, collectionsOffset };
}


export function addSearchEpisodes(state: ISearchResultState, act: ISearchMoreEpisodesAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreEpisodes')

    let episodesOffset = act.episodesOffset;
    let episodes = [...state.episodes, ...act.episodes];
    return { ...state, episodes, episodesOffset };
}

export function addSearchPodcasts(state: ISearchResultState, act: ISearchMorePodcastsAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMorePodcasts')

    let podcastsOffset = act.podcastsOffset;
    let podcasts = [...state.podcasts, ...act.podcasts];
    return { ...state, podcasts, podcastsOffset };
}

export function addSearchRadios(state: ISearchResultState, act: ISearchMoreRadiosAct): ISearchResultState {
    equal(act.act, 'c:mainView:searchMoreRadios')

    let radiosOffset = act.radiosOffset;
    let radios = [...state.radios, ...act.radios];
    return { ...state, radios, radiosOffset };
}
