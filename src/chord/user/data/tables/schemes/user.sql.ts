'use strict';


export const USER_SCHEME_SQL = `
create table if not exists user (
    id integer primary key asc,

    username text unique,
    encrypted_password text
)
`;
