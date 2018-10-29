'use strict';

import * as React from 'react';
import { connect } from 'react-redux';

import { PreferenceIcon } from 'chord/workbench/parts/common/component/common';

import { handlePreference } from 'chord/workbench/parts/navigation/browser/action/preference';


function Preference({ handlePreference }) {
    return (
        <div className='navBar-item navBar-item--with-icon-left'
            onClick={handlePreference}>
            <div className='link-subtle navBar-link ellipsis-one-line'>

                {/* No show Words*/}
                <span className="navbar-link__text">Preferences</span>

                {PreferenceIcon}
            </div>
        </div>
    );
}


function mapDispatchToProps(dispatch) {
    return {
        handlePreference: () => dispatch(handlePreference()),
    }
}

export default connect(null, mapDispatchToProps)(Preference);
