'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { ISong } from 'chord/music/api/song';
import { ICollection } from 'chord/music/api/collection';

import { IPlayManyAct } from 'chord/workbench/api/common/action/player';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import SongItemView from 'chord/workbench/parts/common/component/songItem';
import CollectionItemView from 'chord/workbench/parts/common/component/collectionItem';

import { handlePlayManySongs } from 'chord/workbench/parts/player/browser/action/playMany';


interface IRecommendViewProps {
    songs: Array<ISong>;
    collections: Array<ICollection>;
    handlePlayRecommendSongs: (songs) => Promise<IPlayManyAct>;
}


class RecommendView extends React.Component<IRecommendViewProps, any> {

    static view: string

    constructor(props: IRecommendViewProps) {
        super(props);

        this._getSongsView = this._getSongsView.bind(this);
        this._getCollectionsView = this._getCollectionsView.bind(this);
    }

    _getSongsView(size?: number) {
        let songsView = this.props.songs.slice(0, size ? size : Infinity).map(
            (song, index) => (
                <SongItemView
                    key={'song_recommend_' + index.toString().padStart(3, '0')}
                    song={song}
                    active={false}
                    short={false}
                    thumb={false}
                    handlePlay={null} />
            )
        );
        return songsView;
    }

    _getCollectionsView(size?: number) {
        let collectionsView = this.props.collections.slice(0, size ? size : Infinity).map(
            (collection, index) => (
                <div className='col-xs-6 col-sm-4 col-md-3 col-lg-2 col-xl-2'
                    key={'collection_recommend_' + index.toString().padStart(3, '0')}>
                    <CollectionItemView collection={collection} />
                </div>
            )
        );
        return collectionsView;
    }

    render() {
        let songsView = this._getSongsView();
        let collectionsView = this._getCollectionsView();

        let songs = this.props.songs;

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
                                onClick={() => this.props.handlePlayRecommendSongs(songs)}>
                                PlAY ALL</button>
                            <section className='tracklist-container'>
                                <ol className='tracklist'>
                                    {songsView}
                                </ol>
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


function mapStateToProps(state: IStateGlobal) {
    return {
        ...state.mainView.homeView.recommendView,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        handlePlayRecommendSongs: (songs) => handlePlayManySongs(songs).then(act => dispatch(act)),
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(RecommendView);
