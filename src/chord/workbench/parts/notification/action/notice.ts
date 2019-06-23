'use strict';

import { Store } from 'redux';

import { hasPlayItemAudio } from 'chord/workbench/api/utils/playItem';

import { TPlayItem } from 'chord/unity/api/items';
import { IUserProfile } from 'chord/music/api/user';

import { INotice, NOTICES } from 'chord/workbench/api/common/state/notification';


function makeNotice<T>(type: NOTICES, item: T, message: string = null): INotice<T> {
    return { type, item, message };
}


export function notice<T>(type: NOTICES, item: T, message: string = null) {
    let act = {
        type: 'c:notification:notice',
        act: 'c:notification:notice',
        notice: makeNotice(type, item, message),
    };

    let store: Store = (<any>window).store;
    process.nextTick(() => store.dispatch(act));
}

/**
 * Notice playing item
 *
 * item is one TPlayItem | IAlbum | IArtist | ICollection | IUserProfile
 */
export function noticePlayItem<T>(item: T, count?: number, missing?: number) {
    if (item['type'] == 'song' || item['type'] == 'episode') {
        if (!hasPlayItemAudio(<any>item)) {
            notice(NOTICES.NO_AUDIO, item);
        } else {
            notice(NOTICES.PLAY_SONG, item);
        }
    } else {
        if (count == 0) {
            notice(NOTICES.NO_SONG, item);
        } else if (missing == count) {
            notice(NOTICES.NO_SONG, item);
        } else if (missing > 0) {
            notice(NOTICES.FILTER_SONGS, item, `${missing}`);
        } else {
            notice(NOTICES['PLAY_' + item['type'].toUpperCase()], item);
        }
    }
}


export function loginSuccess(userProfile: IUserProfile) {
    notice(NOTICES.LOGIN_SUCCESS, userProfile);
}


export function loginFail(origin: string, message: string) {
    notice(NOTICES.LOGIN_FAIL, origin, message);
}


export function noticeBlockedKbps(item: TPlayItem, kbps: number) {
    notice(NOTICES.BLOCKED_KBPS, item, kbps.toString());
}


export function noticeSwitchKbps(item: TPlayItem, kbps: number) {
    notice(NOTICES.SWITCH_KBPS, item, kbps.toString());
}


export function noticeServerFail<T>(item: T) {
    notice(NOTICES.SERVER_FAIL, item);
}
