'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IArtistMenuProps } from 'chord/workbench/parts/menu/browser/props/artistMenu';

import { handleAddLibraryArtist } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';


class ArtistMenu extends React.Component<IArtistMenuProps, any> {

    menu: React.RefObject<HTMLDivElement>

    constructor(props: IArtistMenuProps) {
        super(props);

        this.menu = React.createRef();
    }

    shouldComponentUpdate(nextProps: IArtistMenuProps) {
        if (this.menu.current) { this.menu.current.style.display = 'block'; }
        return true;
    }

    render() {
        let artist = this.props.artist;
        let top = this.props.top;
        let left = this.props.left;

        return this.props.view == 'artistMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddLibraryArtist(artist)}>
                    Save to your Favorite Artists</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Queue</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>

            </nav>
        ) : null;
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.menu.artistMenu,
        view: state.menu.view
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleAddLibraryArtist: (artist) => dispatch(handleAddLibraryArtist(artist)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistMenu);
