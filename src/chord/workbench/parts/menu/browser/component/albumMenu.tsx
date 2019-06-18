'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryAlbum } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function AlbumMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'albumMenuView' ?
        <Menu item={item} name='Album' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { album, top, left } = state.menu.albumMenu;
    return {
        item: album,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (album) => dispatch(handleAddLibraryAlbum(album)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(AlbumMenu);
