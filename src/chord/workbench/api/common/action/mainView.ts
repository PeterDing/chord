'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IUserSong } from 'chord/library/api/song';
import { IUserAlbum } from 'chord/library/api/album';
import { IUserArtist } from 'chord/library/api/artist';
import { IUserCollection } from 'chord/library/api/collection';

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
    songsOffset: IOffset;
}

export interface ISearchMoreAlbumsAct extends Act {
    // 'c:mainView:searchMoreAlbums'
    type: string;
    act: string;
    keyword: string;
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}

export interface ISearchMoreArtistsAct extends Act {
    // 'c:mainView:searchMoreArtists'
    type: string;
    act: string;
    keyword: string;
    artists: Array<IArtist>;
    artistsOffset: IOffset;
}

export interface ISearchMoreCollectionsAct extends Act {
    // 'c:mainView:searchMoreCollections'
    type: string;
    act: string;
    keyword: string;
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
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
    songsOffset: IOffset;
    albumsOffset: IOffset;
}

export interface IGetMoreArtistSongsAct extends Act {
    // 'c:mainView:getMoreArtistSongs'
    type: string;
    act: string;
    songs: Array<ISong>;
    songsOffset: IOffset;
}

export interface IGetMoreArtistAlbumsAct extends Act {
    // 'c:mainView:getMoreArtistAlbums'
    type: string;
    act: string;
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
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

export interface IAddLibraryUserProfileAct extends Act {
    // 'c:mainView:addLibraryUserProfile'
    type: string;
    act: string;
    userProfile: IUserProfile;
}

export interface IRemoveFromLibraryAct extends Act {
    // 'c:mainView:removeFromLibrary'
    type: string;
    act: string;
    item: ISong | IArtist | IAlbum | ICollection | IUserProfile;
}


/**
 * For preference view
 */
export interface IPreferenceViewAct extends Act {
    // 'c:mainView:preferenceView'
    type: string;
    act: string;
}


/**
 * For user profile
 */
export interface IShowUserProfileAct extends Act {
    // 'c:mainView:showUserProfileView'
    type: string;
    act: string;

    userProfile: IUserProfile;

    songsOffset: IOffset;
    artistsOffset: IOffset;
    albumsOffset: IOffset;
    favoriteCollectionsOffset: IOffset;
    createdCollectionsOffset: IOffset;
}

export interface IGetMoreUserFavoriteSongsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteSongs'
    type: string;
    act: string;
    songs: Array<ISong>;
    songsOffset: IOffset;
}

export interface IGetMoreUserFavoriteAlbumsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteAlbums'
    type: string;
    act: string;
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreUserFavoriteArtistsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteArtists'
    type: string;
    act: string;
    artists: Array<IArtist>;
    artistsOffset: IOffset;
}

export interface IGetMoreUserFavoriteCollectionsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteCollections'
    type: string;
    act: string;
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreUserCreatedCollectionsAct extends Act {
    // 'c:mainView:getMoreUserCreatedCollections'
    type: string;
    act: string;
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}
