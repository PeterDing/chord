'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryCollection } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function CollectionMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'collectionMenuView' ?
        <Menu item={item} name='Collection' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { collection, top, left } = state.menu.collectionMenu;
    return {
        item: collection,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (collection) => dispatch(handleAddLibraryCollection(collection)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(CollectionMenu);
