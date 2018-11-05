'use strict';

import { makeTable as makeTableAudio, fixTable as fixTableAudio } from 'chord/library/data/tables/schemes/audio.sql';
import { makeTable as makeTableUser, fixTable as fixTableUser } from 'chord/library/data/tables/schemes/user.sql';
import { makeTable as makeTableSong, fixTable as fixTableSong } from 'chord/library/data/tables/schemes/song.sql';
import { makeTable as makeTableLibrarySong, fixTable as fixTableLibrarySong } from 'chord/library/data/tables/schemes/librarySong.sql';
import { makeTable as makeTableLibraryAlbum, fixTable as fixTableLibraryAlbum } from 'chord/library/data/tables/schemes/libraryAlbum.sql';
import { makeTable as makeTableLibraryArtist, fixTable as fixTableLibraryArtist } from 'chord/library/data/tables/schemes/libraryArtist.sql';
import { makeTable as makeTableLibraryCollection, fixTable as fixTableLibraryCollection } from 'chord/library/data/tables/schemes/libraryCollection.sql';
import { makeTable as makeTableLibraryUserProfile, fixTable as fixTableLibraryUserProfile } from 'chord/library/data/tables/schemes/libraryUserProfile.sql';

import { LibraryDatabase } from 'chord/library/data/database';


export function createTables(db: LibraryDatabase): boolean {
    // create tables
    makeTableAudio(db.getDatabase());
    makeTableUser(db.getDatabase());
    makeTableSong(db.getDatabase());
    makeTableLibrarySong(db.getDatabase());
    makeTableLibraryAlbum(db.getDatabase());
    makeTableLibraryArtist(db.getDatabase());
    makeTableLibraryCollection(db.getDatabase());
    makeTableLibraryUserProfile(db.getDatabase());

    // fix tables
    fixTableAudio(db.getDatabase());
    fixTableUser(db.getDatabase());
    fixTableSong(db.getDatabase());
    fixTableLibrarySong(db.getDatabase());
    fixTableLibraryAlbum(db.getDatabase());
    fixTableLibraryArtist(db.getDatabase());
    fixTableLibraryCollection(db.getDatabase());
    fixTableLibraryUserProfile(db.getDatabase());

    return true;
}
