'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import {
    getMoreSongs,
    getMoreAlbums,
    getMoreArtists,
    getMoreCollections,
} from 'chord/workbench/parts/mainView/browser/action/libraryResult';

import { ILibraryResultProps } from 'chord/workbench/parts/mainView/browser/component/library/props/libraryResult';


function LibraryNavMenu({ view, changeLibraryResultView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'top' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('top')}>
                        TOP RESULT</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'artists' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('artists')}>
                        ARTISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'albums' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('albums')}>
                        ALBUMS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'collections' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeLibraryResultView('collections')}>
                        PLAYLISTS</div>
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
        this._getLibraryNavMenu = this._getLibraryNavMenu.bind(this);

        this.topResult = this.topResult.bind(this);
        this.songsResult = this.songsResult.bind(this);
        this.artistsResult = this.artistsResult.bind(this);
        this.albumsResult = this.albumsResult.bind(this);
        this.collectionsResult = this.collectionsResult.bind(this);
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
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {songsView}
                                </ol>
                            </section>
                        </div>

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.getMoreSongs(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

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

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.getMoreArtists(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

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

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.getMoreAlbums(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

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

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.getMoreCollections(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

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
            default: // view == 'top'
                return this.topResult();
        }
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.mainView.libraryView.result,
        keyword: state.mainView.searchView.keyword,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMoreSongs: (keyword, offset) => dispatch(getMoreSongs(keyword, offset)),
        getMoreAlbums: (keyword, offset) => dispatch(getMoreAlbums(keyword, offset)),
        getMoreArtists: (keyword, offset) => dispatch(getMoreArtists(keyword, offset)),
        getMoreCollections: (keyword, offset) => dispatch(getMoreCollections(keyword, offset)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(LibraryResult);
