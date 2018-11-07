'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { ILibraryUserProfile } from 'chord/library/api/userProfile';

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
    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;
    userProfiles: Array<ILibraryUserProfile>;
}

export interface IGetMoreLibrarySongsAct extends Act {
    // 'c:mainView:getMoreLibrarySongs'
    type: string;
    act: string;
    songs: Array<ILibrarySong>;
    songsOffset: IOffset;
}

export interface IGetMoreLibraryAlbumsAct extends Act {
    // 'c:mainView:getMoreLibraryAlbums'
    type: string;
    act: string;
    albums: Array<ILibraryAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreLibraryArtistsAct extends Act {
    // 'c:mainView:getMoreLibraryArtists'
    type: string;
    act: string;
    artists: Array<ILibraryArtist>;
    artistsOffset: IOffset;
}

export interface IGetMoreLibraryCollectionsAct extends Act {
    // 'c:mainView:getMoreLibraryCollections'
    type: string;
    act: string;
    collections: Array<ILibraryCollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreLibraryUserProfilesAct extends Act {
    // 'c:mainView:getMoreLibraryUserProfiles'
    type: string;
    act: string;
    userProfiles: Array<ILibraryUserProfile>;
    userProfilesOffset: IOffset;
}

export interface IAddLibrarySongAct extends Act {
    // 'c:mainView:addLibrarySong'
    type: string;
    act: string;
    song: ILibrarySong;
}

export interface IAddLibraryArtistAct extends Act {
    // 'c:mainView:addLibraryArtist'
    type: string;
    act: string;
    artist: ILibraryArtist;
}

export interface IAddLibraryAlbumAct extends Act {
    // 'c:mainView:addLibraryAlbum'
    type: string;
    act: string;
    album: ILibraryAlbum;
}

export interface IAddLibraryCollectionAct extends Act {
    // 'c:mainView:addLibraryCollection'
    type: string;
    act: string;
    collection: ILibraryCollection;
}

export interface IAddLibraryUserProfileAct extends Act {
    // 'c:mainView:addLibraryUserProfile'
    type: string;
    act: string;
    userProfile: ILibraryUserProfile;
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
    followingsOffset: IOffset;
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

export interface IGetMoreUserFollowingsAct extends Act {
    // 'c:mainView:getMoreUserFollowings'
    type: string;
    act: string;
    followings: Array<IUserProfile>;
    followingsOffset: IOffset;
}
