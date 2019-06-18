'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISearchResultProps } from 'chord/workbench/parts/mainView/browser/component/search/props/searchResult';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';
import EpisodeItemView from 'chord/workbench/parts/common/component/episodeItem';
import PodcastItemView from 'chord/workbench/parts/common/component/podcastItem';
import RadioItemView from 'chord/workbench/parts/common/component/radioItem';

import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';

import {
    searchMoreSongs,
    searchMoreAlbums,
    searchMoreArtists,
    searchMoreCollections,

    searchMoreEpisodes,
    searchMorePodcasts,
    searchMoreRadios,
} from 'chord/workbench/parts/mainView/browser/action/searchResult';


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

    _getEpisodesView(size?: number) {
        let episodesView = this.props.episodes.slice(0, size ? size : Infinity).map(
            (episode, index) => (
                <EpisodeItemView
                    key={'episode_search_' + index.toString().padStart(3, '0')}
                    episode={episode}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );
        return episodesView;
    }

    _getPodcastsView(size?: number) {
        let podcastsView = this.props.podcasts.slice(0, size ? size : Infinity).map(
            (podcast, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'podcast_search_' + index.toString().padStart(3, '0')}>
                    <PodcastItemView podcast={podcast} />
                </div>
            )
        );
        return podcastsView;
    }

    _getRadiosView(size?: number) {
        let radiosView = this.props.radios.slice(0, size ? size : Infinity).map(
            (radio, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'radio_search_' + index.toString().padStart(3, '0')}>
                    <RadioItemView radio={radio} />
                </div>
            )
        );
        return radiosView;
    }

    _getSearchNavMenu() {
        let views = [
            { name: 'TOP RESULT', value: 'top' },
            { name: 'SONGS', value: 'songs' },
            { name: 'ARTISTS', value: 'artists' },
            { name: 'ALBUMS', value: 'albums' },
            { name: 'COLLECTIONS', value: 'collections' },
            { name: 'PODCASTS', value: 'podcasts' },
            { name: 'RADIOS', value: 'radios' },
            { name: 'EPISODES', value: 'episodes' },
        ];

        return <NavMenu
            namespace='search-navmenu'
            thisView={SearchResult.view}
            views={views}
            handleClick={this.changeSearchResultView} />;
    }

    topResult() {
        // TODO: Get size from config
        let defaultSize = 30;
        let songsView = this._getSongsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);
        let artistsView = this._getArtistsView(defaultSize);
        let collectionsView = this._getCollectionsView(defaultSize);

        let episodesView = this._getEpisodesView(defaultSize);
        let podcastsView = this._getPodcastsView(defaultSize);
        let radiosView = this._getRadiosView(defaultSize);

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

                        {/* Podcasts View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Podcasts</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {podcastsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Radios View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Radios</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {radiosView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Episodes View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Episodes</h1>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {episodesView}
                                </ol>
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
        let offset = this.props.songsOffset;

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
                                        onClick={() => this.props.searchMoreSongs(keyword, offset)}>
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
        let offset = this.props.artistsOffset;

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
                                        onClick={() => this.props.searchMoreArtists(keyword, offset)}>
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
        let offset = this.props.albumsOffset;

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
                                        onClick={() => this.props.searchMoreAlbums(keyword, offset)}>
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
        let offset = this.props.collectionsOffset;

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
                                        onClick={() => this.props.searchMoreCollections(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        );
    }

    episodesResult() {
        let episodesView = this._getEpisodesView();
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.episodesOffset;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Episodes View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Episodes</h1>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {episodesView}
                                </ol>
                            </section>
                        </div>

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.searchMoreEpisodes(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }

    podcastsResult() {
        let podcastsView = this._getPodcastsView();
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.podcastsOffset;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Podcasts View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Podcasts</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {podcastsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.searchMorePodcasts(keyword, offset)}>
                                        View More</div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        );
    }

    radiosResult() {
        let radiosView = this._getRadiosView();
        let searchNavMenu = this._getSearchNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.radiosOffset;

        return (
            <div>

                {/* Search Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Radios View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Radios</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {radiosView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className='row'>
                            <div className="view-more">
                                <div className="view-more-button">
                                    <div className="btn btn-fg-green"
                                        onClick={() => this.props.searchMoreRadios(keyword, offset)}>
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

            case 'podcasts':
                return this.podcastsResult();
            case 'radios':
                return this.radiosResult();
            case 'episodes':
                return this.episodesResult();

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
        searchMoreSongs: (keyword, offset) => searchMoreSongs(keyword, offset).then(act => dispatch(act)),
        searchMoreAlbums: (keyword, offset) => searchMoreAlbums(keyword, offset).then(act => dispatch(act)),
        searchMoreArtists: (keyword, offset) => searchMoreArtists(keyword, offset).then(act => dispatch(act)),
        searchMoreCollections: (keyword, offset) => searchMoreCollections(keyword, offset).then(act => dispatch(act)),

        searchMoreEpisodes: (keyword, offset) => searchMoreEpisodes(keyword, offset).then(act => dispatch(act)),
        searchMorePodcasts: (keyword, offset) => searchMorePodcasts(keyword, offset).then(act => dispatch(act)),
        searchMoreRadios: (keyword, offset) => searchMoreRadios(keyword, offset).then(act => dispatch(act)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
