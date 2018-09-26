'use strict';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';

import { musicApi } from 'chord/music/core/api';


export async function search(keyword: string): Promise<ISearchInputAct> {
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
