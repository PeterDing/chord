'use strict';

import 'chord/css!../../media/album';

import * as React from 'react';
import { connect } from 'react-redux';

import { getDateYear } from 'chord/base/common/time';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { AlbumIcon } from 'chord/workbench/parts/common/component/common';

import SongItemView from 'chord/workbench/parts/common/component/songItem';

import { handlePlayAlbum } from 'chord/workbench/parts/player/browser/action/playAlbum';

import { IAlbumViewProps } from 'chord/workbench/parts/mainView/browser/component/album/props/album';

import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';

import { showAlbumMenu } from 'chord/workbench/parts/menu/browser/action/menu';


function AlbumEntity({ album, handlePlayAlbum, handleShowArtistViewById, showAlbumMenu }) {
    let cover = album.albumCoverPath || album.albumCoverUrl;
    return (
        <header className='entity-info'>
            <div>
                <div draggable={true}>
                    <div className="media-object">
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => showAlbumMenu(e, album)}>

                                <div className="cover-art shadow cover-art--with-auto-height" aria-hidden="true"
                                    style={{ width: 'auto', height: 'auto' }}>
                                    <div>
                                        {AlbumIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url("${cover}")` }}></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <AlbumInfo album={album}
                handlePlayAlbum={handlePlayAlbum}
                handleShowArtistViewById={handleShowArtistViewById} />
        </header>
    );
}


function AlbumInfo({ album, handlePlayAlbum, handleShowArtistViewById }) {
    return (
        <div className='media-bd'>
            <div className='entity-name'>
                <h2>{album.albumName}</h2>
                <div>
                    <span>By </span>
                    <span className='link-subtle'
                        onClick={() => handleShowArtistViewById(album.artistId)}>
                        {album.artistName}</span>
                </div>
            </div>
            <p className="text-silence entity-additional-info">
                {getDateYear(album.releaseDate)} • {album.songCount} tracks
            </p>
            <button className="btn btn-green"
                onClick={() => handlePlayAlbum(album)}>PLAY</button>
        </div>
    );
}


class AlbumView extends React.Component<IAlbumViewProps, any> {

    constructor(props: IAlbumViewProps) {
        super(props);
    }

    componentDidMount() {
        // Scroll to document top
        window.scroll(0, 0);
    }

    render() {
        let album = this.props.album;
        let songsView = album.songs.map(
            (song, index) => (
                <SongItemView
                    key={'album_song_' + index.toString().padStart(3, '0')}
                    song={song}
                    active={false}
                    short={true}
                    thumb={false}
                    handlePlay={null} />
            )
        );

        return (
            <div className='hw-accelerate'>
                <div className='contentSpacing'>
                    <section className='content album'>
                        <div className='container-fluid'>
                            <div className='row'>

                                <div className='col-xs-12 col-lg-3 col-xl-4 col-sticky'>
                                    <AlbumEntity album={album}
                                        handlePlayAlbum={this.props.handlePlayAlbum}
                                        handleShowArtistViewById={this.props.handleShowArtistViewById} 
                                        showAlbumMenu={this.props.showAlbumMenu}/>
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8'>
                                    <section className='tracklist-container'>
                                        <ol className='tracklist'>
                                            {songsView}
                                        </ol>
                                    </section>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        album: state.mainView.albumView.album,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlayAlbum: album => handlePlayAlbum(album).then(act => dispatch(act)),
        handleShowArtistViewById: artistId => handleShowArtistViewById(artistId).then(act => dispatch(act)),
        showAlbumMenu: (e, album) => dispatch(showAlbumMenu(e, album)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(AlbumView);
