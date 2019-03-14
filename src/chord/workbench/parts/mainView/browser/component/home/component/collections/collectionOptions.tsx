'use strict';

import 'chord/css!./collections';

import * as React from 'react';
import { connect } from 'react-redux';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { ORIGIN } from 'chord/music/common/origin';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IListOption } from 'chord/music/api/listOption';

import { handleShowCollectionListView } from 'chord/workbench/parts/mainView/browser/action/home/collections';


interface ICollectionOptionsViewProps {
    xiamiOptions: Array<IListOption>;
    neteaseOptions: Array<IListOption>;
    qqOptions: Array<IListOption>;

    handleShowCollectionListView: (origin, option, order) => {};
}

class CollectionOptionsView extends React.Component<ICollectionOptionsViewProps, any> {

    constructor(props: any) {
        super(props);

        this._getTitleView = this._getTitleView.bind(this);
        this._getOptionView = this._getOptionView.bind(this);
        this._getOptionsView = this._getOptionsView.bind(this);
        this._getCollectionListOptionsView = this._getCollectionListOptionsView.bind(this);
    }

    _getTitleView(title: string) {
        return (
            <div className='chunk-title'>
                {title}
            </div>
        );
    }

    _getOptionView(origin: string, option: IListOption) {
        let list = option.items.map((item, index) => (
            <div className='chunk-item a-like cursor-pointer'
                key={makeListKey(index, 'collection', 'option', 'item')}
                onClick={() => this.props.handleShowCollectionListView(origin, item, null)}>
                {item.name}
            </div>
        ));

        return (
            <div className='chunk-container'>
                {list}
            </div>
        );
    }

    _getOptionsView(origin: string, options: Array<IListOption>) {
        let classes = options.map((option, index) => {
            let titleView = this._getTitleView(option.name);
            let optionView = this._getOptionView(origin, option);

            return (
                <div className='chunk'
                    key={makeListKey(index, 'collection', 'option')}>
                    {titleView}
                    {optionView}
                </div>
            );
        });
        return classes;
    }

    _getCollectionListOptionsView(origin: string, options: Array<IListOption>) {
        let classes = this._getOptionsView(origin, options);
        return (
            <div className='options-item'>

                <div className='options-item-title'> {origin.toLocaleUpperCase()} </div>

                <div className='options-item-container'> {classes} </div>

            </div>
        );
    }

    render() {
        let xiamiCollectionListOptionsView = this._getCollectionListOptionsView(ORIGIN.xiami, this.props.xiamiOptions);
        let neteaseCollectionListOptionsView = this._getCollectionListOptionsView(ORIGIN.netease, this.props.neteaseOptions);
        let qqCollectionListOptionsView = this._getCollectionListOptionsView(ORIGIN.qq, this.props.qqOptions);

        return (
            <div className='options-container'>
                <div className='options-container-title'>
                    Collections
                </div>

                {xiamiCollectionListOptionsView}
                {neteaseCollectionListOptionsView}
                {qqCollectionListOptionsView}
            </div >
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    let optionsSet = state.mainView.homeView.collectionsView.optionsSet;
    return {
        xiamiOptions: optionsSet[ORIGIN.xiami],
        neteaseOptions: optionsSet[ORIGIN.netease],
        qqOptions: optionsSet[ORIGIN.qq],
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleShowCollectionListView: (origin, option, order) => {
            handleShowCollectionListView(origin, option, order).then(act => dispatch(act))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionOptionsView);
