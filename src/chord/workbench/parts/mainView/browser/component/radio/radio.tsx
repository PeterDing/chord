'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ORIGIN } from 'chord/music/common/origin';

import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import { makeListKey } from 'chord/platform/utils/common/keys';
import { getUserProfileCount } from 'chord/workbench/api/utils/statistic';

import { ESize } from 'chord/music/common/size';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import EpisodeItemView from 'chord/workbench/parts/common/component/episodeItem';
import PodcastItemView from 'chord/workbench/parts/common/component/podcastItem';
import RadioItemView from 'chord/workbench/parts/common/component/radioItem';
import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';
import PaginationView from 'chord/workbench/parts/common/component/pagination';

import { MenuButton } from 'chord/workbench/parts/common/component/buttons';

import { showRadioMenu } from 'chord/workbench/parts/menu/browser/action/menu';

import { soundApi } from 'chord/sound/core/api';

import { DEFAULT_ORDER, ORDERS, OFFSETS } from 'chord/sound/common/params';


const NAV_MENU_ITEMS = [
    { id: 'overview', name: 'OVERVIEW' },
    { id: 'episodes', name: 'EPISODES' },
    { id: 'podcasts', name: 'PODCASTS' },
    { id: 'favoritePodcasts', name: 'FAVORITE PODCASTS' },
    { id: 'followings', name: 'FOLLOWINGS' },
];


const INIT_ENTRY = {
    [ORIGIN.ximalaya]: (type) => ({
        ...OFFSETS[ORIGIN.ximalaya],
        total: null,
        order: DEFAULT_ORDER[ORIGIN.ximalaya].radio[type],
        keyword: '',
        items: [],
    }),
};


const INIT_STATES = {
    [ORIGIN.ximalaya]: {
        init: false,
        view: 'overview',
        episodesEntry: INIT_ENTRY[ORIGIN.ximalaya]('episodes'),
        podcastsEntry: INIT_ENTRY[ORIGIN.ximalaya]('podcasts'),
        favoritePodcastsEntry: INIT_ENTRY[ORIGIN.ximalaya]('favoritePodcasts'),
        followingsEntry: INIT_ENTRY[ORIGIN.ximalaya]('followings'),
    }
};


interface IRadioViewProps {
    // 'overview' | 'episodes' | 'podcasts' | 'favoritePodcasts' | 'followings'
    view: string;

    radio: IRadio;

    showRadioMenu: (e: React.MouseEvent<HTMLDivElement>, radio: IRadio) => void;
}


interface IEntry<T> {
    offset: number;
    limit: number;
    total: number;
    order: string;
    keyword: string;
    items: Array<T>;
}


interface IRadioViewState {
    init: boolean;

    // 'overview' | 'episodes' | 'podcasts' | 'favoritePodcasts' | 'followings'
    view: string;

    radioId: string;

    episodesEntry: IEntry<IEpisode>;
    podcastsEntry: IEntry<IPodcast>;
    favoritePodcastsEntry: IEntry<IPodcast>;
    followingsEntry: IEntry<IRadio>;
}


class RadioView extends React.Component<IRadioViewProps, IRadioViewState> {

    constructor(props: IRadioViewProps) {
        super(props);

        let { origin, radioId } = this.props.radio;
        this.state = { ...INIT_STATES[origin], radioId };

        this.init = this.init.bind(this);

        this.changeRadioNavMenuView = this.changeRadioNavMenuView.bind(this);

        this.getEpisodes = this.getEpisodes.bind(this);
        this.getPodcasts = this.getPodcasts.bind(this);
        this.getFavoritePodcasts = this.getFavoritePodcasts.bind(this);

        this.getRadioHeader = this.getRadioHeader.bind(this);
        this.getEpisodeItemsView = this.getEpisodeItemsView.bind(this);
        this.getPodcastItemsView = this.getPodcastItemsView.bind(this);
        this.getFavoritePodcastItemsView = this.getFavoritePodcastItemsView.bind(this);
        this.getFollowingItemsView = this.getFollowingItemsView.bind(this);

        this._itemsView = this._itemsView.bind(this);

        this.changePage = this.changePage.bind(this);
        this.getPaginationView = this.getPaginationView.bind(this);
        this.getOrderView = this.getOrderView.bind(this);

        this.overviewView = this.overviewView.bind(this);
        this.episodesView = this.episodesView.bind(this);
        this.podcastsView = this.podcastsView.bind(this);
        this.favoritePodcastsView = this.favoritePodcastsView.bind(this);
        this.followingsView = this.followingsView.bind(this);
    }

