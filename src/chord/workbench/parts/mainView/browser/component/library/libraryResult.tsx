'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import ArtistItemView from 'chord/workbench/parts/common/component/artistItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';
import UserProfileItemView from 'chord/workbench/parts/common/component/userProfileItem';

import EpisodeItemView from 'chord/workbench/parts/common/component/episodeItem';
import PodcastItemView from 'chord/workbench/parts/common/component/podcastItem';
import RadioItemView from 'chord/workbench/parts/common/component/radioItem';

import { ViewMorePlusItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';

import {
    getMoreSongs,
    getMoreAlbums,
    getMoreArtists,
    getMoreCollections,
    getMoreUserProfiles,

    getMoreEpisodes,
    getMorePodcasts,
    getMoreRadios,
} from 'chord/workbench/parts/mainView/browser/action/libraryResult';
import { handlePlayLibrarySongs } from 'chord/workbench/parts/player/browser/action/playLibrarySongs';

import { ILibraryResultProps } from 'chord/workbench/parts/mainView/browser/component/library/props/libraryResult';


class LibraryResult extends React.Component<ILibraryResultProps, any> {

    static view: string

    constructor(props: ILibraryResultProps) {
        super(props);

        if (!LibraryResult.view) {
            LibraryResult.view = this.props.view;
        }

        this.state = { view: LibraryResult.view };

        this.changeLibraryResultView = this.changeLibraryResultView.bind(this);

        this._itemWrap = this._itemWrap.bind(this);

        this._getSongsView = this._getSongsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getArtistsView = this._getArtistsView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
        this._getUserProfilesView = this._getUserProfilesView.bind(this);

        this._getEpisodesView = this._getEpisodesView.bind(this);
        this._getPodcastsView = this._getPodcastsView.bind(this);
        this._getRadiosView = this._getRadiosView.bind(this);

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
                    key={makeListKey(index, 'song', 'library')}
                    song={userSong.song}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _itemWrap(item, index, name) {
        return (
            <div key={makeListKey(index, name, 'library')}
                className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'>
                {item}
            </div>
        );
    }

    _getAlbumsView(size?: number) {
        let albumsView = this.props.albums.slice(0, size ? size : Infinity).map(
            (userAlbum, index) => (
                this._itemWrap(
                    <AlbumItemView album={userAlbum.album} />, index, 'album')
            )
        );
        return albumsView;
    }

    _getArtistsView(size?: number) {
        let artistsView = this.props.artists.slice(0, size ? size : Infinity).map(
            (userArtist, index) => (
                this._itemWrap(<ArtistItemView artist={userArtist.artist} />, index, 'artist')
            )
        );
        return artistsView;
    }

    _getCollectionsView(size?: number) {
        let collectionsView = this.props.collections.slice(0, size ? size : Infinity).map(
            (userCollection, index) => (
                this._itemWrap(<CollectionItemView collection={userCollection.collection} />, index, 'collection')
            )
        );
        return collectionsView;
    }

    _getUserProfilesView(size?: number) {
        let userProfilesView = this.props.userProfiles.slice(0, size ? size : Infinity).map(
            (userUserProfile, index) => (
                this._itemWrap(<UserProfileItemView userProfile={userUserProfile.userProfile} />, index, 'userProfile')
            )
        );
        return userProfilesView;
    }

    _getEpisodesView(size?: number) {
        let episodesView = this.props.episodes.slice(0, size ? size : Infinity).map(
            (userEpisode, index) => (
                <EpisodeItemView
                    key={makeListKey(index, 'episode', 'library')}
                    episode={userEpisode.episode}
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
            (userPodcast, index) => (
                this._itemWrap(
                    <PodcastItemView podcast={userPodcast.podcast} />, index, 'podcast')
            )
        );
        return podcastsView;
    }

    _getRadiosView(size?: number) {
        let radiosView = this.props.radios.slice(0, size ? size : Infinity).map(
            (userRadio, index) => (
                this._itemWrap(<RadioItemView radio={userRadio.radio} />, index, 'radio')
            )
        );
        return radiosView;
    }

    _getLibraryNavMenu() {
        let views = [
            { name: 'TOP RESULT', value: 'top' },
            { name: 'SONGS', value: 'songs' },
            { name: 'ARTISTS', value: 'artists' },
            { name: 'ALBUMS', value: 'albums' },
            { name: 'COLLECTIONS', value: 'collections' },
            { name: 'USERS', value: 'userProfiles' },

            { name: 'PODCASTS', value: 'podcasts' },
            { name: 'RADIOS', value: 'radios' },
            { name: 'EPISODES', value: 'episodes' },
        ];

        return <NavMenu
            namespace='search-navmenu'
            thisView={LibraryResult.view}
            views={views}
            handleClick={this.changeLibraryResultView} />;
    }

    topResult() {
        let defaultSize = 10;

        let songsView = this._getSongsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);
        let artistsView = this._getArtistsView(defaultSize);
        let collectionsView = this._getCollectionsView(defaultSize);
        let userProfilesView = this._getUserProfilesView(defaultSize);

        let episodesView = this._getEpisodesView(defaultSize);
        let podcastsView = this._getPodcastsView(defaultSize);
        let radiosView = this._getRadiosView(defaultSize);


        let searchNavMenu = this._getLibraryNavMenu();

        let makeItemsView = (name, itemsView) => (
            <div className='row'>
                <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                    {name}</h1>
                <section>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap row'>
                            {itemsView}
                        </div>
                    </div>
                </section>
            </div>
        );

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
                        {makeItemsView('Artists', artistsView)}

                        {/* Albums View */}
                        {makeItemsView('Albums', albumsView)}

                        {/* Collections View */}
                        {makeItemsView('Collections', collectionsView)}

                        {/* UserProfiles View */}
                        {makeItemsView('Followings', userProfilesView)}

                        {/* Podcasts View */}
                        {makeItemsView('Podcasts', podcastsView)}

                        {/* Radios View */}
                        {makeItemsView('Radios', radiosView)}

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

    _itemsResult(itemsView, viewMore) {
        let searchNavMenu = this._getLibraryNavMenu();

        return (
            <div>

                {/* Library Result Nagivation Menu */}
                {searchNavMenu}

                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Items View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Artists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {itemsView}
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

    artistsResult() {
        let artistsView = this._getArtistsView();
        let keyword = this.props.keyword;
        let offset = this.props.artistsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreArtists(keyword, offset, size)} />) : null;

        return this._itemsResult(artistsView, viewMore);
    }

    albumsResult() {
        let albumsView = this._getAlbumsView();
        let keyword = this.props.keyword;
        let offset = this.props.albumsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreAlbums(keyword, offset, size)} />) : null;

        return this._itemsResult(albumsView, viewMore);
    }

    collectionsResult() {
        let collectionsView = this._getCollectionsView();
        let keyword = this.props.keyword;
        let offset = this.props.collectionsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreCollections(keyword, offset, size)} />) : null;

        return this._itemsResult(collectionsView, viewMore);
    }

    userProfilesResult() {
        let userProfilesView = this._getUserProfilesView();
        let keyword = this.props.keyword;
        let offset = this.props.userProfilesOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreUserProfiles(keyword, offset, size)} />) : null;

        return this._itemsResult(userProfilesView, viewMore);
    }

    episodesResult() {
        let episodesView = this._getEpisodesView();
        let searchNavMenu = this._getLibraryNavMenu();
        let keyword = this.props.keyword;
        let offset = this.props.episodesOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreEpisodes(keyword, offset, size)} />) : null;

        return (
            <div>

                {/* Library Result Nagivation Menu */}
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

                        {viewMore}

                    </div>
                </div>
            </div>
        );
    }

    podcastsResult() {
        let podcastsView = this._getPodcastsView();
        let keyword = this.props.keyword;
        let offset = this.props.podcastsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMorePodcasts(keyword, offset, size)} />) : null;

        return this._itemsResult(podcastsView, viewMore);
    }

    radiosResult() {
        let radiosView = this._getRadiosView();
        let keyword = this.props.keyword;
        let offset = this.props.radiosOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreRadios(keyword, offset, size)} />) : null;

        return this._itemsResult(radiosView, viewMore);
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

            case 'episodes':
                return this.episodesResult();
            case 'podcasts':
                return this.podcastsResult();
            case 'radios':
                return this.radiosResult();

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

        getMoreEpisodes: (keyword, offset, size) => dispatch(getMoreEpisodes(keyword, offset, size)),
        getMorePodcasts: (keyword, offset, size) => dispatch(getMorePodcasts(keyword, offset, size)),
        getMoreRadios: (keyword, offset, size) => dispatch(getMoreRadios(keyword, offset, size)),

        handlePlayLibrarySongs: () => handlePlayLibrarySongs().then(act => dispatch(act)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LibraryResult);
