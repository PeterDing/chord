'use strict';


export const USER_PLAYLIST_SCHEME_SQL = `
create table if not exists user_playlist (
    id integer primary key asc,

    playListId text unique on conflict ignore,

    playListName text,

    -- json array, ["songId"]
    songs text,
    songCount integer,

    addAt integer
)
`;
