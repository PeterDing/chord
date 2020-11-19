'use strict';

import * as React from 'react';

import { changeRate } from 'chord/workbench/parts/player/browser/action/changeRate';


export default class RateView extends React.Component<any, any> {

    rateRef: React.RefObject<HTMLDivElement>;
    toggleState: boolean;

    constructor(props: any) {
        super(props);

        this.rateRef = React.createRef();
        this.toggleState = false;
        this.state = {
            rate: 1.0,
        };
        this.toggleSelect = this.toggleSelect.bind(this);
        this.handleRate = this.handleRate.bind(this);
    }

    toggleSelect() {
        let toggleState = !this.toggleState;
        this.rateRef.current.style.display = toggleState ? 'grid' : 'none';
        this.toggleState = toggleState;
    }

    handleRate(rate: number) {
        changeRate(rate);

        this.toggleState = false;
        this.rateRef.current.style.display = 'none';

        this.setState({ rate });
    }

    render() {
        let m = {
            3.0: '3.0',
            2.7: '2.7',
            2.5: '2.5',
            2.2: '2.2',
            2.0: '2.0',
            1.7: '1.7',
            1.5: '1.5',
            1.2: '1.2',
            1.0: '1.0',
            0.7: '0.7',
            0.5: '0.5',
        };
        let rate = 'x' + m[this.state.rate];
        return (
            <div>
                <div className='player-rate' ref={this.rateRef}>
                    <span onClick={() => this.handleRate(3.0)}>3.0</span>
                    <span onClick={() => this.handleRate(2.7)}>2.7</span>
                    <span onClick={() => this.handleRate(2.5)}>2.5</span>
                    <span onClick={() => this.handleRate(2.2)}>2.2</span>
                    <span onClick={() => this.handleRate(2.0)}>2.0</span>
                    <span onClick={() => this.handleRate(1.7)}>1.7</span>
                    <span onClick={() => this.handleRate(1.5)}>1.5</span>
                    <span onClick={() => this.handleRate(1.2)}>1.2</span>
                    <span onClick={() => this.handleRate(1.0)}>1.0</span>
                    <span onClick={() => this.handleRate(0.7)}>0.7</span>
                    <span onClick={() => this.handleRate(0.5)}>0.5</span>
                </div>

                <span style={{padding: '0px 2px'}} onClick={() => this.toggleSelect()}>{rate}</span>
            </div>
        );
    }
}
