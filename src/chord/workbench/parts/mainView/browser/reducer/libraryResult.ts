'use strict';

import { equal } from 'chord/base/common/assert';

import { Act } from 'chord/workbench/api/common/action/proto';

import {
    ILibraryInputAct,
    IGetMoreLibrarySongsAct,
    IGetMoreLibraryAlbumsAct,
    IGetMoreLibraryArtistsAct,
    IGetMoreLibraryCollectionsAct,
    IGetMoreLibraryUserProfilesAct,

    IGetMoreLibraryEpisodesAct,
    IGetMoreLibraryPodcastsAct,
    IGetMoreLibraryRadiosAct,
} from 'chord/workbench/api/common/action/mainView';

import { ILibraryViewState, ILibraryResultState } from 'chord/workbench/api/common/state/mainView/libraryView';
import { initiateOffset } from 'chord/workbench/api/common/state/offset';


export function showLibraryResult(state: ILibraryViewState, act: ILibraryInputAct): ILibraryViewState {
    equal(act.act, 'c:mainView:libraryInput');

    let keyword = act.keyword;

    let songsOffset = initiateOffset();
    if (act.songs.length) {
        songsOffset.offset = act.songs[act.songs.length - 1].id;
    }
    let artistsOffset = initiateOffset();
    if (act.artists.length) {
        artistsOffset.offset = act.artists[act.artists.length - 1].id;
    }
    let albumsOffset = initiateOffset();
    if (act.albums.length) {
        albumsOffset.offset = act.albums[act.albums.length - 1].id;
    }
    let collectionsOffset = initiateOffset();
    if (act.collections.length) {
        collectionsOffset.offset = act.collections[act.collections.length - 1].id;
    }
    let userProfilesOffset = initiateOffset();
    if (act.userProfiles.length) {
        userProfilesOffset.offset = act.userProfiles[act.userProfiles.length - 1].id;
    }
    let episodesOffset = initiateOffset();
    if (act.episodes.length) {
        episodesOffset.offset = act.episodes[act.episodes.length - 1].id;
    }
    let podcastsOffset = initiateOffset();
    if (act.podcasts.length) {
        podcastsOffset.offset = act.podcasts[act.podcasts.length - 1].id;
    }
    let radiosOffset = initiateOffset();
    if (act.radios.length) {
        radiosOffset.offset = act.radios[act.radios.length - 1].id;
    }

    let result = {
        view: 'top',

        songs: act.songs,
        artists: act.artists,
        albums: act.albums,
        collections: act.collections,
        userProfiles: act.userProfiles,

        episodes: act.episodes,
        podcasts: act.podcasts,
        radios: act.radios,

        songsOffset,
        artistsOffset,
        albumsOffset,
        collectionsOffset,
        userProfilesOffset,

        episodesOffset,
        podcastsOffset,
        radiosOffset,
    };

    return { keyword, result };
}


function getMoreLibraryItems<A extends Act>(type: string, state: ILibraryResultState, act: A): ILibraryResultState {
    let cType = type[0].toUpperCase() + type.slice(1) + 's';
    type = type + 's';
    equal(act.act, 'c:mainView:getMoreLibrary' + cType);

    let itemsOffset = act[type + 'Offset'];
    let items = [...state[type], ...act[type]];
    return { ...state, [type]: items, [type + 'Offset']: itemsOffset };
}

export function getMoreLibrarySongs(state: ILibraryResultState, act: IGetMoreLibrarySongsAct): ILibraryResultState {
    return getMoreLibraryItems('song', state, act);
    // equal(act.act, 'c:mainView:getMoreLibrarySongs');

    // let songsOffset = act.songsOffset;
    // let songs = [...state.songs, ...act.songs];
    // return { ...state, songs, songsOffset };
}

export function getMoreLibraryArtists(state: ILibraryResultState, act: IGetMoreLibraryArtistsAct): ILibraryResultState {
    return getMoreLibraryItems('artist', state, act);
    // equal(act.act, 'c:mainView:getMoreLibraryArtists');

    // let artistsOffset = act.artistsOffset;
    // let artists = [...state.artists, ...act.artists];
    // return { ...state, artists, artistsOffset };
}

export function getMoreLibraryAlbums(state: ILibraryResultState, act: IGetMoreLibraryAlbumsAct): ILibraryResultState {
    return getMoreLibraryItems('album', state, act);
    // equal(act.act, 'c:mainView:getMoreLibraryAlbums');

    // let albumsOffset = act.albumsOffset;
    // let albums = [...state.albums, ...act.albums];
    // return { ...state, albums, albumsOffset };
}

export function getMoreLibraryCollections(state: ILibraryResultState, act: IGetMoreLibraryCollectionsAct): ILibraryResultState {
    return getMoreLibraryItems('collection', state, act);
    // equal(act.act, 'c:mainView:getMoreLibraryCollections');

    // let collectionsOffset = act.collectionsOffset;
    // let collections = [...state.collections, ...act.collections];
    // return { ...state, collections, collectionsOffset };
}

export function getMoreLibraryUserProfiles(state: ILibraryResultState, act: IGetMoreLibraryUserProfilesAct): ILibraryResultState {
    return getMoreLibraryItems('userProfile', state, act);
    // equal(act.act, 'c:mainView:getMoreLibraryUserProfiles');

    // let userProfilesOffset = act.userProfilesOffset;
    // let userProfiles = [...state.userProfiles, ...act.userProfiles];
    // return { ...state, userProfiles, userProfilesOffset };
}

export function getMoreLibraryEpisodes(state: ILibraryResultState, act: IGetMoreLibraryEpisodesAct): ILibraryResultState {
    return getMoreLibraryItems('episode', state, act);
}

export function getMoreLibraryPodcasts(state: ILibraryResultState, act: IGetMoreLibraryPodcastsAct): ILibraryResultState {
    return getMoreLibraryItems('podcast', state, act);
}

export function getMoreLibraryRadios(state: ILibraryResultState, act: IGetMoreLibraryRadiosAct): ILibraryResultState {
    return getMoreLibraryItems('radio', state, act);
}
