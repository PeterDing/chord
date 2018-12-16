'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';
import UserProfileItemView from 'chord/workbench/parts/common/component/userProfileItem';

import { ViewMorePlusItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import {
    getMoreSongs,
    getMoreAlbums,
    getMoreArtists,
    getMoreCollections,
    getMoreUserProfiles,
} from 'chord/workbench/parts/mainView/browser/action/libraryResult';
import { handlePlayLibrarySongs } from 'chord/workbench/parts/player/browser/action/playLibrarySongs';

import { ILibraryResultProps } from 'chord/workbench/parts/mainView/browser/component/library/props/libraryResult';


function LibraryNavMenu({ view, changeLibraryResultView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'top' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('top')}>
                        TOP RESULT</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'artists' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('artists')}>
                        ARTISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'albums' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('albums')}>
                        ALBUMS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'collections' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('collections')}>
                        PLAYLISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'userProfiles' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('userProfiles')}>
                        FOLLOWINGS</div>
                </li>
            </ul>
        </nav>
    );
}


class LibraryResult extends React.Component<ILibraryResultProps, any> {

    static view: string

    constructor(props: ILibraryResultProps) {
        super(props);

        if (!LibraryResult.view) {
            LibraryResult.view = this.props.view;
        }

        this.state = { view: LibraryResult.view };

        this.changeLibraryResultView = this.changeLibraryResultView.bind(this);

        this._getSongsView = this._getSongsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getArtistsView = this._getArtistsView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
        this._getUserProfilesView = this._getUserProfilesView.bind(this);
        this._getLibraryNavMenu = this._getLibraryNavMenu.bind(this);

        this.topResult = this.topResult.bind(this);
        this.songsResult = this.songsResult.bind(this);
        this.artistsResult = this.artistsResult.bind(this);
        this.albumsResult = this.albumsResult.bind(this);
        this.collectionsResult = this.collectionsResult.bind(this);
        this.userProfilesResult = this.userProfilesResult.bind(this);
    }

    changeLibraryResultView(view: string) {
        LibraryResult.view = view;
        this.setState({ view });
    }

    _getSongsView(size?: number) {
        let songsView = this.props.songs.slice(0, size ? size : Infinity).map(
            (userSong, index) => (
                <SongItemView
                    key={'song_library_' + index.toString().padStart(3, '0')}
                    song={userSong.song}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _getAlbumsView(size?: number) {
        let albumsView = this.props.albums.slice(0, size ? size : Infinity).map(
            (userAlbum, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'album_library_' + index.toString().padStart(3, '0')}>
                    <AlbumItemView album={userAlbum.album} />
                </div>
            )
        );
        return albumsView;
    }

    _getArtistsView(size?: number) {
        let artistsView = this.props.artists.slice(0, size ? size : Infinity).map(
            (userArtist, index) => (
                <div key={'artist_library_' + index.toString().padStart(3, '0')}
                    className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'>
                    <ArtistItemView artist={userArtist.artist} />
                </div>
            )
        );
        return artistsView;
    }

    _getCollectionsView(size?: number) {
        let collectionsView = this.props.collections.slice(0, size ? size : Infinity).map(
            (userCollection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'collection_library_' + index.toString().padStart(3, '0')}>
                    <CollectionItemView collection={userCollection.collection} />
                </div>
            )
        );
        return collectionsView;
    }

    _getUserProfilesView(size?: number) {
        let userProfilesView = this.props.userProfiles.slice(0, size ? size : Infinity).map(
            (userUserProfile, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'userProfile_library_' + index.toString().padStart(3, '0')}>
                    <UserProfileItemView userProfile={userUserProfile.userProfile} />
                </div>
            )
        );
        return userProfilesView;
    }

    _getLibraryNavMenu() {
        return (
            <LibraryNavMenu
                view={LibraryResult.view}
                changeLibraryResultView={this.changeLibraryResultView} />
        );
    }

    topResult() {
        let defaultSize = 10;
        let songsView = this._getSongsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);
        let artistsView = this._getArtistsView(defaultSize);
        let collectionsView = this._getCollectionsView(defaultSize);
        let userProfilesView = this._getUserProfilesView(defaultSize);
        let searchNavMenu = this._getLibraryNavMenu();

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Songs View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Songs</h1>
                            <button className="btn btn-green btn-small cursor-pointer"
                                style={{ margin: '0px auto 15px', display: 'block' }}
                                onClick={this.props.handlePlayLibrarySongs}>
                                PlAY ALL</button>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {songsView}
                                </ol>
                            </section>
                        </div>

                        {/* Artists View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Artists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {artistsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Albums View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Albums</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {albumsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Collections View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Playlists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {collectionsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* UserProfiles View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Followings</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {userProfilesView}
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    songsResult() {
        let songsView = this._getSongsView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.songsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreSongs(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Songs View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Songs</h1>
                            <button className="btn btn-green btn-small cursor-pointer"
                                style={{ margin: '0px auto 15px', display: 'block' }}
                                onClick={this.props.handlePlayLibrarySongs}>
                                PlAY ALL</button>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {songsView}
                                </ol>
                            </section>
                        </div>

                        {viewMore}

                    </div>
                </div>
            </div>
        );
    }

    artistsResult() {
        let artistsView = this._getArtistsView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.artistsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreArtists(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Artists View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Artists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {artistsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {viewMore}

                    </div>
                </div>
            </div>
        );
    }

    albumsResult() {
        let albumsView = this._getAlbumsView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.albumsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreAlbums(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Albums View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Albums</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {albumsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {viewMore}

                    </div>
                </div>
            </div>

        );
    }

    collectionsResult() {
        let collectionsView = this._getCollectionsView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.collectionsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreCollections(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Collections View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Playlists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {collectionsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {viewMore}

                    </div>
                </div>
            </div>

        );
    }

    userProfilesResult() {
        let artistsView = this._getUserProfilesView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.userProfilesOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreUserProfiles(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Artists View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Artists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {artistsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {viewMore}

                    </div>
                </div>
            </div>
        );
    }

    render() {
        let view = LibraryResult.view;
        switch (view) {
            case 'songs':
                return this.songsResult();
            case 'artists':
                return this.artistsResult();
            case 'albums':
                return this.albumsResult();
            case 'collections':
                return this.collectionsResult();
            case 'userProfiles':
                return this.userProfilesResult();
            default: // view == 'top'
                return this.topResult();
        }
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.mainView.libraryView.result,
        keyword: state.mainView.libraryView.keyword,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMoreSongs: (keyword, offset, size) => dispatch(getMoreSongs(keyword, offset, size)),
        getMoreAlbums: (keyword, offset, size) => dispatch(getMoreAlbums(keyword, offset, size)),
        getMoreArtists: (keyword, offset, size) => dispatch(getMoreArtists(keyword, offset, size)),
        getMoreCollections: (keyword, offset, size) => dispatch(getMoreCollections(keyword, offset, size)),
        getMoreUserProfiles: (keyword, offset, size) => dispatch(getMoreUserProfiles(keyword, offset, size)),

        handlePlayLibrarySongs: () => handlePlayLibrarySongs().then(act => dispatch(act)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LibraryResult);
