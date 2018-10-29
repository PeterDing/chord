'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { IUserSong } from 'chord/library/api/song';
import { IUserAlbum } from 'chord/library/api/album';
import { IUserArtist } from 'chord/library/api/artist';
import { IUserCollection } from 'chord/library/api/collection';

import { IPage } from 'chord/workbench/api/common/state/page';
import { IOffset } from 'chord/workbench/api/common/state/offset';


/**
 * WARN !!!!!!!!!
 * All actions must be dispatched to handleView of 'chord/workbench/parts/mainView/browser/reducer/main'
 */


/**
 * For search view
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



/**
 * For album view
 */
export interface IShowAlbumAct extends Act {
    // 'c:mainView:showAlbumView'
    type: string;
    act: string;
    album: IAlbum;
}


/**
 * For collection view
 */
export interface IShowCollectionAct extends Act {
    // 'c:mainView:showCollectionView'
    type: string;
    act: string;
    collection: ICollection;
}


/**
 * For artist view
 */
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


/**
 * For library view
 */
export interface ILibraryInputAct extends Act {
    // 'c:mainView:libraryInput'
    type: string;
    act: string;
    keyword: string;
    songs: Array<IUserSong>;
    albums: Array<IUserAlbum>;
    artists: Array<IUserArtist>;
    collections: Array<IUserCollection>;
}

export interface IGetMoreLibrarySongsAct extends Act {
    // 'c:mainView:getMoreLibrarySongs'
    type: string;
    act: string;
    songs: Array<IUserSong>;
    songsOffset: IOffset;
}

export interface IGetMoreLibraryAlbumsAct extends Act {
    // 'c:mainView:getMoreLibraryAlbums'
    type: string;
    act: string;
    albums: Array<IUserAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreLibraryArtistsAct extends Act {
    // 'c:mainView:getMoreLibraryArtists'
    type: string;
    act: string;
    artists: Array<IUserArtist>;
    artistsOffset: IOffset;
}

export interface IGetMoreLibraryCollectionsAct extends Act {
    // 'c:mainView:getMoreLibraryCollections'
    type: string;
    act: string;
    collections: Array<IUserCollection>;
    collectionsOffset: IOffset;
}

export interface IAddLibrarySongAct extends Act {
    // 'c:mainView:addLibrarySong'
    type: string;
    act: string;
    song: IUserSong;
}

export interface IAddLibraryArtistAct extends Act {
    // 'c:mainView:addLibraryArtist'
    type: string;
    act: string;
    artist: IUserArtist;
}

export interface IAddLibraryAlbumAct extends Act {
    // 'c:mainView:addLibraryAlbum'
    type: string;
    act: string;
    album: IUserAlbum;
}

export interface IAddLibraryCollectionAct extends Act {
    // 'c:mainView:addLibraryCollection'
    type: string;
    act: string;
    collection: IUserCollection;
}

export interface IRemoveFromLibraryAct extends Act {
    // 'c:mainView:removeFromLibrary'
    type: string;
    act: string;
    item: ISong | IArtist | IAlbum | ICollection;
}


/**
 * For preference view
 */
export interface IPreferenceViewAct extends Act {
    // 'c:mainView:preferenceView'
    type: string;
    act: string;
}
