'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';
import { ILikeButtonProps } from 'chord/workbench/parts/player/browser/props/like';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { handleAddLibrarySong } from 'chord/workbench/parts/mainView/browser/action/addLibraryItem';
import { handleRemoveFromLibrary } from 'chord/workbench/parts/mainView/browser/action/removeFromLibrary';

import { defaultLibrary } from 'chord/library/core/library';


class LikeButton extends React.Component<ILikeButtonProps, any> {

    constructor(props: ILikeButtonProps) {
        super(props);
        this.handleLibraryActFunc = this.handleLibraryActFunc.bind(this);
    }

    handleLibraryActFunc(song: ISong) {
        let handleLibraryActFunc = song.like ? this.props.handleRemoveFromLibrary : this.props.handleAddLibrarySong;
        song.like = !song.like;
        handleLibraryActFunc(song);
        this.forceUpdate();
    }

    render() {
        let song = this.props.song;
        if (!song) {
            return null;
        }

        let like = defaultLibrary.exists(song);
        song.like = like;

        let likeIconClass = like ? 'spoticon-heart-active-16' : 'spoticon-heart-16';

        return (
            <button className={`control-button ${likeIconClass} cursor-pointer`}
                onClick={() => this.handleLibraryActFunc(song)}></button>
        );
    }

}


function mapStateToProps(state: IStateGlobal) {
    return {
        song: state.player.playList.length ? state.player.playList[state.player.index] : null,
    };
}


function mapDispatchToProps(dispatch) {
    return {
        handleAddLibrarySong: (song) => dispatch(handleAddLibrarySong(song)),
        handleRemoveFromLibrary: (item) => dispatch(handleRemoveFromLibrary(item)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LikeButton);
