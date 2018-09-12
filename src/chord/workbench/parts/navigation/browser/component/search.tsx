'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { search } from 'chord/workbench/parts/navigation/browser/action/search';
import { INavigationSearchProps } from 'chord/workbench/parts/navigation/browser/props/search';
import { SearchIcon } from 'chord/workbench/parts/common/component/common';


class Search extends React.Component<INavigationSearchProps, object> {

    constructor(props: INavigationSearchProps) {
        super(props);
    }

    render() {
        return (
            <div className='navBar-item navBar-item--with-icon-left'
                onClick={this.props.search}>
                <div className='link-subtle navBar-link ellipsis-one-line'>
                    <span className='navbar-link__text'>Search</span>
                    {SearchIcon}
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        search: () => dispatch(search()),
    }
}

export default connect(null, mapDispatchToProps)(Search);
