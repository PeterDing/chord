'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { makeListKey } from 'chord/platform/utils/common/keys';
import { ViewMorePlusItem } from 'chord/workbench/parts/common/component/viewMoreItem';

import { ICollection } from 'chord/music/api/collection';
import { IOffset } from 'chord/workbench/api/common/state/offset';
import { IOption } from 'chord/music/api/listOption';
import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';

import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import { handleShowCollectionListView, handleGetMoreCollections } from 'chord/workbench/parts/mainView/browser/action/home/collections';


interface ICollectionListViewProps {
    origin: string;

    option: IOption;

    orders: Array<IOption>;
    order: IOption;

    collections: Array<ICollection>;
    collectionsOffset: IOffset;

    handleGetMoreCollections: (origin, option, order, offset, size) => {};
    handleChangeOrder: (origin, option, order) => {};
}


class CollectionListView extends React.Component<ICollectionListViewProps, any> {

    constructor(props: ICollectionListViewProps) {
        super(props);

        this._getOrder = this._getOrder.bind(this);
        this._getOrdersView = this._getOrdersView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
    }

    _getOrder(id: string): IOption {
        return this.props.orders.find(o => o.id == id);
    }

    _getOrdersView() {
        let { origin, option, orders, order } = this.props;
        return <NavMenu
            namespace={'collections-orders'}
            thisView={order.id}
            views={orders.map(({ id, name }) => ({ name, value: id }))}
            handleClick={(id) => { this.props.handleChangeOrder(origin, option, this._getOrder(id)) }} />;
    }

    _getCollectionsView(size?: number) {
        let collections = this.props.collections;
        let collectionsView = collections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={makeListKey(index, 'collection', 'list')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return collectionsView;
    }

    render() {
        let origin = this.props.origin;
        let option = this.props.option;
        let order = this.props.order;
        let offset = this.props.collectionsOffset;

        let orderView = this._getOrdersView();

        let collectionsView = this._getCollectionsView();
        let viewMore = offset.more ? (
            <ViewMorePlusItem handler={(size) => this.props.handleGetMoreCollections(origin, option, order, offset, size)} />
        ) : null;

        return (
            <section className='artist-albums'>

                {orderView}

                <div className='contentSpacing'>
                    { /* No Show */}
                    <h1 className='search-result-title' style={{ textAlign: 'center', display: 'none' }}>
                        Collections</h1>
                    <div className='container-fluid container-fluid--noSpaceAround'>
                        <div className='align-row-wrap grid--limit row'>
                            {collectionsView}
                        </div>
                    </div>

                    {viewMore}

                </div>
            </section>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    let { origin, option, orders, order, collections, collectionsOffset } = state.mainView.homeView.collectionsView;
    return {
        origin,

        option,

        orders,
        order,

        collections,
        collectionsOffset,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleGetMoreCollections: (origin, option, order, offset, size) => {
            handleGetMoreCollections(origin, option, order, offset, size).then(act => dispatch(act))
        },
        handleChangeOrder: (origin, option, order) => {
            handleShowCollectionListView(origin, option, order).then(act => dispatch(act))
        },
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionListView);
