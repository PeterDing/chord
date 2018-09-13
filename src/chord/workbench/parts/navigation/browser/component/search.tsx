'use strict';

import 'chord/css!../media/navigationView';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { search } from 'chord/workbench/parts/navigation/browser/action/search';
import { INavigationSearchProps } from 'chord/workbench/parts/navigation/browser/props/search';
import { SearchIcon } from 'chord/workbench/parts/common/component/common';


class Search extends React.Component<INavigationSearchProps, object> {

    constructor(props: INavigationSearchProps) {
        super(props);
    }

    render() {
        let active = this.props.view == 'searchView';
        return (
            <div className='navBar-item navBar-item--with-icon-left'
                onClick={this.props.search}>
                <div className={`navBar-link ellipsis-one-line ${active ? 'navBar-link--active' : 'link-subtle'}`}>
                    <span className='navbar-link__text'>Search</span>
                {SearchIcon}
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
        search: () => dispatch(search()),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Search);
