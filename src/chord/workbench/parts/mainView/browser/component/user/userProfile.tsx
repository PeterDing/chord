'use strict';

import 'chord/css!../../media/userProfile';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { IUserProfileViewProps } from 'chord/workbench/parts/mainView/browser/component/user/props/userProfile';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import {
    getMoreFavoriteSongs,
    getMoreFavoriteArtists,
    getMoreFavoriteAlbums,
    getMoreFavoriteCollections,
    getMoreCreatedCollections,
} from 'chord/workbench/parts/mainView/browser/action/userProfile';
import { handlePlayUserFavoriteSongs } from 'chord/workbench/parts/player/browser/action/playUser';

import { MenuButton } from 'chord/workbench/parts/common/component/buttons';
import { showUserProfileMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { musicApi } from 'chord/music/core/api';


function UserProfileNavMenu({ view, changeUserNavMenuView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'overview' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('overview')}>
                        OVERVIEW</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'artists' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('artists')}>
                        ARTISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'albums' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('albums')}>
                        ALBUMS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'favoriteCollections' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('favoriteCollections')}>
                        FAVORITE PLAYLISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'createdCollections' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('createdCollections')}>
                        CREATED PLAYLISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'followings' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeUserNavMenuView('followings')}>
                        FOLLOWINGS</div>
                </li>

            </ul>
        </nav>
    );
}


class UserProfileView extends React.Component<IUserProfileViewProps, any> {

    static view: string

    constructor(props: IUserProfileViewProps) {
        super(props);

        if (!UserProfileView.view) {
            UserProfileView.view = this.props.view;
        }

        this.state = { view: UserProfileView.view };

        this.changeUserNavMenuView = this.changeUserNavMenuView.bind(this);

        this._getUserProfileHeader = this._getUserProfileHeader.bind(this);

        this._getSongsView = this._getSongsView.bind(this);
        this._getArtistsView = this._getArtistsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getFavoriteCollectionsView = this._getFavoriteCollectionsView.bind(this);
        this._getCreatedCollectionsView = this._getCreatedCollectionsView.bind(this);
        // this._getFollowingsView = this._getFollowingsView.bind(this);

        this._itemsView = this._itemsView.bind(this);

        this.overviewView = this.overviewView.bind(this);
        this.viewMore = this.viewMore.bind(this);
        this.songsView = this.songsView.bind(this);
        this.artistsView = this.artistsView.bind(this);
        this.albumsView = this.albumsView.bind(this);
        this.favoriteCollectionsView = this.favoriteCollectionsView.bind(this);
        this.createdCollectionsView = this.createdCollectionsView.bind(this);
        // this.followingsView = this.followingsView.bind(this);
    }

    componentDidMount() {
        // Scroll to document top
        window.scroll(0, 0);
    }

    changeUserNavMenuView(view: string) {
        UserProfileView.view = view;
        this.setState({ view });
    }

    _getSongsView(size?: number) {
        let userProfile = this.props.userProfile;
        let songsView = userProfile.songs.slice(0, size ? size : Infinity).map(
            (song, index) => (
                <SongItemView
                    key={'user_song_' + index.toString().padStart(4, '0')}
                    song={song}
                    active={false}
                    short={false}
                    thumb={true}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _getArtistsView(size?: number) {
        let userProfile = this.props.userProfile;
        let artistsView = userProfile.artists.slice(0, size ? size : Infinity).map(
            (artist, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'user_artist_' + index.toString().padStart(4, '0')}>
                    <ArtistItemView artist={artist} />
                </div>
            )
        );
        return artistsView;
    }

    _getAlbumsView(size?: number) {
        let userProfile = this.props.userProfile;
        let albumsView = userProfile.albums.slice(0, size ? size : Infinity).map(
            (album, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'user_album_' + index.toString().padStart(4, '0')}>
                    <AlbumItemView album={album} />
                </div>
            )
        );
        return albumsView;
    }

    _getFavoriteCollectionsView(size?: number) {
        let userProfile = this.props.userProfile;
        let favoriteCollectionsView = userProfile.favoriteCollections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'user_collection_' + index.toString().padStart(4, '0')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return favoriteCollectionsView;
    }

    _getCreatedCollectionsView(size?: number) {
        let userProfile = this.props.userProfile;
        let createdCollectionsView = userProfile.createdCollections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'user_collection_' + index.toString().padStart(4, '0')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return createdCollectionsView;
    }

    _getUserProfileHeader() {
        // Maybe need to set background image
        let userProfile = this.props.userProfile;
        let cover = userProfile.userAvatarPath || musicApi.resizeImageUrl(userProfile.origin, userProfile.userAvatarUrl.split('@')[0], ESize.Big);
        return (
            <header className='user-header user-info'>
                <figure className="avatar user-avatar"
                    style={{ backgroundImage: `url("${cover}")`, width: '200px', height: '200px', left: '40%' }}></figure>
                <h1 className='user-name'>{userProfile.userName}</h1>
                <div className='header-buttons'>
                    <button className='btn btn-green'
                        onClick={() => this.props.handlePlayUserFavoriteSongs(userProfile)}>
                        PLAY FAVORITE SONGS</button>
                    <MenuButton click={(e) => this.props.showUserProfileMenu(e, userProfile)} />
                </div>
                <UserProfileNavMenu
                    view={UserProfileView.view}
                    changeUserNavMenuView={this.changeUserNavMenuView} />
            </header>
        );
    }

    overviewView() {
        let defaultSize = 10;
        let songsView = this._getSongsView(defaultSize);
        let artistsView = this._getArtistsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);
        let favoriteCollectionsView = this._getFavoriteCollectionsView(defaultSize);
        let createdCollectionsView = this._getCreatedCollectionsView(defaultSize);
        // let followingsView = this._getFollowingsView(defaultSize);

        let makeItemsView = (view, title) => (
            <section className='artist-albums'>
                <div className='contentSpacing'>
                    <h1 className='search-result-title' style={{ textAlign: 'center' }}>{title}</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {view}
                        </div>
                    </div>
                </div>
            </section>
        );

        return (
            <div>
                {/* Songs */}
                <section className='artist-music container-fluid'>
                    <div className='row'>
                        <div className='contentSpacing'>
                            <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                                <h1 className='search-result-title' style={{ textAlign: 'center' }}>Songs</h1>
                                <section className='tracklist-container full-width'>
                                    <ol>
                                        {songsView}
                                    </ol>
                                </section>
                            </section>
                        </div>
                    </div>
                </section>

                {/* Artists */}
                {makeItemsView(artistsView, 'Artists')}

                {/* Albums */}
                {makeItemsView(albumsView, 'Albums')}

                {/* Liked Collections */}
                {makeItemsView(favoriteCollectionsView, 'Favorite Collections')}

                {/* Created Collections */}
                {makeItemsView(createdCollectionsView, 'Created Collections')}

            </div>
        );
    }

