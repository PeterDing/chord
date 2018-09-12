'use strict';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';


export interface ISearchInputProps {
    keyword: string;
    search: (keyword) => Promise<ISearchInputAct>;
}
