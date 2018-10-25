'use strict';

import Database = require('better-sqlite3');

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_playlist';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['playListId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['playListName', 'text'],
    // json array ["songId"]
    ['songs', 'text'],
    ['songCount', 'integer'],
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
