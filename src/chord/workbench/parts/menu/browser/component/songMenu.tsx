'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibrarySong } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function SongMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'songMenuView' ?
        <Menu item={item} name='Song' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { song, top, left } = state.menu.songMenu;
    return {
        item: song,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (song) => dispatch(handleAddLibrarySong(song)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongMenu);
