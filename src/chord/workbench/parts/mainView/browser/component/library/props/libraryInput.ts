'use strict';

import { ILibraryInputAct } from 'chord/workbench/api/common/action/mainView';


export interface ILibraryInputProps {
    keyword: string;
    librarySearch: (keyword: string) => ILibraryInputAct;
}