    init() {
        let { radioId } = this.props.radio;
        let { episodesEntry, podcastsEntry, favoritePodcastsEntry, followingsEntry } = this.state;
        Promise.all([
            soundApi.radioEpisodeCount(radioId, { keyword: '' }),
            soundApi.radioPodcastCount(radioId, { keyword: '' }),
            soundApi.radioFavoritePodcastCount(radioId, { keyword: '' }),
            soundApi.radioFollowingCount(radioId),
            this.getEpisodes(0, episodesEntry.limit, episodesEntry.order, ''),
            this.getPodcasts(0, podcastsEntry.limit, podcastsEntry.order, ''),
            this.getFavoritePodcasts(0, favoritePodcastsEntry.limit, favoritePodcastsEntry.order, ''),
            this.getFollowings(0, followingsEntry.limit, followingsEntry.order, ''),
        ]).then(
            ([episodeCount, podcastCount, favoritePodcastCount, followingCount,
                episodes, podcasts, favoritePodcasts, followings]) => {
                this.setState((prevState) => {
                    let episodesEntry = { ...prevState.episodesEntry, total: episodeCount, items: episodes };
                    let podcastsEntry = { ...prevState.podcastsEntry, total: podcastCount, items: podcasts };
                    let favoritePodcastsEntry = { ...prevState.favoritePodcastsEntry, total: favoritePodcastCount, items: favoritePodcasts };
                    let followingsEntry = { ...prevState.followingsEntry, total: followingCount, items: followings };
                    return {
                        ...prevState,
                        init: true,
                        episodesEntry,
                        podcastsEntry,
                        favoritePodcastsEntry,
                        followingsEntry,
                    };
                });
            }
        );
    }

    componentDidMount() {
        this.init();
        // Scroll to document top
        window.scroll(0, 0);
    }

    static getDerivedStateFromProps(nextProps: IRadioViewProps, prevState: IRadioViewState) {
        if (nextProps.radio.radioId != prevState.radioId) {
            let { origin, radioId } = nextProps.radio;
            let state = { ...INIT_STATES[origin], radioId };
            return state;
        }
        return null;
    }

    getSnapshotBeforeUpdate() {
        if (!this.state.init) {
            this.init();
        }
        return null;
    }

    componentDidUpdate() { }

    changeRadioNavMenuView(view: string) {
        let { episodesEntry, podcastsEntry, favoritePodcastsEntry, followingsEntry } = this.state;
        switch (view) {
            case 'episodes':
                this.changePage('episodes', 1, episodesEntry.limit, episodesEntry.order, '');
                break;
            case 'podcasts':
                this.changePage('podcasts', 1, podcastsEntry.limit, podcastsEntry.order, '');
                break;
            case 'favoritePodcasts':
                this.changePage('favoritePodcasts', 1, favoritePodcastsEntry.limit, favoritePodcastsEntry.order, '');
                break;
            case 'followings':
                this.changePage('followings', 1, followingsEntry.limit, followingsEntry.order, '');
                break;
            default:
                break;
        }
        this.setState({ view });
    }

    async getEpisodes(offset: number, limit: number, order: string, keyword: string) {
        let { radioId } = this.props.radio;
        return soundApi.radioEpisodes(radioId, { keyword, order }, offset, limit);
    }

    async getPodcasts(offset: number, limit: number, order: string, keyword: string) {
        let { radioId } = this.props.radio;
        return soundApi.radioPodcasts(radioId, { keyword, order }, offset, limit);
    }

    async getFavoritePodcasts(offset: number, limit: number, order: string, keyword: string) {
        let { radioId } = this.props.radio;
        return soundApi.radioFavoritePodcasts(radioId, { keyword, order }, offset, limit);
    }

    async getFollowings(offset: number, limit: number, order: string, keyword: string) {
        let { radioId } = this.props.radio;
        return soundApi.radioFollowings(radioId, offset, limit);
    }

