'use strict';

import { ILibraryInputAct } from 'chord/workbench/api/common/action/mainView';

import { defaultUser } from 'chord/user/core/user';


const MAX_ID = 2 ** 32 - 1;

export function librarySearch(keyword: string): ILibraryInputAct {
    let songs = defaultUser.userSongs(MAX_ID, 10, keyword);
    let artists = defaultUser.userArtists(MAX_ID, 10, keyword);
    let albums = defaultUser.userAlbums(MAX_ID, 10, keyword);
    let collections = defaultUser.userCollections(MAX_ID, 10, keyword);

    return {
        type: 'c:mainView:libraryInput',
        act: 'c:mainView:libraryInput',
        keyword,
        songs,
        albums,
        artists,
        collections,
    };
}
