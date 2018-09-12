'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { getHumanDuration } from 'chord/base/common/time';
import { ISong } from 'chord/music/api/song';
import { ISongItemViewProps } from 'chord/workbench/parts/common/props/songItem';
import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';

import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowAlbumViewById } from 'chord/workbench/parts/mainView/browser/action/showAlbum';


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

        return (
            <div className='react-contextmenu-wrapper'>
                <div draggable={true}>
                    <li className={liClassName} role='button' tabIndex={0}>

                        {/* music icon */}
                        <div className='tracklist-col position-outer' onClick={() => handlePlay()}>
                            <div className={`tracklist-play-pause ${tracklistAlign}`}>{PlayIcon}</div>
                            <div className={`position ${tracklistAlign}`}><span className='spoticon-track-16'></span></div>
                        </div>

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
                    </li>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayOne: (song: ISong) => dispatch(handlePlayOne(song)),
        handleShowArtistViewById: (artistId: string) => handleShowArtistViewById(artistId).then(act => dispatch(act)),
        handleShowAlbumViewById: (albumId: string) => handleShowAlbumViewById(albumId).then(act => dispatch(act)),
    }
}


export default connect(null, mapDispatchToProps)(SongItemView);
