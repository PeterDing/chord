'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { TVoidFn, voidFn } from 'chord/base/common/functions';
import { makeListKey } from 'chord/platform/utils/common/keys';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IUserProfile } from 'chord/music/api/user';

import { INotice, NOTICES } from 'chord/workbench/api/common/state/notification';

import { handleShowAlbumView } from 'chord/workbench/parts/mainView/browser/action/showAlbum';
import { handleShowArtistView } from 'chord/workbench/parts/mainView/browser/action/showArtist';
import { handleShowCollectionView } from 'chord/workbench/parts/mainView/browser/action/showCollection';
import { handleShowUserProfileView } from 'chord/workbench/parts/mainView/browser/action/showUserProfile';


type Titems = ISong | IAlbum | IArtist | ICollection | IUserProfile;


function getItemName(item: Titems): string {
    return item.type == 'userProfile' ? (item as IUserProfile).userName : item[item.type + 'Name'];
}


function getItemType(item: Titems): string {
    return item.type == 'userProfile' ? 'user' : item.type;
}


function NoticeView(
    { type, name, message = null, className = null, click }:
        { type: string, name: string, message: string, className: string, click: TVoidFn }) {

    let messageView = message ? <div dir='auto' className={`ellipsis-one-line ${className}`} title={message}>{message}</div> : null;
    return (
        <li className='navBar-item navBar-item--small'>
            <div className='react-contextmenu-wrapper'>
                <div className='navBar-link-text-with-icon-wrapper'>
                    <div className='navbar-link__text'>
                        <div dir='auto' className='ellipsis-one-line cursor-pointer' title={name}
                            onClick={() => click()}>
                            {name}</div>

                        {messageView}

                        <span className='navBar-item__type'>
                            {type}</span>
                    </div>
                </div>
            </div>
        </li>
    );
}


function PlayItemNoticeView({ item, handleShowItem }: { item: Titems, handleShowItem: TVoidFn }) {
    let name = getItemName(item);
    let type = getItemType(item);
    return <NoticeView type={type} name={name} message={null} className={null} click={handleShowItem} />;
}


function FilterSongView({ item, message, handleShowItem }: { item: Titems, message: string, handleShowItem: TVoidFn }) {
    let name = getItemName(item);
    let type = getItemType(item);
    let msg = `${message} songs aren't available`;
    return <NoticeView type={type} name={name} message={msg} className='warning-warn' click={handleShowItem} />;
}


function NoAudioView({ item }: { item: ISong }) {
    let name = getItemName(item);
    let type = 'song';
    let msg = "The song hasn't audio";
    return <NoticeView type={type} name={name} message={msg} className='warning-warn' click={voidFn} />;
}


function NoSongView({ item, handleShowItem }: { item: Titems, handleShowItem: TVoidFn }) {
    let name = getItemName(item);
    let type = getItemType(item);
    let msg = 'No song is available';
    return <NoticeView type={type} name={name} message={msg} className='warning-error' click={handleShowItem} />;
}


function LoginSeccess({ item, handleShowItem }: { item: IUserProfile, handleShowItem: TVoidFn }) {
    let name = getItemName(item);
    return <NoticeView type={item.origin} name={name} message={'Login Seccess'} className='warning-ok' click={handleShowItem} />
}


function LoginFail({ origin, message }: { origin: string, message: string }) {
    return <NoticeView type={origin} name={'Login Fail'} message={message} className='warning-error' click={voidFn} />
}


interface INavigationNotificationProps {
    entries: Array<INotice<any>>;

    handleShowAlbumView: (album: IAlbum) => void;
    handleShowArtistView: (artist: IArtist) => void;
    handleShowCollectionView: (collection: ICollection) => void;
    handleShowUserProfileView: (userProfile: IUserProfile) => void;
}

interface INavigationNotificationState {
    toggle: boolean;
}


class Notification extends React.Component<INavigationNotificationProps, INavigationNotificationState> {

    constructor(props: INavigationNotificationProps) {
        super(props);

        this.state = { toggle: true };

        this._toggle = this._toggle.bind(this);
        this._handleShowItem = this._handleShowItem.bind(this);
        this._makeNoticeViews = this._makeNoticeViews.bind(this);
    }

    _toggle() {
        this.setState((preState) => ({ toggle: !preState.toggle }));
    }

    _handleShowItem(item: Titems) {
        switch (item.type) {
            case 'album':
                return () => this.props.handleShowAlbumView(item as IAlbum);
            case 'artist':
                return () => this.props.handleShowArtistView(item as IArtist);
            case 'collection':
                return () => this.props.handleShowCollectionView(item as ICollection);
            case 'userProfile':
                return () => this.props.handleShowUserProfileView(item as IUserProfile);
            case 'song':
            default:
                return voidFn;
        }
    }

    _makeNoticeViews() {
        return this.props.entries.map((notice, index) => {
            let key = makeListKey(index, 'notice', 'item');
            switch (notice.type) {
                case NOTICES.PLAY_SONG:
                case NOTICES.PLAY_ALBUM:
                case NOTICES.PLAY_ARTIST:
                case NOTICES.PLAY_COLLECTION:
                case NOTICES.PLAY_USERPROFILE:
                case NOTICES.PLAY_LIST:
                    return <PlayItemNoticeView item={notice.item} handleShowItem={this._handleShowItem(notice.item)} key={key} />;

                case NOTICES.FILTER_SONGS:
                    return <FilterSongView item={notice.item} message={notice.message} handleShowItem={this._handleShowItem(notice.item)} key={key} />;
                case NOTICES.NO_AUDIO:
                    return <NoAudioView item={notice.item} key={key} />;
                case NOTICES.NO_SONG:
                    return <NoSongView item={notice.item} handleShowItem={this._handleShowItem(notice.item)} key={key} />;

                case NOTICES.LOGIN_SECCESS:
                    return <LoginSeccess item={notice.item} handleShowItem={this._handleShowItem(notice.item)} key={key} />;
                case NOTICES.LOGIN_FAIL:
                    return <LoginFail origin={notice.item} message={notice.message} key={key} />;
                default:
                    throw new Error(`[_makeNoticeViews]: unknown notice type: ${notice.type}`);
            }
        });
    }

    render() {
        let entries = this._makeNoticeViews();
        return (
            <div>
                <h2 className='navBar-group-header cursor-pointer'
                    onClick={() => this._toggle()}>
                    NOTIFICATION</h2>
                <ul className='notification-container'
                    style={{ display: this.state.toggle ? 'block' : 'none' }}>
                    {entries}
                </ul>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return state.notification;
}

function mapDispatchToProps(dispatch) {
    return {
        handleShowAlbumView: album => handleShowAlbumView(album).then(act => dispatch(act)),
        handleShowArtistView: artist => handleShowArtistView(artist).then(act => dispatch(act)),
        handleShowCollectionView: collection => handleShowCollectionView(collection).then(act => dispatch(act)),
        handleShowUserProfileView: userProfile => handleShowUserProfileView(userProfile).then(act => dispatch(act)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notification);
