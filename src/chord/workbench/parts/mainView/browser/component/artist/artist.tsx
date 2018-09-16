'use strict';

import 'chord/css!../../media/artist';

import * as React from 'react';
import { connect } from 'react-redux';


import { IArtistViewProps } from 'chord/workbench/parts/mainView/browser/component/artist/props/artist';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';

import { getMoreSongs, getMoreAlbums } from 'chord/workbench/parts/mainView/browser/action/artist';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';


function ArtistNavMenu({ view, changeArtistNavMenuView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'overview' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeArtistNavMenuView('overview')}>
                        OVERVIEW</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeArtistNavMenuView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle ${view == 'albums' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeArtistNavMenuView('albums')}>
                        ALBUMS</div>
                </li>

            </ul>
        </nav>
    );
}


class ArtistView extends React.Component<IArtistViewProps, any> {

    static view: string

    constructor(props: IArtistViewProps) {
        super(props);

        if (!ArtistView.view) {
            ArtistView.view = this.props.view;
        }

        this.state = { view: ArtistView.view };

        this.changeArtistNavMenuView = this.changeArtistNavMenuView.bind(this);

        this._getSongsView = this._getSongsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getArtistHeader = this._getArtistHeader.bind(this);

        this.overviewView = this.overviewView.bind(this);
        this.songsView = this.songsView.bind(this);
        this.albumsView = this.albumsView.bind(this);
    }

    componentDidMount() {
        // Scroll to document top
        window.scroll(0, 0);
    }

    changeArtistNavMenuView(view: string) {
        ArtistView.view = view;
        this.setState({ view });
    }

    _getSongsView(size?: number) {
        let artist = this.props.artist;
        let songsView = artist.songs.slice(0, size ? size : Infinity).map(
            (song, index) => (
                <SongItemView
                    key={'artist_song_' + index.toString().padStart(3, '0')}
                    song={song}
                    active={false}
                    short={false}
                    thumb={true}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _getAlbumsView(size?: number) {
        let artist = this.props.artist;
        let albumsView = artist.albums.slice(0, size ? size : Infinity).map(
            (album, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'artist_album_' + index.toString().padStart(3, '0')}>
                    <AlbumItemView album={album} />
                </div>
            )
        );
        return albumsView;
    }

    _getArtistHeader() {
        // Maybe need to set background image
        let artist = this.props.artist;
        return (
            <header className='artist-header'
                style={{
                    backgroundImage: `url("${artist.artistAvatarUrl}")`,
                    backgroundPosition: '100% 12%',
                }}>
                <span className='monthly-listeners'>{'\u00A0'}</span>
                <h1 className='large'>{artist.artistName}</h1>
                <div className='header-buttons'>
                    <button className='btn btn-green'
                        onClick={() => this.props.handlePlayArtist(artist)}>
                        PLAY</button>
                </div>
                <ArtistNavMenu
                    view={ArtistView.view}
                    changeArtistNavMenuView={this.changeArtistNavMenuView} />
            </header>
        );
    }

    overviewView() {
        let defaultSize = 10;
        let songsView = this._getSongsView(defaultSize);
        let albumsView = this._getAlbumsView(defaultSize);

        return (
            <div>
                {/* Top Songs */}
                <section className='artist-music container-fluid'>
                    <div className='row'>
                        <div className='contentSpacing'>
                            <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                                <h1 className='search-result-title' style={{ textAlign: 'center' }}>Popular</h1>
                                <section className='tracklist-container full-width'>
                                    <ol>
                                        {songsView}
                                    </ol>
                                </section>
                            </section>
                        </div>
                    </div>
                </section>

                {/* Albums */}
                <section className='artist-albums'>
                    <div className='contentSpacing'>
                        <h1 className='search-result-title' style={{ textAlign: 'center' }}>Albums</h1>
                        <div className='container-fluid container-fluid--noSpaceAround'>
                            <div className='align-row-wrap grid--limit row'>
                                {albumsView}
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }

    songsView() {
        let artist = this.props.artist;
        let songsView = this._getSongsView();
        let page = this.props.songsPage;

        return (
            <section className='artist-music container-fluid'>
                <div className='row'>
                    <div className='contentSpacing'>
                        <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                            { /* No Show */}
                            <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>Popular</h1>
                            <section className='tracklist-container full-width'>
                                <ol>
                                    {songsView}
                                </ol>
                            </section>
                        </section>
                    </div>
                </div>

                <div className='row'>
                    <div className="view-more">
                        <div className="view-more-button">
                            <div className="btn btn-fg-green"
                                onClick={() => this.props.getMoreSongs(artist, page)}>
                                View More</div>
                        </div>
                    </div>
                </div>

            </section>
        );
    }

    albumsView() {
        let artist = this.props.artist;
        let albumsView = this._getAlbumsView();
        let page = this.props.albumsPage;

        return (
            <section className='artist-albums'>
                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>Albums</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {albumsView}
                        </div>
                    </div>

                    <div className='row'>
                        <div className="view-more">
                            <div className="view-more-button">
                                <div className="btn btn-fg-green"
                                    onClick={() => this.props.getMoreAlbums(artist, page)}>
                                    View More</div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
        );
    }


    render() {
        let artistHeaderView = this._getArtistHeader();
        let view = ArtistView.view;
        let contentView = null;
        if (view == 'overview') {
            contentView = this.overviewView();
        } else if (view == 'songs') {
            contentView = this.songsView();
        } else if (view == 'albums') {
            contentView = this.albumsView();
        } else {
            return null;
        }

        return (
            <div className='hw-accelerate'>
                <section className='content artist'>
                    {artistHeaderView}
                    {contentView}
                </section>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return state.mainView.artistView;
}

function mapDispatchToProps(dispatch) {
    return {
        getMoreSongs: (artist, page) => getMoreSongs(artist, page).then(act => dispatch(act)),
        getMoreAlbums: (artist, page) => getMoreAlbums(artist, page).then(act => dispatch(act)),
        handlePlayArtist: artist => handlePlayArtist(artist).then(act => dispatch(act)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ArtistView);
