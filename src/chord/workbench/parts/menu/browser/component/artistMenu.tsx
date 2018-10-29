'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IArtistMenuProps } from 'chord/workbench/parts/menu/browser/props/artistMenu';

import { handleAddLibraryArtist } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleAddToQueue } from 'chord/workbench/parts/player/browser/action/addToQueue';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


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
        if (!artist) {
            return null;
        }

        let top = this.props.top;
        let left = this.props.left;

        let like = defaultLibrary.exists(artist);
        artist.like = like;

        let addLibraryItem = artist && (!like ? (
            <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleAddLibraryArtist(artist)}>
                Save to your Favorite Artists</div>
        ) : null);

        let removeFromLibraryItem = artist && (like ? (
            <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                onClick={() => this.props.handleRemoveFromLibrary(artist)}>
                Remove from library</div>
        ) : null);

        return this.props.view == 'artistMenuView' ? (
            <nav ref={this.menu} role="menu" tabIndex={-1} className="react-contextmenu"
                style={{ position: 'fixed', opacity: '1', pointerEvents: 'auto', top: `${top}px`, left: `${left}px` }}>

                {addLibraryItem}
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(artist, 'tail')}>
                    Add to Queue (After)</div>
                <div className="react-contextmenu-item" role="menuitem" tabIndex={-1}
                    onClick={() => this.props.handleAddToQueue(artist, 'head')}>
                    Add to Queue (Before)</div>
                {/*<div className="react-contextmenu-item" role="menuitem" tabIndex={-1}>Add to Playlist</div>*/}
                {removeFromLibraryItem}

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
        handleAddToQueue: (item, direction) => handleAddToQueue(item, direction).then(act => dispatch(act)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtistMenu);
