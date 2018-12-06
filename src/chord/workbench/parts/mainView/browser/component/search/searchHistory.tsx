'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { search } from 'chord/workbench/parts/mainView/browser/action/searchInput';
import { ISearchHistoryProps } from 'chord/workbench/parts/mainView/browser/component/search/props/searchHistory';

import { readLocalSearchHistoryState } from 'chord/preference/utils/app';


class SearchHistory extends React.Component<ISearchHistoryProps, object> {

    constructor(props: ISearchHistoryProps) {
        super(props);
    }

    render() {
        let history = this.props.history.keywords.map((keyword, index) => (
            <li key={index} onClick={() => this.props.search(keyword)}>
                <div className='link-subtle'>
                    <h1 className='ellipsis-one-line'>{keyword}</h1>
                </div>
            </li>
        ));

        return (
            <div className='contentSpacing'>
                <div className='search-history'>
                    <ul>
                        {history}
                    </ul>
                </div>
            </div>
        );
    }
}


let _readed = false;

function mapStateToProps(state: IStateGlobal) {
    let history = state.mainView.searchView.history;
    if (!_readed && history.keywords.length == 0) {
        history.keywords = [...readLocalSearchHistoryState().keywords];
        _readed = true;
    }
    return {
        history: state.mainView.searchView.history,
    }
}


function mapDispatchToProps(dispatch) {
    return {
        search: keyword => search(keyword).then(act => dispatch(act)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(SearchHistory);
