'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ORIGIN } from 'chord/music/common/origin';

import { IArtist } from 'chord/music/api/artist';

import { IListOption } from 'chord/music/api/listOption';

import { MiddleButton } from 'chord/workbench/parts/common/component/buttons';

import ArtistItemView from 'chord/workbench/parts/mainView/browser/component/home/component/artists/artistList';

import { handleGetArtists, handleShowArtistListView } from 'chord/workbench/parts/mainView/browser/action/home/artists';

import { ARTIST_LIST_OPTIONS as xiamiArtistListOptions } from 'chord/music/xiami/common';
import { ARTIST_LIST_OPTIONS as neteaseArtistListOptions } from 'chord/music/netease/common';
import { ARTIST_LIST_OPTIONS as qqArtistListOptions } from 'chord/music/qq/common';


const ARTIST_SIZE = 40;


// origin function argument to ArtistListOptionsView.state
const ARGUMENT_NAMES_MAP = {
    [ORIGIN.xiami]: {
        language: 'area',
        tag: 'genre',
        gender: 'gender',
        index: 'index',
    },
    [ORIGIN.netease]: {
        category: 'genre',
        initial: 'index',
    },
    [ORIGIN.qq]: {
        area: 'area',
        genre: 'genre',
        sex: 'gender',
        index: 'index',
    }
};


interface IArtistsMap {
    [key: string]: Array<IArtist>;
}


function hash(area, genre, gender, index): string {
    return [area, genre, gender, index].map(arg => arg == null ? 'null' : arg).join('|');
}


function initiateState(origin: string): any {
    switch (origin) {
        case ORIGIN.xiami:
            return {
                area: '0',      // 全部
                genre: '0',     // 全部
                gender: '0',    // 全部
                index: null,    // 热门
            };
        case ORIGIN.netease:
            return {
                area: null,      // 全部
                genre: null,     // 全部
                gender: null,    // 全部
                index: '-1',     // 热门
            };
        case ORIGIN.qq:
            return {
                area: '-100',      // 内地
                genre: '-100',     // 全部
                gender: '-100',    // 全部
                index: '-100',     // 热门
            };
        default:
            throw new Error(`[ERROR] [ArtistListOptionsView.initiateState] Here will never be occured. [args]: ${origin}`);
    }
}


const OPTIONS_SET = {
    [ORIGIN.xiami]: xiamiArtistListOptions,
    [ORIGIN.netease]: neteaseArtistListOptions,
    [ORIGIN.qq]: qqArtistListOptions,
};


interface IArtistOptionsViewProps {
    origin: string;
    view: string;

    toShowArtistList: () => boolean;
    handleShowArtistListView: (origin) => void;
}

interface IArtistOptionsViewState {
    area: string;
    genre: string;
    gender: string;
    index: string;

    artists: Array<IArtist>;
}


class ArtistListOptionsView extends React.Component<IArtistOptionsViewProps, IArtistOptionsViewState> {

    private artistsMap: IArtistsMap;
    private currentLength: number;
    private more: boolean;

    constructor(props: IArtistOptionsViewProps) {
        super(props);

        this.state = {
            ...initiateState(this.props.origin),
            artists: [],
        };

        this.artistsMap = {};
        this.currentLength = 0;
        this.more = true;

        this._handleShowArtistListView = this._handleShowArtistListView.bind(this);
        this._hash = this._hash.bind(this);
        this._getArtistList = this._getArtistList.bind(this);
        this._showMoreArtists = this._showMoreArtists.bind(this);
        this._showArtistList = this._showArtistList.bind(this);
        this._update_argument = this._update_argument.bind(this);
        this._getTitleView = this._getTitleView.bind(this);
        this._getOptionView = this._getOptionView.bind(this);
        this._getOptionsView = this._getOptionsView.bind(this);
        this._getArtistListOptionsView = this._getArtistListOptionsView.bind(this);
    }

    _hash(): string {
        let { area, genre, gender, index } = this.state;
        return hash(area, genre, gender, index);
    }

