'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { ICollection } from 'chord/music/api/collection';

import SongItemView from 'chord/workbench/parts/common/component/songItem';
import AlbumItemView from 'chord/workbench/parts/common/component/albumItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import {
    getMoreSongs,
    getMoreAlbums,
    getMoreCollections,
} from 'chord/workbench/parts/mainView/browser/component/home/component/newRelease/actions';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';
import { handlePlayManySongs } from 'chord/workbench/parts/player/browser/action/playMany';


interface INewReleaseProps {
    handlePlaySongs: (songs) => Promise<IPlayManyAct>;
}

interface INewReleaseState {
    songs: Array<ISong>;
    albums: Array<IAlbum>;
    collections: Array<ICollection>;
}


class NewReleaseView extends React.Component<INewReleaseProps, INewReleaseState> {

    constructor(props) {
        super(props);

        this.state = {
            songs: [],
            albums: [],
            collections: [],
        };

        this._getSongsView = this._getSongsView.bind(this);
        this._getAlbumsView = this._getAlbumsView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
    }

    componentWillMount() {
        Promise.all([
            getMoreSongs(0, 10),
            getMoreAlbums(0, 10),
            getMoreCollections(0, 10),
        ]).then(itemsList => {
            this.setState({
                songs: itemsList[0],
                albums: itemsList[1],
                collections: itemsList[2],
            });
        });
    }

    _getSongsView(size?: number) {
        let songsView = this.state.songs.slice(0, size ? size : Infinity).map(
            (song, index) => (
                <SongItemView
                    key={'song_newRelease_' + index.toString().padStart(3, '0')}
                    song={song}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _getAlbumsView(size?: number) {
        let albumsView = this.state.albums.slice(0, size ? size : Infinity).map(
            (album, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'album_newRelease_' + index.toString().padStart(3, '0')}>
                    <AlbumItemView album={album} />
                </div>
            )
        );
        return albumsView;
    }

    _getCollectionsView(size?: number) {
        let collectionsView = this.state.collections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'collection_newRelease_' + index.toString().padStart(3, '0')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return collectionsView;
    }

    render() {
        let songsView = this._getSongsView();
        let albumsView = this._getAlbumsView();
        let collectionsView = this._getCollectionsView();

        return (
            <div>
                <div className='contentSpacing'>
                    <div className='container-fluid container-fluid--noSpaceAround'>

                        {/* Songs View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Songs</h1>
                            <button className="btn btn-green btn-small cursor-pointer"
                                style={{ margin: '0px auto 15px', display: 'block' }}
                                onClick={() => this.props.handlePlaySongs(this.state.songs)}>
                                PlAY ALL</button>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {songsView}
                                </ol>
                            </section>
                        </div>

                        {/* Albums View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Albums</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {albumsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Collections View */}
                        <div className='row'>
                            <h1 className="search-result-title" style={{ textAlign: 'center' }}>
                                Playlists</h1>
                            <section>
                                <div className='container-fluid container-fluid--noSpaceAround'>
                                    <div className='align-row-wrap row'>
                                        {collectionsView}
                                    </div>
                                </div>
                            </section>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}


function mapDispatchToProps(dispatch) {
    return {
        handlePlaySongs: (songs) => handlePlayManySongs(songs).then(act => dispatch(act)),
    };
}

export default connect(null, mapDispatchToProps)(NewReleaseView);
