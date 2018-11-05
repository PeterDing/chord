'use strict';

import { ok } from 'chord/base/common/assert';

import Database = require('better-sqlite3');


const TABLE_SCHEME_SQL = (tableName: string, columns: string, addons: string) => `
create table if not exists ${tableName} (
    ${columns}${!!addons ? ',' : ''}
    ${!!addons ? addons : ''}
)
`;

export function makeTableSql(name: string, columns: string[][], addons?: string) {
    ok(columns.length);

    let cols = '';
    for (let [col, desc] of columns) {
        cols += `${col} ${desc},\n`;
    }
    cols = cols.slice(0, -2);
    return TABLE_SCHEME_SQL(name, cols, addons);
}


export function addMissColumns(tableName: string, columns: string[][], db: Database): void {
    let tableScheme = db.prepare(`PRAGMA table_info(${tableName})`).all();
    let cols = new Set(tableScheme.map(info => info.name));
    columns
        .filter(([col, desc]) => !cols.has(col))
        .forEach(([col, desc]) => {
            let sql = `ALTER TABLE ${tableName} ADD COLUMN ${col} ${desc}`;
            db.exec(sql);
        });
}
