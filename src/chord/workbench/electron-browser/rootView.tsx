'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { PlayerView } from 'chord/workbench/parts/player/browser/playerView';
import { NavigationView } from 'chord/workbench/parts/navigation/browser/navigationView';
import { IRootViewProps } from 'chord/workbench/electron-browser/props/rootView';

import { getMainBackground } from 'chord/workbench/electron-browser/media/mainBackground';

import MainView from 'chord/workbench/parts/mainview/browser/mainView';


class RootView extends React.Component<IRootViewProps, any> {

    constructor(props: IRootViewProps) {
        super(props);
    }

    render() {
        let viewKey = this.props.viewKey;
        let background = getMainBackground(viewKey);

        return (
            <div>

                <div className='main-background'
                    style={{ backgroundImage: background }}></div>

                <div className='top-container'>
                    <NavigationView />
                    <MainView />
                </div>

                <div>
                    {/* PlayView */}
                    <PlayerView />
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return { viewKey: state.mainView.view };
}


export default connect(mapStateToProps)(RootView);
