'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { getHumanDuration } from 'chord/base/common/time';

import { IEpisode } from 'chord/sound/api/episode';

import { PlayIcon, SoundIcon } from 'chord/workbench/parts/common/component/common';

import { List } from 'chord/workbench/parts/common/abc/list';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { showEpisodeMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { handleShowPodcastViewById } from 'chord/workbench/parts/mainView/browser/action/showPodcast';
import { handleShowRadioViewById } from 'chord/workbench/parts/mainView/browser/action/showRadio';

import { handlePlayOne } from 'chord/workbench/parts/player/browser/action/playOne';

import { soundApi } from 'chord/sound/core/api';



interface IEpisodeItemViewProps {
    /**
     * An active episode is playing or selected
     */
    active: boolean;

    /**
     * If short is true, no showing radio name and album name
     */
    short: boolean;

    /**
     * If thumb is true, show album cover
     */
    thumb: boolean;

    episode: IEpisode;
    handlePlay: () => any | null;
    handlePlayOne: (episode: IEpisode) => Promise<any>;
    handleShowRadioViewById: (radioId: string) => Promise<any>;
    handleShowPodcastViewById: (albumId: string) => Promise<any>;
    showEpisodeMenu: (e: React.MouseEvent<HTMLDivElement>, episode: IEpisode) => any;
}


class EpisodeItemView extends React.Component<IEpisodeItemViewProps, any> {

    constructor(props: IEpisodeItemViewProps) {
        super(props);
    }

    render() {
        let episode = this.props.episode;

        let handlePlay = this.props.handlePlay ?
            this.props.handlePlay : () => this.props.handlePlayOne(episode);

        let active = this.props.active;
        let originIcon = OriginIcon(episode.origin, 'tracklist-col xiami-icon');

        let cover = episode.podcastCoverPath || soundApi.resizeImageUrl(episode.origin, episode.podcastCoverUrl, ESize.Small);

        let infos = this.props.short ? null : [
            { item: episode.radioName, act: () => this.props.handleShowRadioViewById(episode.radioId) },
            { item: episode.podcastName, act: () => this.props.handleShowPodcastViewById(episode.podcastId) },
        ];

        let leftInfos = [
            { item: getHumanDuration(episode.duration) },
            { item: originIcon },
        ];

        return <List
            name={episode.episodeName}
            cover={this.props.thumb && cover}
            menu={(e) => this.props.showEpisodeMenu(e, episode)}
            defaultButton={SoundIcon}
            button={{ item: PlayIcon, act: () => handlePlay() }}
            infos={infos}
            leftInfos={leftInfos}
            active={active} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayOne: (episode: IEpisode) => handlePlayOne(episode).then(act => dispatch(act)),
        handleShowRadioViewById: (radioId: string) => handleShowRadioViewById(radioId).then(act => dispatch(act)),
        handleShowPodcastViewById: (albumId: string) => handleShowPodcastViewById(albumId).then(act => dispatch(act)),
        showEpisodeMenu: (e: React.MouseEvent<HTMLDivElement>, episode: IEpisode) => dispatch(showEpisodeMenu(e, episode)),
    }
}

export default connect(null, mapDispatchToProps)(EpisodeItemView);
