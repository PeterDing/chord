'use strict';

import { IUserSong } from 'chord/library/api/song';
import { IUserAlbum } from 'chord/library/api/album';
import { IUserArtist } from 'chord/library/api/artist';
import { IUserCollection } from 'chord/library/api/collection';
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

    songs: Array<IUserSong>;
    albums: Array<IUserAlbum>;
    artists: Array<IUserArtist>;
    collections: Array<IUserCollection>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;

    getMoreSongs: (keyword, offset) => IGetMoreLibrarySongsAct;
    getMoreAlbums: (keyword, offset) => IGetMoreLibraryAlbumsAct;
    getMoreArtists: (keyword, offset) => IGetMoreLibraryArtistsAct;
    getMoreCollections: (keyword, offset) => IGetMoreLibraryCollectionsAct;
}
