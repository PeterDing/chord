'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IControllerProps } from 'chord/workbench/parts/player/browser/props/controller';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { handleRewind, handlePlayPause, handleForward } from 'chord/workbench/parts/player/browser/action/control';


export class Controller extends React.Component<IControllerProps, object> {
    constructor(props: IControllerProps) {
        super(props);
    }

    render() {
        let status = this.props.playing ? 'pause' : 'play';
        return (
            <div className='player-controls__buttons'>
                <button
                    className='control-button spoticon-rewind-16'
                    onClick={this.props.rewind}>
                </button>

                <button
                    className={`control-button spoticon-${status}-16 control-button--circled`}
                    onClick={this.props.playPause}>
                </button>

                <button
                    className='control-button spoticon-forward-16'
                    onClick={this.props.forward}>
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
        rewind: () => dispatch(handleRewind()),
        playPause: () => dispatch(handlePlayPause()),
        forward: () => dispatch(handleForward()),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Controller);
