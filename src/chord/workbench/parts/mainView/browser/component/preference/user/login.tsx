'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ESize } from 'chord/music/common/size';

import { ORIGIN } from 'chord/music/common/origin';

import { IAccount } from 'chord/music/api/user';

import { handleShowUserProfileView } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';
import { handlePlayUserFavoriteSongs } from 'chord/workbench/parts/player/browser/action/playUser';

import { OriginIcon } from 'chord/workbench/parts/common/component/originIcons';
import { UserProfileIcon } from 'chord/workbench/parts/common/component/common';

import { musicApi } from 'chord/music/core/api';

import { userConfiguration } from 'chord/preference/configuration/user';


class Login extends React.Component<any, any> {

    origin: string;

    constructor(props: any) {
        super(props);

        this.state = { account: '', password: '' };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.login = this.login.bind(this);
        this.loginOut = this.loginOut.bind(this);
        this.showLogin = this.showLogin.bind(this);
        this.showLogined = this.showLogined.bind(this);
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

    /**
     * Remove all siginup info
     */
    loginOut() {
        userConfiguration.setConfig(this.origin, null);
        userConfiguration.saveConfig();
        musicApi.clean(this.origin);
        this.forceUpdate();
    }

    showLogin() {
        let input = this.origin != ORIGIN.qq ? (
            <div className='inputBox'>
                <div className='contentSpacing'>
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
        ) : (
                <button className='btn btn-green'
                    onClick={(event) => { event.preventDefault(); this.login(); }}>
                    Login</button>
            );

        return (
            <header className="user-header">
                <div className="row">
                    <div className="user-info col-md-12">
                        <h1 className='user-name'>{this.origin.toUpperCase()}</h1>
                        {input}
                    </div>
                </div>
            </header>
        );
    }

    showLogined(account: IAccount) {
        let userProfile = account.user;
        let userName = userProfile.userName;
        let cover = userProfile.userAvatarPath || musicApi.resizeImageUrl(userProfile.origin, userProfile.userAvatarUrl.split('@')[0], ESize.Big);
        let originIcon = OriginIcon(userProfile.origin, 'user-icon xiami-icon');

        return (
            <header className="user-header">
                <div className="row">
                    <div className="user-info col-md-12">

                        <div className="media-object mo-artist" style={{ maxWidth: '220px', margin: '10px auto' }}>
                            <div className="media-object-hoverable">
                                <div className="react-contextmenu-wrapper"
                                    onContextMenu={(e) => this.props.showUserProfileMenu(e, userProfile)}>
                                    <div className="cover-art shadow actionable rounded linking cover-art--with-auto-height"
                                        aria-hidden="true" style={{ width: 'auto', height: 'auto' }}>
                                        <div onClick={() => this.props.handleShowUserProfileView(userProfile)}>
                                            {UserProfileIcon}
                                            <div className="cover-art-image cover-art-image-loaded"
                                                style={{ backgroundImage: `url("${cover}")` }}>
                                            </div>
                                        </div>
                                        <button className="cover-art-playback"
                                            onClick={() => this.props.handlePlayUserFavoriteSongs(userProfile)}>
                                            <svg className="icon-play" viewBox="0 0 85 100"><path fill="currentColor" d="M81 44.6c5 3 5 7.8 0 10.8L9 98.7c-5 3-9 .7-9-5V6.3c0-5.7 4-8 9-5l72 43.3z"><title>PLAY</title></path></svg></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {originIcon}

                        <h1 className="user-name">{userName}</h1>
                        <button className='btn btn-green'
                            onClick={(event) => { event.preventDefault(); this.loginOut(); }}>
                            Login Out</button>
                    </div>
                </div>
            </header>
        );
    }

    render() {
        let config = userConfiguration.getConfig();
        let info: { account: IAccount } = config[this.origin];

        if (info) {
            return this.showLogined(info.account);
        } else {
            return this.showLogin();
        }
    }
}


class _XiamiLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.xiami;
    }
}


class _NeteaseLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.netease;
    }
}


class _QQLogin extends Login {
    constructor(props: any) {
        super(props);
        this.origin = ORIGIN.qq;
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handleShowUserProfileView: userProfile => handleShowUserProfileView(userProfile).then(act => dispatch(act)),
        handlePlayUserFavoriteSongs: userProfile => handlePlayUserFavoriteSongs(userProfile).then(act => dispatch(act)),
    };
}

const cnt = connect(null, mapDispatchToProps);
export const XiamiLogin = cnt(_XiamiLogin);
export const NeteaseLogin = cnt(_NeteaseLogin);
export const QQLogin = cnt(_QQLogin);
