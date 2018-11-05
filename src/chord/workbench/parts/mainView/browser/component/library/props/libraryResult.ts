'use strict';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import {
    IGetMoreLibrarySongsAct,
    IGetMoreLibraryAlbumsAct,
    IGetMoreLibraryArtistsAct,
    IGetMoreLibraryCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';


export interface ILibraryResultProps {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For library searching result navigation
    view: string;

    keyword: string;

    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;

    getMoreSongs: (keyword, offset) => IGetMoreLibrarySongsAct;
    getMoreAlbums: (keyword, offset) => IGetMoreLibraryAlbumsAct;
    getMoreArtists: (keyword, offset) => IGetMoreLibraryArtistsAct;
    getMoreCollections: (keyword, offset) => IGetMoreLibraryCollectionsAct;
}
