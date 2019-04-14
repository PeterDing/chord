'use strict';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';

import { musicApi } from 'chord/music/core/api';


export async function searchKeyword(keyword: string): Promise<ISearchInputAct> {
    let [songs, albums, artists, collections] = await Promise.all([
        musicApi.searchSongs(keyword, 0, 10),
        musicApi.searchAlbums(keyword, 0, 10),
        musicApi.searchArtists(keyword, 0, 10),
        musicApi.searchCollections(keyword, 0, 10)
    ]);

    return {
        type: 'c:mainView:searchInput',
        act: 'c:mainView:searchInput',
        keyword,
        songs,
        albums,
        artists,
        collections,
    };
}


export async function searchFromURL(input: string): Promise<ISearchInputAct> {
    let songs = [];
    let albums = [];
    let artists = [];
    let collections = [];
    let users = [];

    let items = await musicApi.fromURL(input);
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
    };
}


export async function search(keyword: string): Promise<ISearchInputAct> {
    let act;
    if (/[\/?=]/.exec(keyword)) {
        act = await searchFromURL(keyword);
    }

    if (act) return act;

    return searchKeyword(keyword);
}
