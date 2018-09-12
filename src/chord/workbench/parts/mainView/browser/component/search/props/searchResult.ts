'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IPage } from 'chord/workbench/api/common/state/page';
import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';


export interface ISearchResultProps {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    keyword: string;

    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;

    songsPage: IPage;
    albumsPage: IPage;
    artistsPage: IPage;
    collectionsPage: IPage;

    searchMoreSongs: (keyword, page) => Promise<ISearchMoreSongsAct>;
    searchMoreAlbums: (keyword, page) => Promise<ISearchMoreAlbumsAct>;
    searchMoreArtists: (keyword, page) => Promise<ISearchMoreArtistsAct>;
    searchMoreCollections: (keyword, page) => Promise<ISearchMoreCollectionsAct>;
}