    /**
     * offset begins from 1
     */
    changePage(type: string, offset: number, limit: number, order: string, keyword: string) {
        switch (type) {
            case 'episodes':
                this.getEpisodes(offset - 1, limit, order, keyword)
                    .then(episodes => {
                        this.setState((prevState) => {
                            let episodesEntry = { ...prevState.episodesEntry, items: episodes, offset: offset - 1, limit, order, keyword };
                            return { episodesEntry };
                        });
                    });
                break;
            case 'podcasts':
                this.getPodcasts(offset - 1, limit, order, keyword)
                    .then(podcasts => {
                        this.setState((prevState) => {
                            let podcastsEntry = { ...prevState.podcastsEntry, items: podcasts, offset: offset - 1, limit, order, keyword };
                            return { podcastsEntry };
                        });
                    });
                break;
            case 'favoritePodcasts':
                this.getFavoritePodcasts(offset - 1, limit, order, keyword)
                    .then(podcasts => {
                        this.setState((prevState) => {
                            let favoritePodcastsEntry = { ...prevState.favoritePodcastsEntry, items: podcasts, offset: offset - 1, limit, order, keyword };
                            return { favoritePodcastsEntry };
                        });
                    });
                break;
            case 'followings':
                this.getFollowings(offset - 1, limit, order, keyword)
                    .then(radios => {
                        this.setState((prevState) => {
                            let followingsEntry = { ...prevState.followingsEntry, items: radios, offset: offset - 1, limit, order, keyword };
                            return { followingsEntry };
                        });
                    });
                break;
            default:
                break;
        }
    }

    getPaginationView<T>(type: string, entry: IEntry<T>) {
        let totalPages = Math.ceil(entry.total / entry.limit);
        return <PaginationView
            page={entry.offset + 1}
            total={totalPages}
            size={11}
            handleClick={(page) => this.changePage(type, page, entry.limit, entry.order, entry.keyword)} />;
    }

    getOrderView<T>(type: string, entry: IEntry<T>, orders: any, namespace: string) {
        return <NavMenu
            namespace={namespace}
            thisView={entry.order}
            views={orders.map(({ id, name }) => ({ name, value: id }))}
            handleClick={(id) => this.changePage(type, 1, entry.limit, id, entry.keyword)} />;
    }

    getEpisodeItemsView() {
        let entry = this.state.episodesEntry;
        return entry.items.map(
            (episode, index) =>
                <EpisodeItemView
                    key={makeListKey(index, 'radio', 'episode')}
                    episode={episode}
                    active={false}
                    short={false}
                    thumb={true}
                    handlePlay={null} />
        );
    }

