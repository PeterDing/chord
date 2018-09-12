'use strict';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';

import { aliMusicApi } from 'chord/music/xiami/api';


export async function search(keyword: string): Promise<ISearchInputAct> {
    let [songs, albums, artists, collections] = await Promise.all([
        aliMusicApi.searchSongs(keyword),
        aliMusicApi.searchAlbums(keyword),
        aliMusicApi.searchArtists(keyword),
        aliMusicApi.searchCollections(keyword)
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
