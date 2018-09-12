'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SearchInput from 'chord/workbench/parts/mainView/browser/component/search/searchInput';
import SearchResult from 'chord/workbench/parts/mainView/browser/component/search/searchResult';
import SearchHistory from 'chord/workbench/parts/mainView/browser/component/search/searchHistory';


function SearchView({ view }) {
    let View;
    if (view == 'searchHistory') {
        View = <SearchHistory />;
    } else if (view == 'searchResult') {
        View = <SearchResult />;
    } else {
        return null;
    }

    return (
        <div className='hw-accelerate'>
            <section>

                <div>
                    <SearchInput />
                </div>

                <div>
                    {View}
                </div>

            </section>
        </div>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.searchView.view,
    }
}


export default connect(mapStateToProps)(SearchView);
