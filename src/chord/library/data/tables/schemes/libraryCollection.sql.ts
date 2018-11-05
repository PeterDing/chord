'use strict';

import Database = require('better-sqlite3');

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_collection';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['collectionId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['collectionOriginalId', 'text'],
    ['url', 'text'],
    ['collectionName', 'text'],
    ['collectionCoverUrl', 'text'],
    ['collectionCoverPath', 'text'],
    ['userId', 'text'],
    ['userMid', 'text'],
    ['userName', 'text'],
    ['releaseDate', 'text'],
    ['description', 'text'],
    ['tags', 'text'],
    ['duration', 'text'],
    // json array ["songId"]
    ['songs', 'text'],
    ['songCount', 'text'],
    ['playCount', 'integer'],
    ['likeCount', 'integer'],
    ['like', 'integer'],
    ['addAt', 'integer'],
];
const ADDONS = null;


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
