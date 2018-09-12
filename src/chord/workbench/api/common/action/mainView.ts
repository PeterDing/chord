'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IPage } from 'chord/workbench/api/common/state/page';


/**
 * WARN !!!!!!!!!
 * All actions must be dispatched to handleView of 'chord/workbench/parts/mainView/browser/reducer/main'
 */


export interface ISearchViewAct extends Act {
    // 'c:mainView:searchView'
    type: string;
    act: string;
}


export interface ISearchInputAct extends Act {
    // 'c:mainView:searchInput'
    type: string;
    act: string;
    keyword: string;
    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;
}


export interface ISearchMoreSongsAct extends Act {
    // 'c:mainView:searchMoreSongs'
    type: string;
    act: string;
    keyword: string;
    songs: Array<ISong>;
    songsPage: IPage;
}

export interface ISearchMoreAlbumsAct extends Act {
    // 'c:mainView:searchMoreAlbums'
    type: string;
    act: string;
    keyword: string;
    albums: Array<IAlbum>;
    albumsPage: IPage;
}

export interface ISearchMoreArtistsAct extends Act {
    // 'c:mainView:searchMoreArtists'
    type: string;
    act: string;
    keyword: string;
    artists: Array<IArtist>;
    artistsPage: IPage;
}

export interface ISearchMoreCollectionsAct extends Act {
    // 'c:mainView:searchMoreCollections'
    type: string;
    act: string;
    keyword: string;
    collections: Array<ICollection>;
    collectionsPage: IPage;
}

export interface IShowAlbumAct extends Act {
    // 'c:mainView:showAlbumView'
    type: string;
    act: string;
    album: IAlbum;
}

export interface IShowCollectionAct extends Act {
    // 'c:mainView:showCollectionView'
    type: string;
    act: string;
    collection: ICollection;
}

export interface IShowArtistAct extends Act {
    // 'c:mainView:showArtistView'
    type: string;
    act: string;
    artist: IArtist;
    songsPage: IPage;
    albumsPage: IPage;
}

export interface IGetMoreArtistSongsAct extends Act {
    // 'c:mainView:getMoreArtistSongs'
    type: string;
    act: string;
    songs: Array<ISong>;
    songsPage: IPage;
}

export interface IGetMoreArtistAlbumsAct extends Act {
    // 'c:mainView:getMoreArtistAlbums'
    type: string;
    act: string;
    albums: Array<IAlbum>;
    albumsPage: IPage;
}
