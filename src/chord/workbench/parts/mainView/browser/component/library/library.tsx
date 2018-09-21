'use strict';

import * as React from 'react';

import LibraryInput from 'chord/workbench/parts/mainView/browser/component/library/libraryInput';
import LibraryResult from 'chord/workbench/parts/mainView/browser/component/library/libraryResult';


function LibraryView() {
    return (
        <div className='hw-accelerate'>
            <section>

                <div>
                    <LibraryInput />
                </div>

                <div>
                    <LibraryResult />
                </div>

            </section>
        </div>
    );
}

export default LibraryView;