    viewMore(handler: (size) => any) {
        return (
            <div className='row'>
                <div className="view-more row">
                    <div className="btn btn-fg-green"
                        onClick={() => handler(10)}>
                        View More +10</div>

                    <div className="btn btn-fg-green"
                        onClick={() => handler(20)}>
                        View More +20</div>

                    <div className="btn btn-fg-green"
                        onClick={() => handler(50)}>
                        View More +50</div>

                    <div className="btn btn-fg-green"
                        onClick={() => handler(100)}>
                        View More +100</div>

                    <div className="btn btn-fg-green"
                        onClick={() => handler(500)}>
                        View More +500</div>

                    <div className="btn btn-fg-green"
                        onClick={() => handler(1000)}>
                        View More +1000</div>
                </div>
            </div>
        );
    }

    songsView() {
        let userProfile = this.props.userProfile;
        let songsView = this._getSongsView();
        let offset = this.props.songsOffset;
        let viewMore = offset.more ? this.viewMore((size) => this.props.getMoreFavoriteSongs(userProfile, offset, size)) : null;

        return (
            <section className='artist-music container-fluid'>
                <div className='row'>
                    <div className='contentSpacing'>
                        <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                            { /* No Show */}
                            <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>Songs</h1>
                            <section className='tracklist-container full-width'>
                                <ol>
                                    {songsView}
                                </ol>
                            </section>
                        </section>
                    </div>
                </div>

                {viewMore}

            </section>
        );
    }

    _itemsView(view, handler, offset, title) {
        let userProfile = this.props.userProfile;

        return (
            <section className='artist-albums'>
                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>{title}</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {view}
                        </div>
                    </div>

                    <div className='row'>
                        <div className="view-more">
                            <div className="view-more-button">
                                <div className="btn btn-fg-green"
                                    onClick={() => handler(userProfile, offset)}>
                                    View More</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }

    artistsView() {
        return this._itemsView(
            this._getArtistsView(),
            this.props.getMoreFavoriteArtists,
            this.props.artistsOffset,
            'ARTISTS'
        );
    }

    albumsView() {
        return this._itemsView(
            this._getAlbumsView(),
            this.props.getMoreFavoriteAlbums,
            this.props.albumsOffset,
            'ALBUMS'
        );
    }

    favoriteCollectionsView() {
        return this._itemsView(
            this._getFavoriteCollectionsView(),
            this.props.getMoreFavoriteCollections,
            this.props.favoriteCollectionsOffset,
            'FAVORITE PLAYLISTS'
        );
    }

    createdCollectionsView() {
        return this._itemsView(
            this._getCreatedCollectionsView(),
            this.props.getMoreCreatedCollections,
            this.props.createdCollectionsOffset,
            'CREATED PLAYLISTS'
        );
    }

    render() {
        let userHeaderView = this._getUserProfileHeader();
        let view = UserProfileView.view;
        let contentView = null;
        if (view == 'overview') {
            contentView = this.overviewView();
        } else if (view == 'songs') {
            contentView = this.songsView();
        } else if (view == 'artists') {
            contentView = this.artistsView();
        } else if (view == 'albums') {
            contentView = this.albumsView();
        } else if (view == 'favoriteCollections') {
            contentView = this.favoriteCollectionsView();
        } else if (view == 'createdCollections') {
            contentView = this.createdCollectionsView();
        } else {
            return null;
        }

        return (
            <div className='hw-accelerate'>
                <section className='content artist'>
                    {userHeaderView}
                    {contentView}
                </section>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return state.mainView.userProfileView;
}

function mapDispatchToProps(dispatch) {
    return {
        getMoreFavoriteSongs: (userProfile, offset, size) => getMoreFavoriteSongs(userProfile, offset, size).then(act => dispatch(act)),
        getMoreFavoriteArtists: (userProfile, offset) => getMoreFavoriteArtists(userProfile, offset).then(act => dispatch(act)),
        getMoreFavoriteAlbums: (userProfile, offset) => getMoreFavoriteAlbums(userProfile, offset).then(act => dispatch(act)),
        getMoreFavoriteCollections: (userProfile, offset) => getMoreFavoriteCollections(userProfile, offset).then(act => dispatch(act)),
        getMoreCreatedCollections: (userProfile, offset) => getMoreCreatedCollections(userProfile, offset).then(act => dispatch(act)),
        handlePlayUserFavoriteSongs: userProfile => handlePlayUserFavoriteSongs(userProfile).then(act => dispatch(act)),
        showUserProfileMenu: (e, userProfile) => dispatch(showUserProfileMenu(e, userProfile)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileView);
