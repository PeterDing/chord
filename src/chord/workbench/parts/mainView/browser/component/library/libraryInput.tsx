'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';
import { ILibraryInputProps } from 'chord/workbench/parts/mainView/browser/component/library/props/libraryInput';

import { librarySearch } from 'chord/workbench/parts/mainView/browser/action/libraryInput';


class LibraryInput extends React.Component<ILibraryInputProps, any> {

    constructor(props: ILibraryInputProps) {
        super(props);

        this.state = {
            keyword: this.props.keyword,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    /**
     * handle clicking of history searching
     */
    componentWillReceiveProps(nextProps: ILibraryInputProps) {
        if (this.state.keyword != nextProps.keyword) {
            this.setState({
                keyword: nextProps.keyword,
            });
        }
    }

    handleInputChange(event) {
        this.setState({
            keyword: event.target.value,
        });
    }

    render() {
        return (
            <div className='inputBox'>
                <div className='contentSpacing'>
                    <h4 className='inputBox-label'>Search for Your Owned Artist, Song, Album or Playlist</h4>
                    <form onSubmit={(event) => { this.props.librarySearch(this.state.keyword); event.preventDefault(); }}>
                        <input className='inputBox-input'
                            type="text" placeholder='Start typing...'
                            value={this.state.keyword} onChange={this.handleInputChange} />
                    </form>
                </div>
            </div>
        );
    }
}


function mapStateToProps(state: IStateGlobal) {
    return {
        keyword: state.mainView.libraryView.keyword,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        librarySearch: keyword => dispatch(librarySearch(keyword)),
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LibraryInput);
