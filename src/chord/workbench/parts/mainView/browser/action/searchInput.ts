'use strict';

import { writeLocalSearchHistory } from 'chord/preference/utils/app';

import { initiateOffset } from 'chord/workbench/api/common/state/offset';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';

import { musicApi } from 'chord/music/core/api';
import { soundApi } from 'chord/sound/core/api';


/**
 * Search keyword
 */
export async function searchKeyword(keyword: string): Promise<ISearchInputAct> {
    let { offset, limit } = initiateOffset();
    let [songs, albums, artists, collections, episodes, podcasts, radios] = await Promise.all([
        musicApi.searchSongs(keyword, offset, limit),
        musicApi.searchAlbums(keyword, offset, limit),
        musicApi.searchArtists(keyword, offset, limit),
        musicApi.searchCollections(keyword, offset, limit),

        soundApi.searchEpisodes(keyword, offset, limit),
        soundApi.searchPodcasts(keyword, offset, limit),
        soundApi.searchRadios(keyword, offset, limit),
    ]);

    return {
        type: 'c:mainView:searchInput',
        act: 'c:mainView:searchInput',
        keyword,
        songs,
        albums,
        artists,
        collections,

        episodes,
        podcasts,
        radios,
    };
}


/**
 * Search input as url
 */
export async function searchFromURL(input: string): Promise<ISearchInputAct> {
    let songs = [];
    let albums = [];
    let artists = [];
    let collections = [];
    let users = [];

    let episodes = [];
    let podcasts = [];
    let radios = [];

    let items = [
        ...(await musicApi.fromURL(input)),
        ...(await soundApi.fromURL(input)),
    ];
    if (items.length == 0) return null;

    items.forEach(item => {
        switch (item.type) {
            case 'song':
                songs.push(item);
                break;
            case 'artist':
                artists.push(item);
                break;
            case 'album':
                albums.push(item);
                break;
            case 'collection':
                collections.push(item);
                break;
            case 'userProfile':
                users.push(item);
                break;
            case 'episode':
                episodes.push(item);
                break;
            case 'podcast':
                podcasts.push(item);
                break;
            case 'radio':
                radios.push(item);
                break;
            default:
                break;
        }
    })

    return {
        type: 'c:mainView:searchInput',
        act: 'c:mainView:searchInput',
        keyword: input,
        songs,
        albums,
        artists,
        collections,

        episodes,
        podcasts,
        radios,
    };
}


function saveSearchKeyword(keyword: string) {
    writeLocalSearchHistory(keyword);
}


export async function search(keyword: string): Promise<ISearchInputAct> {
    saveSearchKeyword(keyword);

    let act: ISearchInputAct;
    if (/[\/?=]/.exec(keyword)) {
        act = await searchFromURL(keyword);
    }

    if (act) return act;

    return searchKeyword(keyword);
}
