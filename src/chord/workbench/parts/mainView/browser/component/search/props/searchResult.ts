'use strict';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IOffset } from 'chord/workbench/api/common/state/offset';
import {
    ISearchMoreSongsAct,
    ISearchMoreAlbumsAct,
    ISearchMoreArtistsAct,
    ISearchMoreCollectionsAct,
} from 'chord/workbench/api/common/action/mainView';


export interface ISearchResultProps {
    // 'top' | 'artists' | 'songs' | 'albums' | 'collections'
    // For searching result navigation
    view: string;

    keyword: string;

    songs: Array<ISong>;
    albums: Array<IAlbum>;
    artists: Array<IArtist>;
    collections: Array<ICollection>;

    songsOffset: IOffset;
    albumsOffset: IOffset;
    artistsOffset: IOffset;
    collectionsOffset: IOffset;

    searchMoreSongs: (keyword, offset) => Promise<ISearchMoreSongsAct>;
    searchMoreAlbums: (keyword, offset) => Promise<ISearchMoreAlbumsAct>;
    searchMoreArtists: (keyword, offset) => Promise<ISearchMoreArtistsAct>;
    searchMoreCollections: (keyword, offset) => Promise<ISearchMoreCollectionsAct>;
}
