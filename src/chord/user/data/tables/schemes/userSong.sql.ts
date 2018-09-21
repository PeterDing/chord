'use strict';


export const USER_SONG_SCHEME_SQL = `
create table if not exists user_song (
    id integer primary key asc,

    songId text unique on conflict ignore,
    addAt integer
)
`;
