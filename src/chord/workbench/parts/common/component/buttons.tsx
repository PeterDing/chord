'use strict';

import * as React from 'react';


export function MenuButton({ click }) {
    return (
        <div className="react-contextmenu-wrapper"
            onClick={(e) => click(e)}>
            <button className="btn btn-transparent btn--narrow cursor-pointer" title="More">
                <div className="spoticon-ellipsis-24"></div>
            </button>
        </div>
    );
}
