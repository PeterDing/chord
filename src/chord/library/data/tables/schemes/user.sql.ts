'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'user';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['username', 'text unique'],
    ['encrypted_password', 'text'],
];
const ADDONS = null;


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
