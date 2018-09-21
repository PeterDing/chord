'use strict';

import { ILibraryInputAct } from 'chord/workbench/api/common/action/mainView';


export interface INavigationLibraryProps {
    view: string;
    showLibrary: () => ILibraryInputAct;
}