    getPodcastItemsView() {
        let entry = this.state.podcastsEntry;
        let podcastsView = entry.items.map(
            (podcast, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'radio', 'podcast')}>
                    <PodcastItemView podcast={podcast} />
                </div>
            )
        );
        return podcastsView;
    }

    getFavoritePodcastItemsView() {
        let entry = this.state.favoritePodcastsEntry;
        let favoritePodcastsView = entry.items.map(
            (podcast, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'radio', 'favorite', 'podcast')}>
                    <PodcastItemView podcast={podcast} />
                </div>
            )
        );
        return favoritePodcastsView;
    }

    getFollowingItemsView() {
        let entry = this.state.followingsEntry;
        let followingsView = entry.items.map(
            (radio, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'radio', 'followings')}>
                    <RadioItemView radio={radio} />
                </div>
            )
        );
        return followingsView;
    }

    getRadioHeader() {
        // Maybe need to set background image
        let radio = this.props.radio;
        let cover = radio.radioCoverPath || soundApi.resizeImageUrl(radio.origin, radio.radioCoverUrl, ESize.Middle);
        let userProfileCount = getUserProfileCount(this.props.radio);

        let navMenuView = <NavMenu
            namespace={'podcast-orders'}
            thisView={this.state.view}
            views={NAV_MENU_ITEMS.map(({ id, name }) => ({ name, value: id }))}
            handleClick={(id) => this.changeRadioNavMenuView(id)} />;

        return (
            <header className='user-header user-info'>
                <figure className="avatar user-avatar"
                    style={{ backgroundImage: `url("${cover}")`, width: '200px', height: '200px', margin: '10px auto' }}></figure>
                <h1 className='user-name'>{radio.radioName}</h1>

                {/* following, follower and episode count */}
                <h1 className='small' style={{ opacity: 0.4 }}>{userProfileCount}</h1>

                <div className='header-buttons'>
                    <MenuButton click={(e) => this.props.showRadioMenu(e, radio)} />
                </div>

                {navMenuView}
            </header>
        );
    }

    overviewView() {
        let episodeItemsView = this.getEpisodeItemsView();
        let podcastItemsView = this.getPodcastItemsView();
        let favoritePodcastItemsView = this.getFavoritePodcastItemsView();
        let followingItemsView = this.getFollowingItemsView();
        let radio = this.props.radio;

        let makeItemsView = (view, title) => (
            <section className='artist-podcasts'>
                <div className='contentSpacing'>
                    <h1 className='search-result-title' style={{ textAlign: 'center' }}>{title}</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {view}
                        </div>
                    </div>
                </div>
            </section>
        );

        return (
            <div>
                {/* Episodes */}
                <section className='container-fluid'>
                    <div className='row'>
                        <div className='contentSpacing'>

                            <div className='col-xs-12 col-lg-9 col-xl-8 description'
                                dangerouslySetInnerHTML={{ __html: radio.description }}>
                            </div>

                            <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                                <h1 className='search-result-title' style={{ textAlign: 'center' }}>Songs</h1>
                                <section className='tracklist-container full-width'>
                                    <ol>{episodeItemsView}</ol>
                                </section>
                            </section>
                        </div>
                    </div>
                </section>

                {/* Podcasts */}
                {makeItemsView(podcastItemsView, 'Podcasts')}

                {/* Favorite Podcasts */}
                {makeItemsView(favoritePodcastItemsView, 'Favorite Podcasts')}

                {/* Followings */}
                {makeItemsView(followingItemsView, 'Followings')}
            </div>
        );
    }

    episodesView() {
        let entry = this.state.episodesEntry;
        let episodeItemsView = this.getEpisodeItemsView();

        let paginationView = this.getPaginationView('episodes', entry);

        let orders = ORDERS[this.props.radio.origin].radio.episodes;
        let orderView = this.getOrderView('episodes', entry, orders, 'radio-episodes-orders');

        return (
            <section className='container-fluid'>
                <div className='row'>
                    <div className='contentSpacing'>
                        <section className='col-sm-12 col-md-10 col-md-push-1 artist-toptracks'>
                            { /* No Show */}
                            <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>Episodes</h1>

                            {orderView}

                            <section className='tracklist-container full-width'>
                                <ol>{episodeItemsView}</ol>
                            </section>
                        </section>
                    </div>
                </div>

                {paginationView}

            </section>
        );
    }

    _itemsView(itemsView, orderView, paginationView, title) {
        return (
            <section className='artist-podcasts'>
                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>{title}</h1>

                    {orderView}

                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {itemsView}
                        </div>
                    </div>

                    {paginationView}

                </div>
            </section>
        );
    }

    podcastsView() {
        let entry = this.state.podcastsEntry;
        let itemsView = this.getPodcastItemsView();

        let paginationView = this.getPaginationView('podcasts', entry);

        let orders = ORDERS[this.props.radio.origin].radio.podcasts;
        let orderView = this.getOrderView('podcasts', entry, orders, 'radio-podcasts-orders');

        return this._itemsView(itemsView, orderView, paginationView, 'ALBUMS');
    }

    favoritePodcastsView() {
        let entry = this.state.favoritePodcastsEntry;
        let itemsView = this.getFavoritePodcastItemsView();

        let paginationView = this.getPaginationView('favoritePodcasts', entry);

        let orders = ORDERS[this.props.radio.origin].radio.favoritePodcasts;
        let orderView = this.getOrderView('favoritePodcasts', entry, orders, 'radio-favorite-podcasts-orders');

        return this._itemsView(itemsView, orderView, paginationView, 'FAVORITE PLAYLISTS');
    }

    followingsView() {
        let entry = this.state.favoritePodcastsEntry;
        let itemsView = this.getFollowingItemsView();

        let paginationView = this.getPaginationView('followings', entry);

        return this._itemsView(itemsView, null, paginationView, 'FOLLOWINGS');
    }

    render() {
        if (!this.state || !this.state.init) return null;

        let radioHeaderView = this.getRadioHeader();
        let view = this.state.view;
        let contentView;
        if (view == 'overview') {
            contentView = this.overviewView();
        } else if (view == 'episodes') {
            contentView = this.episodesView();
        } else if (view == 'podcasts') {
            contentView = this.podcastsView();
        } else if (view == 'favoritePodcasts') {
            contentView = this.favoritePodcastsView();
        } else if (view == 'followings') {
            contentView = this.followingsView();
        } else {
            return null;
        }

        return (
            <div className='hw-accelerate'>
                {radioHeaderView}
                {contentView}
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return state.mainView.radioView;
}

function mapDispatchToProps(dispatch) {
    return {
        showRadioMenu: (e, radio) => dispatch(showRadioMenu(e, radio)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(RadioView);
