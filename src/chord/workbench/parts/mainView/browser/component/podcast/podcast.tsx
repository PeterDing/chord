'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ORIGIN } from 'chord/music/common/origin';

import { getLikeAndPlayCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { getDateYear } from 'chord/base/common/time';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { PodcastIcon } from 'chord/workbench/parts/common/component/common';

import EpisodeItemView from 'chord/workbench/parts/common/component/episodeItem';

import PaginationView from 'chord/workbench/parts/common/component/pagination';

import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';

import { handlePlayPodcast } from 'chord/workbench/parts/player/browser/action/playPodcast';

import { showPodcastMenu } from 'chord/workbench/parts/menu/browser/action/menu';
import { handleShowRadioViewById } from 'chord/workbench/parts/mainView/browser/action/showRadio';

import { addGlobelPlayPartForPodcast } from 'chord/workbench/events/autoLoadNextPlayItems';

import { soundApi } from 'chord/sound/core/api';

import { DEFAULT_ORDER, ORDERS, OFFSETS } from 'chord/sound/common/params';


function PodcastEntity({ podcast, handlePlayPodcast, handleShowRadioViewById, showPodcastMenu }) {
    let cover = podcast.podcastCoverPath || soundApi.resizeImageUrl(podcast.origin, podcast.podcastCoverUrl, ESize.Large);
    return (
        <header className='entity-info'>
            <div>
                <div>
                    <div className="media-object">
                        <div className="media-object-hoverable">
                            <div className="react-contextmenu-wrapper"
                                onContextMenu={(e) => showPodcastMenu(e, podcast)}>

                                <div className="cover-art shadow cover-art--with-auto-height" aria-hidden="true"
                                    style={{ width: 'auto', height: 'auto' }}>
                                    <div>
                                        {PodcastIcon}
                                        <div className="cover-art-image cover-art-image-loaded"
                                            style={{ backgroundImage: `url("${cover}")` }}></div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <PodcastInfo podcast={podcast}
                handlePlayPodcast={handlePlayPodcast}
                handleShowRadioViewById={handleShowRadioViewById} />
        </header>
    );
}


function PodcastInfo({ podcast, handlePlayPodcast, handleShowRadioViewById }) {
    let likeAndPlayCount = getLikeAndPlayCount(podcast);
    return (
        <div className='media-bd'>
            <div className='entity-name'>
                <h2>{podcast.podcastName}</h2>
                <div>
                    <span>By </span>
                    <span className='link-subtle a-like cursor-pointer'
                        onClick={() => handleShowRadioViewById(podcast.radioId)}>
                        {podcast.radioName}</span>
                </div>
            </div>

            {/* like count and play count */}
            <p className="text-silence entity-additional-info">
                {likeAndPlayCount}
            </p>

            <p className="text-silence entity-additional-info">
                {getDateYear(podcast.releaseDate)} • {podcast.episodeCount} episodes
            </p>
            <button className="btn btn-green cursor-pointer"
                onClick={() => handlePlayPodcast(podcast)}>PLAY THE EPISODES BELOW</button>
        </div>
    );
}


const INIT_STATES = {
    [ORIGIN.ximalaya]: {
        episodes: null,
        total: null,

        ...OFFSETS[ORIGIN.ximalaya],
        order: DEFAULT_ORDER[ORIGIN.ximalaya].podcast.episodes,
    },
    [ORIGIN.himalaya]: {
        episodes: null,
        total: null,

        ...OFFSETS[ORIGIN.himalaya],
        order: DEFAULT_ORDER[ORIGIN.himalaya].podcast.episodes,
    }
};


interface IPodcastViewProps {
    podcast: IPodcast;

    handlePlayPodcast: (podcast, episodes) => void;
    handleShowRadioViewById: (radioId) => void;
    showPodcastMenu: (e: React.MouseEvent<HTMLDivElement>, podcast: IPodcast) => void;
}


interface IPodcastViewState {
    episodes: Array<IEpisode>;

    // offset is for current page
    offset: number;
    // the size of episodes for each page
    limit: number;

    // the amount of total episodes
    total: number;

    order: string;
}


class PodcastView extends React.Component<IPodcastViewProps, IPodcastViewState> {

    constructor(props: IPodcastViewProps) {
        super(props);

        this.state = { ...INIT_STATES[this.props.podcast.origin] };
        this.changePage = this.changePage.bind(this);
        this.changeOrder = this.changeOrder.bind(this);

        this.addGlobelPlayPart = this.addGlobelPlayPart.bind(this);
        this.handlePlayPodcast = this.handlePlayPodcast.bind(this);
    }

    changeOrder(order: string) {
        let { limit } = this.state;
        this.getEpisodes(0, limit, order)
            .then(episodes => this.setState({
                episodes,
                offset: 0,
                order,
            }));
    }

    // page is from 1
    changePage(nextPage: number) {
        let { limit, order } = this.state;
        this.getEpisodes(nextPage - 1, limit, order)
            .then(episodes => this.setState({
                episodes,
                offset: nextPage - 1,
            }));
    }

    // offset is from 0
    async getEpisodes(offset: number, limit: number, order: number | string): Promise<Array<IEpisode>> {
        return soundApi.podcastEpisodes(this.props.podcast.podcastId, { order }, offset, limit);
    }

    componentWillMount() {
        soundApi.podcastEpisodeCount(this.props.podcast.podcastId)
            .then(total => {
                let { offset, limit, order } = this.state;
                this.getEpisodes(offset, limit, order)
                    .then(episodes => this.setState({
                        episodes,
                        total,
                    }));
            });
    }

    componentDidMount() {
        // Scroll to document top
        window.scroll(0, 0);
    }

    handlePlayPodcast(index: number = 0) {
        this.addGlobelPlayPart();
        this.props.handlePlayPodcast(this.props.podcast, this.state.episodes.slice(index));
    }

    addGlobelPlayPart() {
        let { order, offset, limit } = this.state;
        let params = {
            podcastId: this.props.podcast.podcastId,
            params: { order },
            offset,
            limit,
        }
        addGlobelPlayPartForPodcast(params);
    }

    render() {
        let podcast = this.props.podcast;
        let episodes = this.state.episodes;

        // wait componentWillMount
        if (episodes == null) return null;

        let episodesView = episodes.map(
            (episode, index) => (
                <EpisodeItemView
                    key={'podcast_episode_' + index.toString().padStart(3, '0')}
                    episode={episode}
                    active={false}
                    short={true}
                    thumb={false}
                    handlePlay={() => this.handlePlayPodcast(index)} />
            )
        );

        let totalPages = Math.ceil(this.state.total / this.state.limit);
        let paginationView = <PaginationView
            page={this.state.offset + 1}
            total={totalPages}
            size={11}
            handleClick={this.changePage} />;

        let orders = ORDERS[podcast.origin].podcast.episodes;

        let orderView = <NavMenu
            namespace={'podcast-orders'}
            thisView={this.state.order}
            views={orders.map(({ id, name }) => ({ name, value: id }))}
            handleClick={(id) => this.changeOrder(id)} />;

        return (
            <div className='hw-accelerate'>
                <div className='contentSpacing'>
                    <section className='content album'>
                        <div className='container-fluid'>
                            <div className='row'>

                                <div className='col-xs-12 col-lg-3 col-xl-4 col-sticky'>
                                    <PodcastEntity podcast={podcast}
                                        handlePlayPodcast={this.handlePlayPodcast}
                                        handleShowRadioViewById={this.props.handleShowRadioViewById}
                                        showPodcastMenu={this.props.showPodcastMenu} />
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8 description'
                                    dangerouslySetInnerHTML={{ __html: podcast.description }}>
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8'>
                                    {orderView}
                                </div>

                                <div className='col-xs-12 col-lg-9 col-xl-8'>
                                    <section className='tracklist-container'>
                                        <ol className='tracklist'>
                                            {episodesView}
                                        </ol>
                                    </section>
                                </div>


                            </div>
                        </div>
                    </section>
                    {paginationView}
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        podcast: state.mainView.podcastView.podcast,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlayPodcast: (podcast, episodes) => handlePlayPodcast(podcast, episodes).then(act => dispatch(act)),
        handleShowRadioViewById: radioId => handleShowRadioViewById(radioId).then(act => dispatch(act)),
        showPodcastMenu: (e, podcast) => dispatch(showPodcastMenu(e, podcast)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(PodcastView);
