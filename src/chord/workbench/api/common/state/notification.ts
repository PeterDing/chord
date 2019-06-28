'use strict';


/**
 * Notice types
 */
export enum NOTICES {
    PLAY_SONG,
    PLAY_ARTIST,
    PLAY_ALBUM,
    PLAY_COLLECTION,
    PLAY_USERPROFILE,
    PLAY_LIST,

    PLAY_EPISODE,
    PLAY_PODCAST,
    PLAY_RADIO,

    // No song can be played
    NO_SONG,
    // Filter songs which have no audio.
    FILTER_SONGS,
    // Song which has no audio.
    NO_AUDIO,
    // switch to some kbps
    SWITCH_KBPS,
    // the audio which has this kbps is blocked by server
    BLOCKED_KBPS,

    LOGIN_SUCCESS,
    LOGIN_FAIL,

    // Can't connect server
    SERVER_FAIL,

    INFO,
}


// T is the item the notice occured.
export interface INotice<T> {
    type: NOTICES;
    item: T;
    message: string,
}


export interface INotificationState {
    entries: Array<INotice<any>>;
}


export function initiateNotificationState(): INotificationState {
    return { entries: [] };
}
