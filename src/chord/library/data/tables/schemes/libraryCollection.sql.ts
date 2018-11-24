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

    /**
     * ['releaseDate', 'integer']
     * Typo
     *
     * change to integer
     */
    ['releaseDate', 'integer'],

    ['description', 'text'],
    ['tags', 'text'],

    /**
     * ['duration', 'text']
     * Typo
     *
     * change to integer
     */
    ['duration', 'integer'],
    // json array ["songId"]
    ['songs', 'text'],

    /**
     * ['songCount', 'text'],
     * Typo
     *
     * change to integer
     */
    ['songCount', 'integer'],

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

    // Fix releaseDate, duration, songCount type error
    // {{{
    let tableScheme = db.prepare(`PRAGMA table_info(${TABLE_NAME})`).all();
    let songCountCol = tableScheme.find(columnInfo => columnInfo.name == 'songCount' && columnInfo.type == 'text');
    if (songCountCol) {
        let tmpTableName = TABLE_NAME + '_' + Date.now();

        // Create a temporary table
        let tableSql = makeTableSql(tmpTableName, TABLE_COLUMNS, ADDONS);
        db.exec(tableSql);

        let sql;
        // Update table
        sql = `INSERT INTO ${tmpTableName} SELECT * FROM ${TABLE_NAME}`;
        db.exec(sql);

        // Remove old table
        sql = `DROP TABLE ${TABLE_NAME}`;
        db.exec(sql);

        // Use new table
        sql = `ALTER TABLE ${tmpTableName} RENAME TO ${TABLE_NAME}`;
        db.exec(sql);
    }
    // }}}
}
