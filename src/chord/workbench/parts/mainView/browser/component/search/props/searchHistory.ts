'use strict';

import { ISearchInputAct } from 'chord/workbench/api/common/action/mainView';
import { ISearchHistoryState } from 'chord/workbench/api/common/state/mainView/searchView';


export interface ISearchHistoryProps {
    history: ISearchHistoryState,
    search: (inputValue) => Promise<ISearchInputAct>;
}
