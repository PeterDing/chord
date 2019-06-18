'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';
import { IEpisode } from 'chord/sound/api/episode';

import { TPlayItem } from 'chord/unity/api/items';
import { PlayItem } from 'chord/workbench/api/utils/playItem';
import { getDateYear } from 'chord/base/common/time';
import { ESize } from 'chord/music/common/size';

import { IPlayListButtomProps, IPlayListContentProps, IPlayListItemDetailProps } from 'chord/workbench/parts/player/browser/props/playList';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { handlePlay } from 'chord/workbench/parts/player/browser/action/playList';
import EpisodeItemView from 'chord/workbench/parts/common/component/episodeItem';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import LyricView from 'chord/workbench/parts/player/browser/component/lyric';
import { SmallButton } from 'chord/workbench/parts/common/component/buttons';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowAlbumViewById } from 'chord/workbench/parts/mainView/browser/action/showAlbum';
import { handleAddLibrarySong, handleAddLibraryEpisode } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


class PlayListItemDetail extends React.Component<IPlayListItemDetailProps, any> {

    constructor(props: IPlayListItemDetailProps) {
        super(props);
        this.handleLibraryActFunc = this.handleLibraryActFunc.bind(this);
        this.scrollToCurrentPlaying = this.scrollToCurrentPlaying.bind(this);
    }

    handleLibraryActFunc(playItem: TPlayItem) {
        let handleLibraryActFunc = playItem.like ? this.props.handleRemoveFromLibrary 
            : (playItem.type == 'song') ? this.props.handleAddLibrarySong : this.props.handleAddLibraryEpisode;
        playItem.like = !playItem.like;
        handleLibraryActFunc(playItem);
        this.forceUpdate();
    }

    scrollToCurrentPlaying() {
        let elem = document.getElementById('playing-this');
        if (elem) elem.scrollIntoView(
            { behavior: 'smooth', block: 'start', inline: 'nearest' });
    }

    render() {
        let playItem = this.props.playItem;
        if (!playItem) {
            return null;
        }

        let like = defaultLibrary.exists(playItem);
        playItem.like = like;

        let item = new PlayItem(playItem),
            cover = item.cover(ESize.Large),
            icon = item.icon(),
            itemName = item.name(),
            boxId = item.boxId(),
            boxName = item.boxName(),
            ownerId = item.ownerId(),
            ownerName = item.ownerName();

        let originIcon = OriginIcon(playItem.origin, 'top-icon xiami-icon');

        let likeIconClass = like ? 'spoticon-heart-active-20' : 'spoticon-heart-20';

        return (
            <div className='playlist-content-song-detail'>
                <div>
                    <div className="cover-art shadow cover-art--with-auto-height" aria-hidden="true"
                        style={{ width: '200px', height: '200px', padding: 0 }}
                        onClick={this.scrollToCurrentPlaying}>
                        <div>
                            {icon}
                            <div className="cover-art-image cover-art-image-loaded"
                                style={{ backgroundImage: `url("${cover}")` }}>
                            </div>
                        </div>

                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', margin: '3px 0px' }}>
                        <SmallButton
                            title={this.props.lyricOn ? 'list' : 'lyric'}
                            click={this.props.toggleLyric} />
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
                            <span className="mo-info-name link-subtle">{itemName}</span>
                        </div>
                    </div>

                    {/* Album Name */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper"
                            onClick={() => this.props.handleShowAlbumViewById(boxId)}>
                            <span className="link-subtle a-like cursor-pointer">{boxName}</span>
                        </div>
                    </div>


                    {/* Artist Name */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper"
                            onClick={() => this.props.handleShowArtistViewById(ownerId)}>
                            <span className="link-subtle a-like cursor-pointer">{ownerName}</span>
                        </div>
                    </div>

                    {/* Publish Date */}
                    <div className="mo-meta ellipsis-one-line">
                        <div className="react-contextmenu-wrapper">
                            <span>{playItem.releaseDate ? getDateYear(playItem.releaseDate) : null}</span>
                        </div>
                    </div>

                    {/* Like */}
                    <div className="mo-info">
                        <div className="react-contextmenu-wrapper">
                            <button className={`link-subtle control-button ${likeIconClass} cursor-pointer`}
                                onClick={() => this.handleLibraryActFunc(playItem)}>
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}


function mapDispatchToPropsForItemDetail(dispatch) {
    return {
        handleShowArtistViewById: (artistId: string) => handleShowArtistViewById(artistId).then(act => dispatch(act)),
        handleShowAlbumViewById: (albumId: string) => handleShowAlbumViewById(albumId).then(act => dispatch(act)),
        handleAddLibrarySong: (song) => dispatch(handleAddLibrarySong(song)),

        handleAddLibraryEpisode: (episode) => dispatch(handleAddLibraryEpisode(episode)),

        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

const _PlayListItemDetail = connect(null, mapDispatchToPropsForItemDetail)(PlayListItemDetail);


class PlayListContent extends React.Component<IPlayListContentProps, any> {

    constructor(props: IPlayListContentProps) {
        super(props);
        this.state = { toggleLyric: false };

        this.toggleLyric = this.toggleLyric.bind(this);
        this.playListContent = this.playListContent.bind(this);
        this.lyric = this.lyric.bind(this);
    }

    toggleLyric() {
        this.setState((preState) => ({
            toggleLyric: !preState.toggleLyric,
        }));
    }

    playListContent() {
        let playList = this.props.playList;
        let index = this.props.index;
        let kbps = this.props.kbps;
        let playItems = playList.map((playItem, i) => {
            switch (playItem.type) {
                case 'song':
                    return <SongItemView
                        key={i.toString()}
                        song={playItem as ISong}
                        active={index == i}
                        short={false}
                        thumb={true}
                        handlePlay={() => this.props.handlePlay(i)} />;
                case 'episode':
                    return <EpisodeItemView
                        key={i.toString()}
                        episode={playItem as IEpisode}
                        active={index == i}
                        short={false}
                        thumb={true}
                        handlePlay={() => this.props.handlePlay(i)} />;
                default:
                    return null;
            }
        });

        let playItem = playList[index];
        let playListInfo = `⦿ ${index + 1} / ${playList.length} ⫸ ${kbps}kbps`;

        return (
            <div>
                <div className='playlist-content-songs'>
                    <div className='playlist-content-songs-container'>
                        {playItems}
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        {playListInfo}
                    </div>
                </div>

                <_PlayListItemDetail
                    playItem={playItem}
                    lyricOn={this.state.toggleLyric}
                    toggleLyric={this.toggleLyric} />
            </div>
        );
    }

    lyric() {
        let playList = this.props.playList;
        let index = this.props.index;
        let playItem = playList[index];

        // episode has not lyric

        return (
            <div>
                <LyricView song={playItem.type == 'song' ? playItem as ISong : null} />

                <_PlayListItemDetail
                    playItem={playItem}
                    lyricOn={this.state.toggleLyric}
                    toggleLyric={this.toggleLyric} />
            </div>
        );
    }

    render() {
        if (this.state.toggleLyric) {
            return this.lyric();
        }
        return this.playListContent();
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
export { _PlayListContent as PlayListContent, _PlayListItemDetail as PlayListItemDetail };
