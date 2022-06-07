'use strict';

import * as React from 'react';

import { getHumanDuration } from 'chord/base/common/time';
import { CAudio } from 'chord/workbench/api/node/audio';
import { Store } from 'redux';

import { handleForward } from 'chord/workbench/parts/player/browser/action/control';
import { handlePlayLog } from 'chord/workbench/parts/player/browser/action/plugins/playLog';


type RefDiv = React.RefObject<HTMLDivElement>;

let ppoint: NodeJS.Timer;
let _box: HTMLDivElement;
let _bar: HTMLDivElement;
let _slider: HTMLDivElement;
let _processTime: HTMLDivElement;
let _duration: HTMLDivElement;
const intervalDuration = 1000;


function step() {
    let duration: number = CAudio.playing() ? CAudio.duration() : 0;
    let seek: number = CAudio.playing() ? CAudio.seek() || 0 : 0;
    let percent: number = duration ? seek / duration * 100 : 0;

    _bar.style.width = `${percent}%`;
    _slider.style.left = `${percent}%`;
    _processTime.innerText = getHumanDuration(seek * 1000);
    _duration.innerText = getHumanDuration(duration * 1000);
}

export function onPlay(soundId: number, store: Store) {
    ppoint = setInterval(step, intervalDuration);
}

export function onPause(soundId: number, store: Store) {
    clearInterval(ppoint);
    ppoint = null;
}

export function onEnd(soundId: number, store: Store) {
    clearInterval(ppoint);
    ppoint = null;
    step();

    handlePlayLog();

    // play next song
    handleForward().then(act => store.dispatch(act));
}


// configure control functions for CAudio
CAudio.registerOnPlay('control-onplay', onPlay);
CAudio.registerOnPause('control-onpause', onPause);
CAudio.registerOnEnd('control-onend', onEnd);


function handleSeek(e: React.MouseEvent<HTMLDivElement>) {
    if (CAudio.hasAudio()) {
        let percent: number = e.nativeEvent.offsetX / _box.offsetWidth;
        let duration = CAudio.duration();
        let seek = duration * percent;
        CAudio.seek(seek);
    }
}

class ProcessBar extends React.Component<object, object> {

    box: RefDiv;
    bar: RefDiv;
    slider: RefDiv;

    processTime: RefDiv;
    duration: RefDiv;

    constructor(props: object) {
        super(props);

        this.box = React.createRef();
        this.bar = React.createRef();
        this.slider = React.createRef();
        this.processTime = React.createRef();
        this.duration = React.createRef();
    }

    componentDidMount() {
        _box = this.box.current;
        _bar = this.bar.current;
        _slider = this.slider.current;
        _processTime = this.processTime.current;
        _duration = this.duration.current;
    }

    render() {
        // ProcessBar renders only once. Later, updating handled by shouldComponentUpdate
        return (
            <div className='playback-bar' >

                <div ref={this.processTime} className='playback-bar__progress-time'></div>

                <div ref={this.box} className='progress-bar cursor-pointer' onClick={(e) => handleSeek(e)}>
                    <div className="middle-align progress-bar__bg">
                        <div ref={this.bar} className="progress-bar__fg"></div>
                        <div ref={this.slider} className="progress-bar__slider"></div>
                    </div>
                </div>

                <div className='playback-bar__progress-time' ref={this.duration}></div>
            </div>
        );
    }
}

export default ProcessBar;
