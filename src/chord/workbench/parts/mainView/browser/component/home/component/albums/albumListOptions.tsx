'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ORIGIN } from 'chord/music/common/origin';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IListOption } from 'chord/music/api/listOption';

import { MiddleButton } from 'chord/workbench/parts/common/component/buttons';

import AlbumItemView from 'chord/workbench/parts/mainView/browser/component/home/component/albums/albumList';

import { handleShowAlbumListView } from 'chord/workbench/parts/mainView/browser/action/home/albums';


// origin function argument to AlbumListOptionsView.state
const ARGUMENT_NAMES_MAP = {
    [ORIGIN.xiami]: {
        order: 'order',
        language: 'area',
        tag: 'genre',
        century: 'year',
        category: 'type',
    },
    [ORIGIN.qq]: {
        sort: 'order',
        area: 'area',
        genre: 'genre',
        year: 'year',
        type: 'type',
        company: 'company',
    }
}


function initiateState(origin: string): any {
    switch (origin) {
        case ORIGIN.xiami:
            return {
                order: '0',   // 推荐
                area: '0',    // 全部
                genre: '0',   // 全部
                type: '0',    // 全部
                year: '0',    // 全部
                company: '0', // ignore
            };
        case ORIGIN.qq:
            return {
                order: '5',     // 最热
                area: '1',      // 内地
                genre: '-1',    // 全部
                type: '-1',     // 全部
                year: '-1',     // 全部
                company: '-1',  // 全部
            };
        default:
            throw new Error(`[ERROR] [AlbumListOptionsView.initiateState] Here will never be occured. [args]: ${origin}`);
    }
}


interface IAlbumOptionsViewProps {
    origin: ORIGIN;

    optionsSet: { [origin: string]: Array<IListOption> };

    toShowAlbumList: boolean;

    handleShowAlbumListView: (origin, order, area, genre, type, year, company) => {};
}


class AlbumListOptionsView extends React.Component<IAlbumOptionsViewProps, any> {

    constructor(props: any) {
        super(props);

        this.state = initiateState(this.props.origin);

        this._showAlbumList = this._showAlbumList.bind(this);
        this._update_argument = this._update_argument.bind(this);
        this._getTitleView = this._getTitleView.bind(this);
        this._getOptionView = this._getOptionView.bind(this);
        this._getOptionsView = this._getOptionsView.bind(this);
        this._getAlbumListOptionsView = this._getAlbumListOptionsView.bind(this);
    }

    _showAlbumList() {
        let origin = this.props.origin;
        let { order, area, genre, type, year, company } = this.state;
        this.props.handleShowAlbumListView(origin, order, area, genre, type, year, company);
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
                    key={makeListKey(index, 'album', 'option', 'item')}
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
                    key={makeListKey(index, 'album', 'option')}>
                    {titleView}
                    {optionView}
                </div>
            );
        });
        return classes;
    }

    _getAlbumListOptionsView(options: Array<IListOption>) {
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
        let options = this.props.optionsSet[origin];
        let albumListOptionsView = this._getAlbumListOptionsView(options);
        let albumListView = this.props.toShowAlbumList ? (
            <AlbumItemView optionParams={[
                this.state.order,
                this.state.area,
                this.state.genre,
                this.state.type,
                this.state.year,
                this.state.company,
            ]} />) : null;

        return (
            <div>
                <div className='options-container'>

                    {albumListOptionsView}

                    <div className='options-container-title'>
                        <MiddleButton title="Show Me" click={this._showAlbumList} />
                    </div>

                </div>

                {albumListView}
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    let optionsSet = state.mainView.homeView.albumsView.optionsSet;
    let toShowAlbumList = state.mainView.homeView.albumsView.albums.length > 0;
    return { optionsSet, toShowAlbumList };
}

function mapDispatchToProps(dispatch) {
    return {
        handleShowAlbumListView: (...args) => handleShowAlbumListView(...args).then(act => dispatch(act)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumListOptionsView);
