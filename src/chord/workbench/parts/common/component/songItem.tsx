'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { getHumanDuration } from 'chord/base/common/time';
import { ISong } from 'chord/music/api/song';
import { ISongItemViewProps } from 'chord/workbench/parts/common/props/songItem';

import { PlayIcon, MusicIcon } from 'chord/workbench/parts/common/component/common';

import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';
import { handleShowArtistViewById } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowAlbumViewById } from 'chord/workbench/parts/mainView/browser/action/showAlbum';

import { List } from 'chord/workbench/parts/common/abc/list';

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

        let active = this.props.active;
        let originIcon = OriginIcon(song.origin, 'tracklist-col xiami-icon');

        let cover = song.albumCoverPath || musicApi.resizeImageUrl(song.origin, song.albumCoverUrl, ESize.Small);

        let infos = this.props.short ? null : [
            { item: song.artistName, act: () => this.props.handleShowArtistViewById(song.artistId) },
            { item: song.albumName, act: () => this.props.handleShowAlbumViewById(song.albumId) },
        ];

        let leftInfos = [
            { item: getHumanDuration(song.duration) },
            { item: originIcon },
        ];

        return <List
            name={song.songName}
            cover={this.props.thumb && cover}
            menu={(e) => this.props.showSongMenu(e, song)}
            defaultButton={MusicIcon}
            button={{ item: PlayIcon, act: () => handlePlay() }}
            infos={infos}
            leftInfos={leftInfos}
            active={active} />;
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
