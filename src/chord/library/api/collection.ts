'use strict';

import { ICollection } from "chord/music/api/collection";


export interface IUserCollection {
    // id for database
    id: number;
    addAt: number;  // millisecond
    collection: ICollection;
}
