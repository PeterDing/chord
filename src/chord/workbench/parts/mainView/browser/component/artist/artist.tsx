'use strict';

import 'chord/css!../../media/artist';

import * as React from 'react';
import { connect } from 'react-redux';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { IArtistViewProps } from 'chord/workbench/parts/mainView/browser/component/artist/props/artist';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import { ViewMorePlusItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import { getMoreSongs, getMoreAlbums } from 'chord/workbench/parts/mainView/browser/action/artist';
import { handlePlayArtist } from 'chord/workbench/parts/player/browser/action/playArtist';

import { MenuButton } from 'chord/workbench/parts/common/component/buttons';
import { showArtistMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { musicApi } from 'chord/music/core/api';


function ArtistNavMenu({ view, changeArtistNavMenuView }) {
    return (
        <nav className='search-nav-container'>
            <ul className='search-nav-ul'>
                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'overview' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeArtistNavMenuView('overview')}>
                        OVERVIEW</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'songs' ? 'search-nav-item__active' : ''}`}
                        onClick={() => changeArtistNavMenuView('songs')}>
                        SONGS</div>
                </li>

                <li className='search-nav-li'>
                    <div className={`search-nav-item link-subtle cursor-pointer ${view == 'albums' ? 'search-nav-item__active' : ''}`}
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
        let cover = artist.artistAvatarPath || musicApi.resizeImageUrl(artist.origin, artist.artistAvatarUrl, ESize.Large);
        let likeAndPlayCount = getLikeAndPlayCount(artist);
        return (
            <header className='artist-header'
                style={{
                    backgroundImage: `url("${cover}")`,
                    backgroundPosition: '100% 12%',
                }}>
                <span className='monthly-listeners'>{'\u00A0'}</span>
                <h1 className='large'>{artist.artistName}</h1>

                {/* like count and play count */}
                <h1 className='small' style={{ opacity: 0.4 }}>{likeAndPlayCount}</h1>

                <div className='header-buttons'>
                    <button className='btn btn-green cursor-pointer'
                        onClick={() => this.props.handlePlayArtist(artist)}>
                        PLAY</button>
                    <MenuButton click={(e) => this.props.showArtistMenu(e, artist)} />
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
        let artist = this.props.artist;

        return (
            <div>
                <div className='artist-description'
                    dangerouslySetInnerHTML={{ __html: artist.description }}>
                </div>

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
        let offset = this.props.songsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreSongs(artist, offset, size)} />) : null;

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

                {viewMore}

            </section>
        );
    }

    albumsView() {
        let artist = this.props.artist;
        let albumsView = this._getAlbumsView();
        let offset = this.props.albumsOffset;
        let viewMore = offset.more ? (<ViewMorePlusItem handler={(size) => this.props.getMoreAlbums(artist, offset, size)} />) : null;

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

                    {viewMore}

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
        getMoreSongs: (artist, offset, size) => getMoreSongs(artist, offset, size).then(act => dispatch(act)),
        getMoreAlbums: (artist, offset, size) => getMoreAlbums(artist, offset, size).then(act => dispatch(act)),
        handlePlayArtist: artist => handlePlayArtist(artist).then(act => dispatch(act)),
        showArtistMenu: (e, artist) => dispatch(showArtistMenu(e, artist)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(ArtistView);
