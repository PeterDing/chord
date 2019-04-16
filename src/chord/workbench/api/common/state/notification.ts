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

    // No song can be played
    NO_SONG,
    // Filter songs which have no audio.
    FILTER_SONGS,
    // Song which has no audio.
    NO_AUDIO,

    LOGIN_SECCESS,
    LOGIN_FAIL,
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
