'use strict';

import { IShowArtistListOptionsViewAct, IShowArtistListViewAct } from 'src/chord/workbench/api/common/action/home/artists';

import { musicApi } from 'chord/music/core/api';


export function handleShowArtistListOptionsView(): IShowArtistListOptionsViewAct {
    return {
        type: 'c:mainView:home:showArtistListOptionsView',
        act: 'c:mainView:home:showArtistListOptionsView',
    };
}


export function handleShowArtistListView(origin: string): IShowArtistListViewAct {
    return {
        type: 'c:mainView:home:showArtistListView',
        act: 'c:mainView:home:showArtistListView',

        origin,
    };
}


export async function handleGetArtists(
    origin: string,
    area: string,
    genre: string,
    gender: string,
    index: string,
    offset: number,
    size: number = 50): Promise<any> {
    let items = await musicApi.artistList(origin, area, genre, gender, index, offset, size);
    return items;
}
