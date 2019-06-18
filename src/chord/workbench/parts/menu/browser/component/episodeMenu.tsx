'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import Menu from 'chord/workbench/parts/menu/browser/component/menu';

import { handleAddLibraryEpisode } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


function EpisodeMenu({ item, view, top, left, handleAddLibraryItem }) {
    return view == 'episodeMenuView' ?
        <Menu item={item} name='Episode' top={top} left={left} handleAddLibraryItem={handleAddLibraryItem} toQueue={true} /> : null;
}


function mapStateToProps(state: IStateGlobal) {
    let { episode, top, left } = state.menu.episodeMenu;
    return {
        item: episode,
        top,
        left,
        view: state.menu.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryItem: (episode) => dispatch(handleAddLibraryEpisode(episode)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(EpisodeMenu);
