'use strict';

import { IRadio } from "chord/sound/api/radio";


export interface ILibraryRadio {
    // id for database
    id: number;
    addAt: number;  // millisecond
    radio: IRadio;
}
