'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import CollectionListOptionsView from 'chord/workbench/parts/mainView/browser/component/home/component/collections/collectionOptions';
import CollectionListView from 'chord/workbench/parts/mainView/browser/component/home/component/collections/collectionList';


function CollectionsView({ view }: { view: string }) {
    let View;
    switch (view) {
        case 'options':
            View = <CollectionListOptionsView />;
            break;
        case 'collections':
            View = <CollectionListView />;
            break;
        default:
            throw new Error(`[CollectionsView]: unknown view: ${view}`);
    }

    return (
        <div>
            {View}
        </div>
    );
}


function mapStateToProps(state: IStateGlobal) {
    return {
        view: state.mainView.homeView.collectionsView.view,
    }
}

export default connect(mapStateToProps)(CollectionsView);
