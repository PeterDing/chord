'use strict';

import Database = require('better-sqlite3');

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_artist';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['artistId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['artistOriginalId', 'text'],
    ['artistMid', 'text'],
    ['url', 'text'],
    ['artistName', 'text'],
    ['artistAlias', 'text'],
    ['artistAvatarUrl', 'text'],
    ['artistAvatarPath', 'text'],
    ['area', 'text'],
    // json array
    ['genres', 'text'],
    // json array
    ['styles', 'text'],
    // json array
    ['tags', 'text'],
    ['description', 'text'],
    ['addAt', 'integer'],
    ['playCount', 'integer'],
    ['likeCount', 'integer'],
    ['like', 'integer'],
];
const ADDONS = null;


export function makeTable(db: Database): void {
    let tableSql = makeTableSql(TABLE_NAME, TABLE_COLUMNS, ADDONS);
    db.exec(tableSql);
}

export function fixTable(db: Database): void {
    addMissColumns(TABLE_NAME, TABLE_COLUMNS, db);
}
