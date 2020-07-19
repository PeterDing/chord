'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IControllerProps } from 'chord/workbench/parts/player/browser/props/controller';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { IPlayerState, RepeatKind } from 'chord/workbench/api/common/state/player';

import {
    handleRewind,
    handlePlayPause,
    handleForward
} from 'chord/workbench/parts/player/browser/action/control';


export class Controller extends React.Component<IControllerProps, any> {

    constructor(props: IControllerProps) {
        super(props);
        this.state = { shuffle: false, repeat: RepeatKind.No };

        this.handleShuffle = this.handleShuffle.bind(this);
        this.handleRepeat = this.handleRepeat.bind(this);
    }

    handleShuffle() {
        let player: IPlayerState = (window as any).store.getState().player;
        this.setState((state) => {
            let shuffle = !state.shuffle;
            let repeat = shuffle ? RepeatKind.No : state.repeat;

            player.shuffle = shuffle;
            player.repeat = repeat;

            return { shuffle, repeat };
        });
    }

    handleRepeat() {
        let player: IPlayerState = (window as any).store.getState().player;
        this.setState((state) => {
            let repeat = (state.repeat + 1) % 3;
            let shuffle = repeat != RepeatKind.No ? false : state.shuffle;

            player.shuffle = shuffle;
            player.repeat = repeat;

            return { shuffle, repeat };
        });
    }

    render() {
        let status = this.props.playing ? 'pause' : 'play';
        let shuffle = this.state.shuffle;
        let repeat = this.state.repeat;
        let repeatIcon = 'spoticon-repeat-16';
        if (repeat == RepeatKind.RepeatOne) {
            repeatIcon = 'spoticon-repeatonce-16';
        }
        let repeatActive = repeat != RepeatKind.No ? 'active' : 'disabled';

        return (
            <div className='player-controls__buttons'>
                {/* shuffle */}
                <button className={`control-button spoticon-shuffle-16 control-button--${shuffle ? 'active' : 'disabled'} cursor-pointer`}
                    onClick={this.handleShuffle}>
                </button>

                {/* rewind */}
                <button
                    className='control-button spoticon-rewind-16 cursor-pointer'
                    onClick={this.props.rewind}>
                </button>

                {/* play & pause */}
                <button
                    className={`control-button spoticon-${status}-16 control-button--circled cursor-pointer`}
                    onClick={this.props.playPause}>
                </button>

                {/* forward */}
                <button
                    className='control-button spoticon-forward-16 cursor-pointer'
                    onClick={this.props.forward}>
                </button>

                {/* repeat */}
                <button className={`control-button ${repeatIcon} control-button--${repeatActive} cursor-pointer`}
                    onClick={this.handleRepeat}>
                </button>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        playing: state.player.playing,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        rewind: () => handleRewind().then(act => dispatch(act)),
        playPause: () => handlePlayPause().then(act => dispatch(act)),
        forward: () => handleForward().then(act => dispatch(act)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Controller);
