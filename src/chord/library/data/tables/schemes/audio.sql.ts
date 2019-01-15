'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'audio';
const TABLE_COLUMNS = [
    ['songId', 'text'],
    ['format', 'text'],
    ['size', 'integer'],
    ['kbps', 'integer'],
    ['url', 'text'],
    ['path', 'text'],
];
const ADDONS = 'primary key (songId, format, size)';


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
