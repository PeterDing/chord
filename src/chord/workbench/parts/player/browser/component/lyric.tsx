'use strict';

import 'chord/css!../media/lyric';

import * as React from 'react';

import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';

import { SmallButton } from 'chord/workbench/parts/common/component/buttons';

import { makeListKey } from 'chord/platform/utils/common/keys';

import { CAudio } from 'chord/workbench/api/node/audio';

import { musicApi } from 'chord/music/core/api';


function getTimePoint(): number {
    return CAudio.playing() ? CAudio.seek() * 1000 : 0;
}


function NoLyricView() {
    return (
        <div className='no-lyric-content'>
            <div className='no-lyric'>NO LYRIC</div>
        </div>
    );
}


interface ILyricProps {
    song: ISong;
}


interface ILyricState {
    lyric: ILyric,
    currentIndex: number,
    translation: boolean,
}


export default class LyricView extends React.Component<ILyricProps, ILyricState> {

    init: boolean;

    ppoint: NodeJS.Timer;

    // lyric cache
    static thisLyric: ILyric;

    constructor(props: ILyricProps) {
        super(props);

        this.state = {
            lyric: null,
            currentIndex: 0,
            translation: false,
        };

        this.init = true;

        this.step = this.step.bind(this);
        this.scrollToView = this.scrollToView.bind(this);
        this.toggleTranslation = this.toggleTranslation.bind(this);

        this.onplay = this.onplay.bind(this);
        this.onpause = this.onpause.bind(this);
        this.onend = this.onend.bind(this);
        this.onseek = this.onseek.bind(this);
        this.onloaderror = this.onloaderror.bind(this);

        this.getLyric = this.getLyric.bind(this);

        // After mounting, let CAudio handle play & pause actions
        CAudio.registerOnPlay('lyric-onplay', this.onplay);
        CAudio.registerOnPause('lyric-onpause', this.onpause);
        CAudio.registerOnEnd('lyric-onend', this.onend);
        CAudio.registerOnSeek('lyric-onseek', this.onseek);
        CAudio.registerOnLoadError('lyric-onloaderror', this.onloaderror);
    }

    componentWillMount() {
        // After getting lyric, an action is needed to call the step function,
        // so, let the param to be `true`
        this.getLyric(true);
    }

    componentWillUnmount() {
        this.onpause();
    }

    /**
     * When playing song is changed, its lyric needs to fetch
     */
    componentDidUpdate(preProps) {
        if (this.props.song.songId != preProps.song.songId) {
            this.getLyric();
        }
    }

    /**
     * When the audio starts to playing or the LyricView is mounted, do the action
     */
    onplay(nextFire: number = null) {
        if (!this.ppoint) {
            this.ppoint = setTimeout(this.step, nextFire);
        }
    }

    /**
     * When the audio starts to playing or the LyricView is mounted, do the action
     */
    onpause() {
        if (this.ppoint) {
            clearTimeout(this.ppoint);
            this.ppoint = null;
        }
    }

    onend() {
        this.onpause();
    }

    onseek() {
        this.onpause();
        this.onplay();
    }

    onloaderror() {
        this.onpause();
    }

    toggleTranslation() {
        this.setState((preState) => ({ translation: !preState.translation }));
    }

    scrollToView() {
        let elem = document.getElementById('lyric-this');
        if (elem) elem.scrollIntoView(
            { behavior: 'smooth', block: 'center', inline: 'nearest' });
    }

    step() {
        if (!CAudio.playing) {
            this.onpause();
            return;
        }

        let chunks = this.state.lyric.chunks;
        let timePoint = getTimePoint();
        let nextIndex = chunks.findIndex(chunk => timePoint <= chunk.point);

        // No lyric text find
        if (nextIndex == -1) {
            this.onpause();
            return;
        }

        let currentIndex = nextIndex - 1;

        if (currentIndex < chunks.length - 1) {
            let nextFire = chunks[currentIndex + 1].point - timePoint;
            this.setState({ currentIndex });
            process.nextTick(() => this.scrollToView());
            this.onpause();
            this.onplay(nextFire);
        }
    }

    getLyric(init?: boolean) {
        let song = this.props.song;
        if (!song) {
            // no lyric
            LyricView.thisLyric = null;
            this.setState({ lyric: null });
            return;
        }

        let thisLyric = LyricView.thisLyric;
        if (thisLyric && thisLyric.songId == song.songId) {
            this.setState({ lyric: thisLyric });
            if (init) this.onplay();
            return;
        }

        musicApi.lyric(song.songId, song).then(lyric => {
            if (!lyric) {
                LyricView.thisLyric = null;
                this.setState({ lyric: null, currentIndex: 0 });
                return;
            }
            LyricView.thisLyric = lyric;
            this.setState({ lyric, currentIndex: 0 });
        }).then(() => {
            if (init) this.onplay();
        });
    }

    render() {
        if (this.init) {
            this.init = false;
            return <br />;
        }

        if (!this.state.lyric) {
            return (<NoLyricView />);
        }

        let currentIndex = this.state.currentIndex;

        let chunks = this.state.lyric.chunks;
        let chunksView = [];
        chunks.forEach((chunk, index) => {
            if (chunk.type == 'breakline') {
                chunksView.push(<br key={makeListKey(index, 'lyric', 'breakline')} />);
                return;
            }
            let active = index == currentIndex;
            chunksView.push(
                <p key={makeListKey(index, 'lyric', 'chunk')}
                    id={active ? 'lyric-this' : undefined}
                    className={active ? 'lyric-active' : 'lyric'}>
                    {chunk.text ? chunk.text : '\u00A0'}</p>
            );
            if (chunk.translation && this.state.translation) {
                chunksView.push(
                    <p key={makeListKey(index, 'lyric', 'chunk', 'trans')}
                        className={active ? 'lyric-active' : 'lyric'}>
                        {chunk.translation}</p>
                );
            }
        });

        let hasTranslation = chunks.some(chunk => !!chunk.translation);
        let translationButton = hasTranslation ? (
            <div style={{ display: 'flex', justifyContent: 'center', margin: '3px 0px' }}>
                <SmallButton
                    title={this.state.translation ? 'translated' : 'translate'}
                    click={this.toggleTranslation} />
            </div>
        ) : null;

        return (
            <div className='lyric-content'>
                <div style={{ height: '346px', overflow: 'auto' }}>
                    {chunksView}
                </div>

                {translationButton}
            </div>
        );
    }
}
