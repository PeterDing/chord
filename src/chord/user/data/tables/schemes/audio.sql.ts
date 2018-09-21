'use strict';


export const AUDIO_SCHEME_SQL = `
create table if not exists audio (
    songId text,

    format text,
    size integer,
    kbps integer,
    url text,
    path text,

    primary key (songId, format, size)
)
`;
