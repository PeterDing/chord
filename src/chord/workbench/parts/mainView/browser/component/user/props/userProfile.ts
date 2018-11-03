'use strict';

import { IUserProfile } from 'chord/music/api/user';
import { IOffset } from 'chord/workbench/api/common/state/offset';

import { 
    IGetMoreUserFavoriteSongsAct,
    IGetMoreUserFavoriteArtistsAct,
    IGetMoreUserFavoriteAlbumsAct,
    IGetMoreUserFavoriteCollectionsAct,
    IGetMoreUserCreatedCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';
import { IPlayUserFavoriteSongsAct } from 'chord/workbench/api/common/action/player';
import { IShowUserProfileMenuAct } from 'chord/workbench/api/common/action/menu';


export interface IUserProfileViewProps {
    // 'overview' | 'songs' | 'artists' | 'album' | 'favoriteCollections' | 'createdCollections' | 'followings'
    view: string;

    userProfile: IUserProfile;

    songsOffset: IOffset;
    artistsOffset: IOffset;
    albumsOffset: IOffset;
    favoriteCollectionsOffset: IOffset;
    createdCollectionsOffset: IOffset;
    // followingsOffset: IOffset;

    getMoreFavoriteSongs: (userProfile, offset, size) => Promise<IGetMoreUserFavoriteSongsAct>;
    getMoreFavoriteArtists: (userProfile, offset, size) => Promise<IGetMoreUserFavoriteArtistsAct>;
    getMoreFavoriteAlbums: (userProfile, offset, size) => Promise<IGetMoreUserFavoriteAlbumsAct>;
    getMoreFavoriteCollections: (userProfile, offset, size) => Promise<IGetMoreUserFavoriteCollectionsAct>;
    getMoreCreatedCollections: (userProfile, offset, size) => Promise<IGetMoreUserCreatedCollectionsAct>;
    // getMoreFollowings: (userProfile, offset, size) => Promise<IGetMoreUserFollowingsAct>;

    handlePlayUserFavoriteSongs: (userProfile) => Promise<IPlayUserFavoriteSongsAct>;
    showUserProfileMenu: (e: React.MouseEvent<HTMLDivElement>, userProfile: IUserProfile) => IShowUserProfileMenuAct;
}
