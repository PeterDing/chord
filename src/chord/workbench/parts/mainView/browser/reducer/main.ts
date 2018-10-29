'use strict';

import { getDescendentProp, setDescendentProp } from 'chord/base/common/property';
import { Act } from 'chord/workbench/api/common/action/proto';
import { map } from 'chord/workbench/parts/mainView/browser/reducer/reduceMap';
import { IMainViewState } from 'chord/workbench/api/common/state/mainView/mainView';


/**
 * What is view of this mainView
 */
function handleView(act: string): string {
    switch (act) {
        case 'c:mainView:searchView':
        case 'c:mainView:searchInput':
        case 'c:mainView:searchMoreSongs':
        case 'c:mainView:searchMoreAlbums':
        case 'c:mainView:searchMoreArtists':
        case 'c:mainView:searchMoreCollections':
            return 'searchView';

        case 'c:mainView:showAlbumView':
            return 'albumView';

        case 'c:mainView:showCollectionView':
            return 'collectionView';

        case 'c:mainView:showArtistView':
        case 'c:mainView:getMoreArtistSongs':
        case 'c:mainView:getMoreArtistAlbums':
            return 'artistView';

        case 'c:mainView:libraryView':
        case 'c:mainView:libraryInput':
        case 'c:mainView:getMoreLibrarySongs':
        case 'c:mainView:getMoreLibraryArtists':
        case 'c:mainView:getMoreLibraryAlbums':
        case 'c:mainView:getMoreLibraryCollections':
            return 'libraryView';

        case 'c:mainView:preferenceView':
            return 'preferenceView';

        case 'c:mainView:comeback':
        case 'c:mainView:addLibrarySong':
        case 'c:mainView:addLibraryArtist':
        case 'c:mainView:addLibraryAlbum':
        case 'c:mainView:addLibraryCollection':
        default:
            return null;
    }
}


export function mainViewReducer(state: IMainViewState, act: Act): IMainViewState {
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
