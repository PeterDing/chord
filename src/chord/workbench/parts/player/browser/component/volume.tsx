'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IVolumeBarProps } from 'chord/workbench/parts/player/browser/props/volume';
import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { handleVolume } from 'chord/workbench/parts/player/browser/action/volume'


type RefDiv = React.RefObject<HTMLDivElement>;

class VolumeBar extends React.Component<IVolumeBarProps, object> {

    box: RefDiv;
    bar: RefDiv;
    slider: RefDiv;

    constructor(props: IVolumeBarProps) {
        super(props);

        this.box = React.createRef();
        this.bar = React.createRef();
        this.slider = React.createRef();
    }

    render() {
        let volume = Math.min(this.props.volume || 1, 1);
        let percent = `${volume * 100}%`;

        return (
            <div className='volume-bar'>
                <button className="spoticon-volume-16 control-button" aria-label="Mute"></button>
                <div className='progress-bar cursor-pointer' ref={this.box}
                    onClick={(e) => this.props.handleVolume(e, this.box.current)}>
                    <div className="middle-align progress-bar__bg">
                        <div ref={this.bar} className="progress-bar__fg" style={{width: percent}}></div>
                        <div ref={this.slider} className="progress-bar__slider" style={{left: percent}}></div>
                    </div>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        volume: state.player.volume,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handleVolume: (e: React.MouseEvent<HTMLDivElement>, box: HTMLDivElement) => dispatch(handleVolume(e, box)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(VolumeBar);
