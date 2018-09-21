'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ISongMenuProps } from 'chord/workbench/parts/menu/browser/props/songMenu';

import { handleAddLibrarySong } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


class SongMenu extends React.Component<ISongMenuProps, any> {

    menu: React.RefObject<HTMLDivElement>

    constructor(props: ISongMenuProps) {
        super(props);

        this.menu = React.createRef();
    }

    shouldComponentUpdate(nextProps: ISongMenuProps) {
        if (this.menu.current) { this.menu.current.style.display = 'block'; }
        return true;
    }

    render() {
        let song = this.props.song;
        let top = this.props.top;
        let left = this.props.left;

        return this.props.view == 'songMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddLibrarySong(song)}>
                    Save to your Favorite Songs</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Queue</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>

            </nav>
        ) : null;
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.menu.songMenu,
        view: state.menu.view
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibrarySong: (song) => dispatch(handleAddLibrarySong(song)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(SongMenu);
