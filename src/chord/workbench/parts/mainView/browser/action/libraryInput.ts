'use strict';

import { ILibraryInputAct } from 'chord/workbench/api/common/action/mainView';

import { defaultLibrary } from 'chord/library/core/library';


const MAX_ID = 2 ** 32 - 1;

export function librarySearch(keyword: string): ILibraryInputAct {
    let songs = defaultLibrary.librarySongs(MAX_ID, 10, keyword);
    let artists = defaultLibrary.libraryArtists(MAX_ID, 10, keyword);
    let albums = defaultLibrary.libraryAlbums(MAX_ID, 10, keyword);
    let collections = defaultLibrary.libraryCollections(MAX_ID, 10, keyword);

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
