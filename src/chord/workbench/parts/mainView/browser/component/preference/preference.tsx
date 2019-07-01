'use strict';

import 'chord/css!../../media/preference';

import * as React from 'react';

import { XiamiLogin, NeteaseLogin, QQLogin } from 'chord/workbench/parts/mainView/browser/component/preference/user/login';
import ConfigurationView from 'chord/workbench/parts/mainView/browser/component/preference/configuration/configuration';

import { NavMenu } from 'chord/workbench/parts/common/component/navMenu';


interface IPreferenceViewState {
    view: string;
}

export default class PreferenceView extends React.Component<any, IPreferenceViewState> {

    constructor(props: any) {
        super(props);

        this.state = { view: 'accounts' };

        this.changeView = this.changeView.bind(this);
    }

    changeView(view: string) {
        this.setState({ view });
    }

    render() {
        let views = [
            { name: 'ACCOUNTS', value: 'accounts' },
            { name: 'CONFIGURATION', value: 'configuration' },
        ];

        let navMenu = <NavMenu
            namespace='preference-navmenu'
            thisView={this.state.view}
            views={views}
            handleClick={this.changeView} />;

        let content;
        switch (this.state.view) {
            case 'accounts':
                content = (
                    <div>
                        <XiamiLogin />
                        <NeteaseLogin />
                        <QQLogin />
                    </div>
                );
                break;
            case 'configuration':
                content = <ConfigurationView />;
                break;
        }

        return (
            <div>
                {navMenu}
                {content}
            </div>
        );
    }
}
