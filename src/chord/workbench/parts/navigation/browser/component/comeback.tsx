'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { INavigationComebackProps } from 'chord/workbench/parts/navigation/browser/props/comeback';

import { comeback } from 'chord/workbench/parts/navigation/browser/action/comback';

import { ComebackIcon } from 'chord/workbench/parts/common/component/common';


interface IRecord {
    view: string;
    pageYOffset: number;
}


class Comeback extends React.Component<INavigationComebackProps, any> {

    stack: Array<IRecord>;

    constructor(props: INavigationComebackProps) {
        super(props);

        this.stack = [this.makeRecord(this.props.view)];
        this.handleComeback = this.handleComeback.bind(this);
    }

    makeRecord(view: string): IRecord {
        return {
            view: view,
            pageYOffset: window.pageYOffset,
        };
    }

    handleComeback() {
        let stack = this.stack;

        let currentRecord = stack.pop();
        let preRecord = stack[stack.length - 1];
        let preView = preRecord ? preRecord.view || 'searchView' : 'searchView';
        let preYOffset = currentRecord ? currentRecord.pageYOffset || 0 : 0;
        this.props.comeback(preView);

        // Come back to pre-page offset
        // window.scroll(0, preYOffset);
        //
        // Does not use setTimeout, use process.nextTick
        // setTimeout(() => window.scroll(0, preYOffset), 50);
        process.nextTick(() => window.scroll(0, preYOffset));
    }

    componentWillReceiveProps(nextProps: INavigationComebackProps) {
        let stack = this.stack;
        let nextView = nextProps.view;
        if (stack.length != 0 && stack[stack.length - 1].view == nextView) {
            return;
        }
        stack.push(this.makeRecord(nextView));
    }

    render() {
        return (
            <div className='navBar-item navBar-item--with-icon-left cursor-pointer'
                onClick={this.handleComeback}>
                <div className='link-subtle navBar-link ellipsis-one-line'>

                    {/* No show Words*/}
                    <span className="navbar-link__text">{'\u00A0'}</span>

                    {ComebackIcon}
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.view,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        comeback: (preView) => dispatch(comeback(preView)),
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Comeback);
