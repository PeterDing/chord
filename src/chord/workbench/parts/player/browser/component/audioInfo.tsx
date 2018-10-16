'use strict';


import * as React from 'react';
import { connect } from 'react-redux';

import { IStateGlobal } from 'chord/workbench/api/common/state/stateGlobal';


const style = { paddingRight: '8px', fontSize: '12px' };

function AudioInfo({ kbps }: { kbps: number }) {
    return kbps ? (
        <span style={style}>{`${kbps}kbps`}</span>
    ) : null;
}


function mapStateToProps(state: IStateGlobal) {
    return {
        kbps: state.player.kbps,
    };
}


export default connect(mapStateToProps)(AudioInfo);
