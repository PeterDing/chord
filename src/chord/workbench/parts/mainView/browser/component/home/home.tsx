'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import NagivationMenuView from 'chord/workbench/parts/mainView/browser/component/home/component/navigation/navigation';
import RecommendView from 'chord/workbench/parts/mainView/browser/component/home/component/recommend/recommendView';


function HomeView({ view }) {
    let View;
    switch (view) {
        case 'recommendView':
            View = RecommendView;
            break;
        default:
            throw new Error(`[HomeView]: unknown view: ${view}`);
    }

    return (
        <div className='hw-accelerate'>
            <section>

                <NagivationMenuView />
                <View />

            </section>
        </div>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.view,
    }
}


export default connect(mapStateToProps)(HomeView);
