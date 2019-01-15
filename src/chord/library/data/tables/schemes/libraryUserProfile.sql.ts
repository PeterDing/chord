'use strict';

import { Database } from 'better-sqlite3';

import { makeTableSql, addMissColumns } from 'chord/library/data/tables/schemes/util';


const TABLE_NAME = 'library_user_profile';
const TABLE_COLUMNS = [
    ['id', 'integer primary key asc'],
    ['userId', 'text unique on conflict ignore'],
    ['type', 'text'],
    ['origin', 'text'],
    ['userOriginalId', 'text'],
    // for qq music
    ['userMid', 'text'],
    ['url', 'text'],
    ['userName', 'text'],
    ['userAvatarUrl', 'text'],
    ['userAvatarPath', 'text'],
    ['followerCount', 'integer'],
    ['followingCount', 'integer'],
    // json array: ["userId"] or []
    ['followers', 'text'],
    // json array: ["userId"] or []
    ['followings', 'text'],
    ['listenCount', 'integer'],
    ['songCount', 'integer'],
    ['artistCount', 'integer'],
    ['albumCount', 'integer'],
    ['createdCollectionCount', 'integer'],
    ['favoriteCollectionCount', 'integer'],
    // json array: ["songId"] or []
    ['songs', 'text'],
    // json array: ["artistId"] or []
    ['artists', 'text'],
    // json array: ["albumId"] or []
    ['albums', 'text'],
    // json array: ["collectionId"] or []
    ['createdCollections', 'text'],
    // json array: ["collectionId"] or []
    ['favoriteCollections', 'text'],
    ['description', 'text'],
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
