'use strict';

import * as React from 'react';
// import { connect } from 'react-redux';

// import { ISongInfoProps } from 'chord/workbench/parts/player/browser/props/songInfo';


class Like extends React.Component<object, object> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <button className='control-button spoticon-heart-16'> </button>
        );
    }

}

export default Like;
