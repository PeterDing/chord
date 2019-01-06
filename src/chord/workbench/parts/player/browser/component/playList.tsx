'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';

import { getDateYear } from 'chord/base/common/time';
import { ESize } from 'chord/music/common/size';

import { IPlayListButtomProps, IPlayListContentProps, IPlayListSongDetailProps } from 'chord/workbench/parts/player/browser/props/playList';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';
import SongItemView from 'chord/workbench/parts/common/component/songItem';

import { AlbumIcon } from 'chord/workbench/parts/common/component/common';
import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowAlbumViewById } from 'chord/workbench/parts/mainView/browser/action/showAlbum';
import { handleAddLibrarySong } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';
import { musicApi } from 'chord/music/core/api';


class PlayListSongDetail extends React.Component<IPlayListSongDetailProps, any> {

    constructor(props: IPlayListSongDetailProps) {
        super(props);
        this.handleLibraryActFunc = this.handleLibraryActFunc.bind(this);
        this.scrollToCurrentPlaying = this.scrollToCurrentPlaying.bind(this);
    }

    handleLibraryActFunc(song: ISong) {
        let handleLibraryActFunc = song.like ? this.props.handleRemoveFromLibrary : this.props.handleAddLibrarySong;
        song.like = !song.like;
        handleLibraryActFunc(song);
        this.forceUpdate();
    }

    scrollToCurrentPlaying() {
        document.getElementById('playing-this').scrollIntoView(
            { behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    render() {
        let song = this.props.song;
        if (!song) {
            return null;
        }

        let like = defaultLibrary.exists(song);
        song.like = like;

        let cover = song.albumCoverPath || musicApi.resizeImageUrl(song.origin, song.albumCoverUrl, ESize.Large);
        let originIcon = OriginIcon(song.origin, 'top-icon xiami-icon');

        let likeIconClass = like ? 'spoticon-heart-active-20' : 'spoticon-heart-20';

        return (
            <div className='playlist-content-song-detail'>
                <div className="cover-art shadow cover-art--with-auto-height" aria-hidden="true"
                    style={{ width: '200px', height: '200px', padding: 0 }}
                    onClick={this.scrollToCurrentPlaying}>
                    <div>
                        {AlbumIcon}
                        <div className="cover-art-image cover-art-image-loaded"
                            style={{ backgroundImage: `url("${cover}")` }}>
                        </div>
                    </div>
                </div>

                <div style={{ display: 'inline-grid', width: 'inherit' }}>
                    {/* Origin Icon */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper">
                            <span>{originIcon}</span>
                        </div>
                    </div>

                    {/* Song Name */}
                    <div className="mo-info">
                        <div className="react-contextmenu-wrapper">
                            <span className="mo-info-name link-subtle">{song.songName}</span>
                        </div>
                    </div>

                    {/* Album Name */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper"
                            onClick={() => this.props.handleShowAlbumViewById(song.albumId)}>
                            <span className="link-subtle a-like cursor-pointer">{song.albumName}</span>
                        </div>
                    </div>


                    {/* Artist Name */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper"
                            onClick={() => this.props.handleShowArtistViewById(song.artistId)}>
                            <span className="link-subtle a-like cursor-pointer">{song.artistName}</span>
                        </div>
                    </div>

                    {/* Publish Date */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper">
                            <span>{song.releaseDate ? getDateYear(song.releaseDate) : null}</span>
                        </div>
                    </div>

                    {/* Like */}
                    <div className="mo-info">
                        <div className="react-contextmenu-wrapper">
                            <button className={`link-subtle control-button ${likeIconClass} cursor-pointer`}
                                onClick={() => this.handleLibraryActFunc(song)}>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


function mapDispatchToPropsForSongDetail(dispatch) {
    return {
        handleShowArtistViewById: (artistId: string) => handleShowArtistViewById(artistId).then(act => dispatch(act)),
        handleShowAlbumViewById: (albumId: string) => handleShowAlbumViewById(albumId).then(act => dispatch(act)),
        handleAddLibrarySong: (song) => dispatch(handleAddLibrarySong(song)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

const _PlayListSongDetail = connect(null, mapDispatchToPropsForSongDetail)(PlayListSongDetail);


class PlayListContent extends React.Component<IPlayListContentProps, any> {

    constructor(props: IPlayListContentProps) {
        super(props);
    }

    render() {
        let playList = this.props.playList;
        let index = this.props.index;
        let songItems = playList.map((song, i) => (
            <SongItemView
                key={i.toString()}
                handlePlay={() => this.props.handlePlay(i)}
                song={song}
                active={index == i}
                short={false}
                thumb={true} />
        ));

        let song = playList[index];

        return (
            <div>
                <div className='playlist-content-songs'>
                    {songItems}
                </div>

                <_PlayListSongDetail song={song} />
            </div>
        );
    }
}


export class PlayListButtom extends React.Component<IPlayListButtomProps, any> {

    playListContent: React.RefObject<HTMLDivElement>;
    show: boolean;

    constructor(props: IPlayListButtomProps) {
        super(props);
        this.showPlayList = this.showPlayList.bind(this);

        this.playListContent = this.props.playListContent;
        this.show = false;
    }

    showPlayList() {
        this.show = !this.show;
        this.playListContent.current.style.display = this.show ? 'flex' : 'none';
    }


    render() {
        return (
            <div className='player-list-container'>
                <button className='spoticon-queue-16 control-button cursor-pointer'
                    onClick={this.showPlayList} aria-label='Queue'>
                </button>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.player,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlay: (index: number) => handlePlay(index).then(act => dispatch(act)),
    };
}

const _PlayListContent = connect(mapStateToProps, mapDispatchToProps)(PlayListContent);
export { _PlayListContent as PlayListContent, _PlayListSongDetail as PlayListSongDetail };
