'use strict';

import Database = require('better-sqlite3');

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_song';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['songId', 'text unique on conflict ignore'],
    ['type', 'text'],
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
