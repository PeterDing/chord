'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { IShowRecommendViewAct } from 'chord/workbench/api/common/action/home/recommend';

import { handleShowRecommendView } from 'chord/workbench/parts/mainView/browser/action/home/recommend';

import { HomeIcon } from 'chord/workbench/parts/common/component/common';


interface INavigationHomeProps {
    view: string;
    handleShowRecommendView: () => Promise<IShowRecommendViewAct>;
}

class Home extends React.Component<INavigationHomeProps, object> {

    constructor(props: INavigationHomeProps) {
        super(props);
    }

    render() {
        let active = this.props.view == 'homeView';
        return (
            <div className='navBar-item navBar-item--with-icon-left cursor-pointer'
                onClick={() => this.props.handleShowRecommendView()}>
                <div className={`navBar-link ellipsis-one-line ${active ? 'navBar-link--active' : 'link-subtle'}`}>
                    <span className='navbar-link__text'>Home</span>
                    {HomeIcon}
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
        handleShowRecommendView: () => handleShowRecommendView().then(act => dispatch(act)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
