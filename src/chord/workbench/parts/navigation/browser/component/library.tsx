'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { INavigationLibraryProps } from 'chord/workbench/parts/navigation/browser/props/library';

import { librarySearch } from 'chord/workbench/parts/mainView/browser/action/libraryInput';
import { LibraryIcon } from 'chord/workbench/parts/common/component/common';


class Library extends React.Component<INavigationLibraryProps, object> {

    constructor(props: INavigationLibraryProps) {
        super(props);
    }

    render() {
        let active = this.props.view == 'libraryView';
        return (
            <div className='navBar-item navBar-item--with-icon-left'
                onClick={this.props.showLibrary}>
                <div className={`navBar-link ellipsis-one-line ${active ? 'navBar-link--active' : 'link-subtle'}`}>
                    <span className='navbar-link__text'>Your Library</span>
                    {LibraryIcon}
                </div>
            </div >
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
        showLibrary: () => dispatch(librarySearch('')),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Library);
