'use strict';

import { Act } from 'chord/workbench/api/common/action/proto';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { ILibraryUserProfile } from 'chord/library/api/userProfile';

import { ILibraryEpisode } from 'chord/library/api/episode';
import { ILibraryPodcast } from 'chord/library/api/podcast';
import { ILibraryRadio } from 'chord/library/api/radio';

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
}


export interface ISearchInputAct extends Act {
    // 'c:mainView:searchInput'
    keyword: string;
    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;

    episodes: Array<IEpisode>;
    podcasts: Array<IPodcast>;
    radios: Array<IRadio>;
}


export interface ISearchMoreSongsAct extends Act {
    // 'c:mainView:searchMoreSongs'
    keyword: string;
    songs: Array<ISong>;
    songsOffset: IOffset;
}

export interface ISearchMoreAlbumsAct extends Act {
    // 'c:mainView:searchMoreAlbums'
    keyword: string;
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}

export interface ISearchMoreArtistsAct extends Act {
    // 'c:mainView:searchMoreArtists'
    keyword: string;
    artists: Array<IArtist>;
    artistsOffset: IOffset;
}

export interface ISearchMoreCollectionsAct extends Act {
    // 'c:mainView:searchMoreCollections'
    keyword: string;
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}


export interface ISearchMoreEpisodesAct extends Act {
    // 'c:mainView:searchMoreEpisodes'
    keyword: string;
    episodes: Array<IEpisode>;
    episodesOffset: IOffset;
}

export interface ISearchMorePodcastsAct extends Act {
    // 'c:mainView:searchMorePodcasts'
    keyword: string;
    podcasts: Array<IPodcast>;
    podcastsOffset: IOffset;
}

export interface ISearchMoreRadiosAct extends Act {
    // 'c:mainView:searchMoreRadios'
    keyword: string;
    radios: Array<IRadio>;
    radiosOffset: IOffset;
}


/**
 * For album view
 */
export interface IShowAlbumAct extends Act {
    // 'c:mainView:showAlbumView'
    album: IAlbum;
}


/**
 * For collection view
 */
export interface IShowCollectionAct extends Act {
    // 'c:mainView:showCollectionView'
    collection: ICollection;
}


/**
 * For artist view
 */
export interface IShowArtistAct extends Act {
    // 'c:mainView:showArtistView'
    artist: IArtist;
    songsOffset: IOffset;
    albumsOffset: IOffset;
}

export interface IGetMoreArtistSongsAct extends Act {
    // 'c:mainView:getMoreArtistSongs'
    songs: Array<ISong>;
    songsOffset: IOffset;
}

export interface IGetMoreArtistAlbumsAct extends Act {
    // 'c:mainView:getMoreArtistAlbums'
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}


/**
 * For library view
 */
export interface ILibraryInputAct extends Act {
    // 'c:mainView:libraryInput'
    keyword: string;

    songs: Array<ILibrarySong>;
    albums: Array<ILibraryAlbum>;
    artists: Array<ILibraryArtist>;
    collections: Array<ILibraryCollection>;
    userProfiles: Array<ILibraryUserProfile>;

    episodes: Array<ILibraryEpisode>;
    podcasts: Array<ILibraryPodcast>;
    radios: Array<ILibraryRadio>;
}

export interface IGetMoreLibrarySongsAct extends Act {
    // 'c:mainView:getMoreLibrarySongs'
    songs: Array<ILibrarySong>;
    songsOffset: IOffset;
}

export interface IGetMoreLibraryAlbumsAct extends Act {
    // 'c:mainView:getMoreLibraryAlbums'
    albums: Array<ILibraryAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreLibraryArtistsAct extends Act {
    // 'c:mainView:getMoreLibraryArtists'
    artists: Array<ILibraryArtist>;
    artistsOffset: IOffset;
}

export interface IGetMoreLibraryCollectionsAct extends Act {
    // 'c:mainView:getMoreLibraryCollections'
    collections: Array<ILibraryCollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreLibraryUserProfilesAct extends Act {
    // 'c:mainView:getMoreLibraryUserProfiles'
    userProfiles: Array<ILibraryUserProfile>;
    userProfilesOffset: IOffset;
}

export interface IGetMoreLibraryEpisodesAct extends Act {
    // 'c:mainView:getMoreLibraryEpisodes'
    episodes: Array<ILibraryEpisode>;
    episodesOffset: IOffset;
}

export interface IGetMoreLibraryPodcastsAct extends Act {
    // 'c:mainView:getMoreLibraryPodcasts'
    podcasts: Array<ILibraryPodcast>;
    podcastsOffset: IOffset;
}

export interface IGetMoreLibraryRadiosAct extends Act {
    // 'c:mainView:getMoreLibraryRadios'
    radios: Array<ILibraryRadio>;
    radiosOffset: IOffset;
}


export interface IAddLibrarySongAct extends Act {
    // 'c:mainView:addLibrarySong'
    song: ILibrarySong;
}

export interface IAddLibraryArtistAct extends Act {
    // 'c:mainView:addLibraryArtist'
    artist: ILibraryArtist;
}

export interface IAddLibraryAlbumAct extends Act {
    // 'c:mainView:addLibraryAlbum'
    album: ILibraryAlbum;
}

export interface IAddLibraryCollectionAct extends Act {
    // 'c:mainView:addLibraryCollection'
    collection: ILibraryCollection;
}

export interface IAddLibraryUserProfileAct extends Act {
    // 'c:mainView:addLibraryUserProfile'
    userProfile: ILibraryUserProfile;
}

export interface IRemoveFromLibraryAct extends Act {
    // 'c:mainView:removeFromLibrary'
    item: ISong | IArtist | IAlbum | ICollection | IUserProfile | IEpisode | IPodcast | IRadio;
}


/**
 * For Sound
 */
export interface IAddLibraryEpisodeAct extends Act {
    // 'c:mainView:addLibraryEpisode'
    episode: ILibraryEpisode;
}

export interface IAddLibraryPodcastAct extends Act {
    // 'c:mainView:addLibraryPodcast'
    podcast: ILibraryPodcast;
}


export interface IAddLibraryRadioAct extends Act {
    // 'c:mainView:addLibraryRadio'
    radio: ILibraryRadio;
}


/**
 * For preference view
 */
export interface IPreferenceViewAct extends Act {
    // 'c:mainView:preferenceView'
}


/**
 * For user profile
 */
export interface IShowUserProfileAct extends Act {
    // 'c:mainView:showUserProfileView'
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
    songs: Array<ISong>;
    songsOffset: IOffset;
}

export interface IGetMoreUserFavoriteAlbumsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteAlbums'
    albums: Array<IAlbum>;
    albumsOffset: IOffset;
}

export interface IGetMoreUserFavoriteArtistsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteArtists'
    artists: Array<IArtist>;
    artistsOffset: IOffset;
}

export interface IGetMoreUserFavoriteCollectionsAct extends Act {
    // 'c:mainView:getMoreUserFavoriteCollections'
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreUserCreatedCollectionsAct extends Act {
    // 'c:mainView:getMoreUserCreatedCollections'
    collections: Array<ICollection>;
    collectionsOffset: IOffset;
}

export interface IGetMoreUserFollowingsAct extends Act {
    // 'c:mainView:getMoreUserFollowings'
    followings: Array<IUserProfile>;
    followingsOffset: IOffset;
}


/**
 * For Sound
 */
export interface IShowPodcastAct extends Act {
    // 'c:mainView:showPodcastView'
    podcast: IPodcast;
}

export interface IShowRadioAct extends Act {
    // 'c:mainView:showRadioView'
    radio: IRadio;
}
