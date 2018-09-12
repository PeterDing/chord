'use strict';

import { INavigationComebackAct } from 'chord/workbench/api/common/action/navigation';


export interface INavigationComebackProps {
    view: string;
    comeback: (preView) => INavigationComebackAct;
}
