'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISearchResultProps } from 'chord/workbench/parts/mainView/browser/component/search/props/searchResult';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import {
    searchMoreSongs,
    searchMoreAlbums,
    searchMoreArtists,
    searchMoreCollections,
} from 'chord/workbench/parts/mainView/browser/action/searchResult';


function SearchNavMenu({ view, changeSearchResultView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'top' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeSearchResultView('top')}>
                        TOP RESULT</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'artists' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeSearchResultView('artists')}>
                        ARTISTS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeSearchResultView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'albums' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeSearchResultView('albums')}>
                        ALBUMS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'collections' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeSearchResultView('collections')}>
                        PLAYLISTS</div>
                </li>
            </ul>
        </nav>
    );
}


class SearchResult extends React.Component<ISearchResultProps, any> {

    static view: string

    constructor(props: ISearchResultProps) {
        super(props);

        if (!SearchResult.view) {
            SearchResult.view = this.props.view;
        }

        this.state = { view: SearchResult.view };

        this.changeSearchResultView = this.changeSearchResultView.bind(this);

        this._getSongsView = this._getSongsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getArtistsView = this._getArtistsView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
        this._getSearchNavMenu = this._getSearchNavMenu.bind(this);

        this.topResult = this.topResult.bind(this);
        this.songsResult = this.songsResult.bind(this);
        this.artistsResult = this.artistsResult.bind(this);
        this.albumsResult = this.albumsResult.bind(this);
        this.collectionsResult = this.collectionsResult.bind(this);
    }

    changeSearchResultView(view: string) {
        SearchResult.view = view;
        this.setState({ view });
    }

    _getSongsView(size?: number) {
        let songsView = this.props.songs.slice(0, size ? size : Infinity).map(
            (song, index) => (
                <SongItemView
                    key={'song_search_' + index.toString().padStart(3, '0')}
                    song={song}
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
            (album, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'album_search_' + index.toString().padStart(3, '0')}>
                    <AlbumItemView album={album} />
                </div>
            )
        );
        return albumsView;
    }

    _getArtistsView(size?: number) {
        let artistsView = this.props.artists.slice(0, size ? size : Infinity).map(
            (artist, index) => (
                <div key={'artist_search_' + index.toString().padStart(3, '0')}
                    className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'>
                    <ArtistItemView artist={artist} />
                </div>
            )
        );
        return artistsView;
    }

    _getCollectionsView(size?: number) {
        let collectionsView = this.props.collections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'collection_search_' + index.toString().padStart(3, '0')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return collectionsView;
    }

    _getSearchNavMenu() {
        return (
            <SearchNavMenu
                view={SearchResult.view}
                changeSearchResultView={this.changeSearchResultView} />
        );
    }

    topResult() {
        // TODO: Get size from config
        let defaultSize = 30;
        let songsView = this._getSongsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);
        let artistsView = this._getArtistsView(defaultSize);
        let collectionsView = this._getCollectionsView(defaultSize);
        let searchNavMenu = this._getSearchNavMenu();

        return (
            <div>

                {/* Search Result Nagivation Menu */}
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
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let page = this.props.songsPage;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
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
                                        onClick={() => this.props.searchMoreSongs(keyword, page)}>
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
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let page = this.props.artistsPage;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
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
                                        onClick={() => this.props.searchMoreArtists(keyword, page)}>
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
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let page = this.props.albumsPage;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
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
                                        onClick={() => this.props.searchMoreAlbums(keyword, page)}>
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
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let page = this.props.collectionsPage;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
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
                                        onClick={() => this.props.searchMoreCollections(keyword, page)}>
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
        let view = SearchResult.view;
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
        ...state.mainView.searchView.result,
        keyword: state.mainView.searchView.keyword,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        searchMoreSongs: (keyword, page) => searchMoreSongs(keyword, page).then(act => dispatch(act)),
        searchMoreAlbums: (keyword, page) => searchMoreAlbums(keyword, page).then(act => dispatch(act)),
        searchMoreArtists: (keyword, page) => searchMoreArtists(keyword, page).then(act => dispatch(act)),
        searchMoreCollections: (keyword, page) => searchMoreCollections(keyword, page).then(act => dispatch(act)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
