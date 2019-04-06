'use strict';


export interface IArtistsViewState {
    // 'options' | 'artists'
    view: string;
    origin: string;
}


export function initiateArtistsViewState(): IArtistsViewState {
    return {
        view: 'options',
        origin: null,
    };
}
