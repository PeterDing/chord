'use strict';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/menu/browser/reducer/reduceMap';
import { IMenuState } from 'chord/workbench/api/common/state/menu/menu';


function handleView(act: string): string {
    switch (act) {
        case 'c:menu:showSongMenu':
            return 'songMenuView';
        case 'c:menu:showArtistMenu':
            return 'artistMenuView';
        case 'c:menu:showAlbumMenu':
            return 'albumMenuView';
        case 'c:menu:showCollectionMenu':
            return 'collectionMenuView';
        case 'c:menu:showUserProfileMenu':
            return 'userProfileMenuView';
        default:
            return null;
    }
}

export function menuReducer(state: IMenuState, act: Act): IMenuState {
    let { reducer, node } = map(act.act);
    let reducerState = getDescendentProp(state, node);
    let result = reducer(reducerState, act);
    let newState = { ...state };
    newState = setDescendentProp(newState, node, result);

    let preView = newState.view;
    let view = handleView(act.act);
    newState.view = view || preView;
    return newState;
}
