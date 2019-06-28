'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ORIGIN } from 'chord/music/common/origin';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';

import { IPodcast } from 'chord/sound/api/podcast';
// import { IPlayPodcastAct } from 'chord/workbench/api/common/action/player';
// import { IShowPodcastMenuAct } from 'chord/workbench/api/common/action/menu';
// import { IShowRadioAct } from 'chord/workbench/api/common/action/mainView';

// import { showPodcastMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { showPodcastMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { handlePlayPodcast } from 'chord/workbench/parts/player/browser/action/playPodcast';
import { handleShowPodcastView } from 'chord/workbench/parts/mainView/browser/action/showPodcast';
import { handleShowRadioViewById } from 'chord/workbench/parts/mainView/browser/action/showRadio';

import { addGlobelPlayPartForPodcast } from 'chord/workbench/events/autoLoadNextPlayItems';

import { Card } from 'chord/workbench/parts/common/abc/card';

import { PodcastIcon } from 'chord/workbench/parts/common/component/common';
import { PlayIcon } from 'chord/workbench/parts/common/component/common';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';

import { soundApi } from 'chord/sound/core/api';

import { OFFSETS } from 'chord/sound/common/params';


const PARAMS = {
    [ORIGIN.ximalaya]: {
        ...OFFSETS[ORIGIN.ximalaya],
        order: '0', // 正序
    },
    [ORIGIN.himalaya]: {
        ...OFFSETS[ORIGIN.himalaya],
        order: '1', // here, order is not working
    },
};


interface IPodcastItemViewProps {
    podcast: IPodcast;
    handlePlayPodcast: (podcast: IPodcast) => void;
    handleShowPodcastView: (podcast: IPodcast) => void;
    showPodcastMenu: (e: React.MouseEvent<HTMLDivElement>, podcast: IPodcast) => void;

    handleShowRadioViewById: (radioId: string) => void;
}


/**
 * Podcast item view
 *
 * This view doesn't display podcast's songs
 *
 * props.podcast is given by parent component
 */
class PodcastItemView extends React.Component<IPodcastItemViewProps, any> {

    constructor(props: IPodcastItemViewProps) {
        super(props);

        this.handlePlayPodcast = this.handlePlayPodcast.bind(this);
    }

    handlePlayPodcast() {
        let { order, offset, limit } = PARAMS[this.props.podcast.origin];
        let params = {
            podcastId: this.props.podcast.podcastId,
            params: { order },
            offset,
            limit,
        }
        addGlobelPlayPartForPodcast(params);
        this.props.handlePlayPodcast(this.props.podcast);
    }

    render() {
        let podcast = this.props.podcast;
        let cover = podcast.podcastCoverPath || soundApi.resizeImageUrl(podcast.origin, podcast.podcastCoverUrl, ESize.Large);
        let originIcon = OriginIcon(podcast.origin, 'cover-icon xiami-icon');

        let likeAndPlayCount = getLikeAndPlayCount(podcast);

        let addons = (<span>{originIcon} {getDateYear(podcast.releaseDate)} • {podcast.episodeCount} tracks</span>);

        let infos = [
            { item: podcast.radioName, act: () => this.props.handleShowRadioViewById(podcast.radioId) },
            { item: likeAndPlayCount },
            { item: addons },
        ];

        return <Card
            name={podcast.podcastName}
            cover={{ item: cover, act: () => this.props.handleShowPodcastView(podcast) }}
            defaultCover={PodcastIcon}
            menu={(e) => this.props.showPodcastMenu(e, podcast)}
            button={{ item: PlayIcon, act: this.handlePlayPodcast }}
            infos={infos}
            draggable={true}
            shape={'rectangle'} />;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlayPodcast: podcast => handlePlayPodcast(podcast, []).then(act => dispatch(act)),
        handleShowPodcastView: podcast => handleShowPodcastView(podcast).then(act => dispatch(act)),
        showPodcastMenu: (e, podcast) => dispatch(showPodcastMenu(e, podcast)),

        handleShowRadioViewById: radioId => handleShowRadioViewById(radioId).then(act => dispatch(act)),
    };
}


export default connect(null, mapDispatchToProps)(PodcastItemView);