    async _getArtistList(): Promise<void> {
        let { area, genre, gender, index } = this.state;
        let origin = this.props.origin;
        if (origin == ORIGIN.xiami) {
            let h = hash(area, genre, gender, null);
            if (this.artistsMap[h]) return;
        }

        let h = this._hash();
        let offset = (this.artistsMap[h] || []).length;

        return handleGetArtists(origin, area, genre, gender, index, offset, ARTIST_SIZE)
            .then(items => {
                if (origin == ORIGIN.xiami) {
                    let [artists, pinyins] = items;
                    let seq = artists.findIndex(artist => artist == null);
                    let hotArtists = artists.slice(0, seq);
                    let otherArtists = artists.slice(seq + 1);
                    let h = hash(area, genre, gender, null);
                    this.artistsMap[h] = hotArtists;

                    for (let i = 0; i < otherArtists.length; i += 1) {
                        let artist = otherArtists[i];
                        let pinyin = pinyins[seq + 1 + i].trim();
                        let code = pinyin ? pinyin[0].toUpperCase().charCodeAt(0) - 65 : -1;
                        let hstr = (code >= 0 && code <= 25) ? pinyin[0].toUpperCase() : '#';
                        let h = hash(area, genre, gender, hstr);
                        let list = this.artistsMap[h] || [];
                        list.push(artist);
                        this.artistsMap[h] = list;
                    }
                } else {
                    let artists = items;
                    let h = hash(area, genre, gender, index);
                    let list = this.artistsMap[h] || [];
                    this.artistsMap[h] = [...list, ...artists];

                    if (artists.length < ARTIST_SIZE) {
                        this.more = false;
                    }
                }
            });
    }

    _showArtistList() {
        // reset
        this.currentLength = ARTIST_SIZE;
        this.more = true;

        let h = this._hash();
        let artists = (this.artistsMap[h] || []).slice(0, ARTIST_SIZE);
        if (artists.length > 0) {
            this.setState({ artists });
        } else {
            this._getArtistList()
                .then(() => {
                    let artists = this.artistsMap[h].slice(0, ARTIST_SIZE);
                    this.setState({ artists });
                });
        }
    }

    _showMoreArtists() {
        let h = this._hash();
        let { origin } = this.props;

        this.currentLength = this.currentLength + ARTIST_SIZE;

        if (origin == ORIGIN.xiami) {
            if (this.currentLength > this.artistsMap[h].length) {
                this.more = false;
            }
            let artists = this.artistsMap[h].slice(0, this.currentLength);
            this.setState({ artists });
        }

        this._getArtistList()
            .then(() => {
                if (this.currentLength > this.artistsMap[h].length) {
                    this.more = false;
                }
                let artists = this.artistsMap[h].slice(0, this.currentLength);
                this.setState({ artists })
            });
    }

    _handleShowArtistListView() {
        this._showArtistList();
        process.nextTick(() => this.props.handleShowArtistListView(this.props.origin));
    }

    _update_argument(name: string, value: string) {
        let origin = this.props.origin;
        let key = ARGUMENT_NAMES_MAP[origin][name];
        this.setState({ [key]: value });
    }

    _getTitleView(title: string) {
        return (
            <div className='chunk-title'>
                {title}
            </div>
        );
    }

    _getOptionView(option: IListOption) {
        let type = option.type;
        let origin = this.props.origin;

        let list = option.items.map((item, index) => {
            let key = ARGUMENT_NAMES_MAP[origin][type];
            let active = this.state[key] == item.id;
            let className = active ? 'chunk-item chunk-item-selected a-like cursor-pointer'
                : 'chunk-item a-like cursor-pointer';
            return (
                <div className={className}
                    key={makeListKey(index, 'artist', 'option', 'item')}
                    onClick={() => this._update_argument(type, item.id)}>
                    {item.name}
                </div>
            );
        });

        return (
            <div className='chunk-container'>
                {list}
            </div>
        );
    }

    _getOptionsView(options: Array<IListOption>) {
        let classes = options.map((option, index) => {
            let titleView = this._getTitleView(option.name);
            let optionView = this._getOptionView(option);

            return (
                <div className='chunk'
                    key={makeListKey(index, 'artist', 'option')}>
                    {titleView}
                    {optionView}
                </div>
            );
        });
        return classes;
    }

    _getArtistListOptionsView(options: Array<IListOption>) {
        let origin = this.props.origin;
        let classes = this._getOptionsView(options);
        return (
            <div className='options-item'>

                <div className='options-item-title'> {origin.toLocaleUpperCase()} </div>

                <div className='options-item-container'> {classes} </div>

            </div>
        );
    }

    render() {
        let origin = this.props.origin;
        let options = OPTIONS_SET[origin];
        let artistListOptionsView = this._getArtistListOptionsView(options);
        let artistListView = (this.props.toShowArtistList() && this.props.view == 'artists') ? (
            <ArtistItemView
                artists={this.state.artists}
                more={this.more}
                handleGetMoreArtists={() => this._showMoreArtists()}
            />) : null;

        return (
            <div>
                <div className='options-container'>

                    {artistListOptionsView}

                    <div className='options-container-title'>
                        <MiddleButton title="Show Me"
                            click={this._handleShowArtistListView} />
                    </div>

                </div>

                {artistListView}
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    let { view } = state.mainView.homeView.artistsView;
    return { view };
}

function mapDispatchToProps(dispatch) {
    return {
        handleShowArtistListView: (origin) => dispatch(handleShowArtistListView(origin)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistListOptionsView);
