'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { getHumanDuration } from 'chord/base/common/time';
import { ISong } from 'chord/music/api/song';
import { ISongItemViewProps } from 'chord/workbench/parts/common/props/songItem';
import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';

import { PlayIcon, PlayListIcon } from 'chord/workbench/parts/common/component/common';

import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowAlbumViewById } from 'chord/workbench/parts/mainView/browser/action/showAlbum';

import { showSongMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { musicApi } from 'chord/music/core/api';


class SongItemView extends React.Component<ISongItemViewProps, object> {

    constructor(props: ISongItemViewProps) {
        super(props);
    }

    render() {
        let song = this.props.song;
        let handlePlay = this.props.handlePlay ?
            this.props.handlePlay : () => this.props.handlePlayOne(song);

        let liClassName = this.props.active ?
            (this.props.short ?
                'tracklist-row tracklist-row--oneline tracklist-row--active'
                : 'tracklist-row tracklist-row--active')
            : (this.props.short ? 'tracklist-row tracklist-row--oneline' : 'tracklist-row');

        let tracklistAlign = this.props.short ? 'tracklist-middle-align' : 'tracklist-top-align';
        let originIcon = OriginIcon(song.origin, 'tracklist-col xiami-icon');

        let secondLine = this.props.short ? null : (
            <span className='second-line ellipsis-one-line'>
                {/* Artist Name */}
                <span className='react-contextmenu-wrapper'>
                    <span draggable={true}>
                        <span className='link-subtle' tabIndex={-1}
                            onClick={() => this.props.handleShowArtistViewById(song.artistId)}>
                            {song.artistName}</span>
                    </span>
                </span>

                <span className="second-line-separator" aria-label="in album">•</span>

                {/* Album Name */}
                <span className="react-contextmenu-wrapper">
                    <span draggable={true}>
                        <span className='link-subtle' tabIndex={-1}
                            onClick={() => this.props.handleShowAlbumViewById(song.albumId)}>
                            {song.albumName}</span>
                    </span>
                </span>
            </span>
        );

        let cover = song.albumCoverPath || musicApi.resizeImageUrl(song.origin, song.albumCoverUrl, ESize.Small);
        let coverThumbView = this.props.thumb ? (
            <div className='tracklist-col tracklist-col-cover-art-thumb'>
                <div className='cover-art shadow tracklist-middle-align cover-art--with-auto-height'
                    style={{ width: '50px', height: 'auto' }}>
                    <div>
                        {PlayListIcon}
                        <div className='cover-art-image cover-art-image-loaded'
                            style={{ backgroundImage: `url("${cover}")` }}>
                        </div>
                    </div>
                </div>
            </div>
        ) : null;

        return (
            <div className='react-contextmenu-wrapper'>
                <div draggable={true}
                    onContextMenu={(e) => this.props.showSongMenu(e, song)}>
                    <li className={liClassName} role='button' tabIndex={0}>

                        {/* music icon */}
                        <div className='tracklist-col position-outer' onClick={() => handlePlay()}>
                            <div className={`tracklist-play-pause ${tracklistAlign}`}>{PlayIcon}</div>
                            <div className={`position ${tracklistAlign}`}><span className='spoticon-track-16'></span></div>
                        </div>

                        {/* album cover */}
                        {coverThumbView}

                        <div className='tracklist-col name'>
                            <div className={`track-name-wrapper ellipsis-one-line ${tracklistAlign}`}>

                                {/* Song Name */}
                                <span className='tracklist-name'>
                                    {song.songName}
                                </span>

                                {secondLine}
                            </div>
                        </div>

                        <div className='tracklist-col tracklist-col-duration'>
                            <div className={`tracklist-duration ${tracklistAlign}`}>
                                <span>{getHumanDuration(song.duration)}</span>
                            </div>
                        </div>

                        {/* Origin Icon */}
                        <div className='tracklist-col tracklist-col-duration'>
                            <div className={`${tracklistAlign}`}>
                                <span>{originIcon}</span>
                            </div>
                        </div>
                    </li>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayOne: (song: ISong) => handlePlayOne(song).then(act => dispatch(act)),
        handleShowArtistViewById: (artistId: string) => handleShowArtistViewById(artistId).then(act => dispatch(act)),
        handleShowAlbumViewById: (albumId: string) => handleShowAlbumViewById(albumId).then(act => dispatch(act)),
        showSongMenu: (e: React.MouseEvent<HTMLDivElement>, song: ISong) => dispatch(showSongMenu(e, song)),
    }
}


export default connect(null, mapDispatchToProps)(SongItemView);
