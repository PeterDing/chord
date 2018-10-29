'use strict';

import * as React from 'react';

import { ORIGIN } from 'chord/music/common/origin';

import { IAccount } from 'chord/music/api/user';

import { musicApi } from 'chord/music/core/api';

import { userConfiguration } from 'chord/preference/configuration/user';


class Login extends React.Component<any, any> {

    origin: string;

    constructor(props: any) {
        super(props);

        this.state = { account: '', password: '' };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event, key) {
        this.setState({
            [key]: event.target.value,
        });
    }

    login() {
        musicApi.login(this.origin, this.state['account'], this.state['password'])
            .then(account => {
                userConfiguration.setConfig(this.origin, { account });
                userConfiguration.saveConfig();
                this.setState({ account: '', password: '' });
            });
    }

    render() {
        let config = userConfiguration.getConfig();
        let account: IAccount = config[this.origin];

        let userId = account && account.user.userId;
        let userName = account && account.user.userName;

        return (
            <div className='inputBox'>
                <div className='contentSpacing'>
                    <h4 className='inputBox-label'>
                        {`${userId ? 'User: ' + userName : this.origin + ' Login'}`}</h4>
                    <form onSubmit={(event) => { event.preventDefault(); this.login(); }}
                        style={{ display: 'flex' }}>
                        <input className='inputBox-input small'
                            type='text' placeholder="Account"
                            value={this.state.account} onChange={(e) => this.handleInputChange(e, 'account')} />
                        <input className='inputBox-input small'
                            type='password' placeholder='Password'
                            value={this.state.password}
                            onChange={(e) => this.handleInputChange(e, 'password')} />
                        <button className='btn btn-green'>Login</button>
                    </form>
                </div>
            </div>
        );
    }
}


export class XiamiLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.xiami;
    }
}


export class NeteaseLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.netease;
    }
}


export class QQLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.qq;
    }
}
