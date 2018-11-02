'use strict';

import * as paths from 'path';

import { CHORD_DIR } from 'chord/preference/common/chord';

import { ok } from 'chord/base/common/assert';

import * as fs from 'fs';

import { ISong } from "chord/music/api/song";
import { IAlbum } from "chord/music/api/album";
import { IArtist } from "chord/music/api/artist";
import { ICollection } from "chord/music/api/collection";
import { IUserProfile } from "chord/music/api/user";
// import { IPlayList } from "chord/music/api/playList";

import { IUserSong } from 'chord/library/api/song';
import { IUserAlbum } from 'chord/library/api/album';
import { IUserArtist } from 'chord/library/api/artist';
import { IUserCollection } from 'chord/library/api/collection';
// import { IUserPlayList } from 'chord/library/api/playList';

import { encryptPassword } from 'chord/library/auth/encrypt';

import { LibraryDatabase } from 'chord/library/data/database';

import { createTables } from 'chord/library/core/createTables';


export class Library {

    username: string;
    password: string;

    db: LibraryDatabase;
    databasePath: string;


    constructor(username: string, databasePath: string, password: string = '') {
        this.username = username;
        this.databasePath = databasePath;
        this.password = password;

        this.init();
    }

    init() {
        if (fs.existsSync(this.databasePath)) {
            this.db = new LibraryDatabase(this.databasePath);
            // TODO: check database table schemes

            // auth
            let encPasswd1 = this.db.getEncryptedPassword();
            let encPasswd2 = encryptPassword(this.password);
            ok(encPasswd1 == encPasswd2, `[user] password not match: ${encPasswd1} != ${encPasswd2}`);
        } else {
            this.db = new LibraryDatabase(this.databasePath);
            createTables(this.db);
            this.db.addUser(this.username, encryptPassword(this.password));
        }
    }

    librarySongs(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserSong> {
        return this.db.librarySongs(lastId, size, keyword);
    }

    libraryAlbums(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserAlbum> {
        return this.db.libraryAlbums(lastId, size, keyword);
    }

    libraryArtists(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserArtist> {
        return this.db.libraryArtists(lastId, size, keyword);
    }

    libraryCollections(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserCollection> {
        return this.db.libraryCollections(lastId, size, keyword);
    }

    // libraryPlayLists(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserPlayList> {
    // let rows = this.db.libraryPlayLists(lastId, size, keyword);
    // let libraryPlayLists = rows.map(row => makeUserPlayList(row));
    // return libraryPlayLists;
    // }


    addUser(username: string, password: string): boolean {
        return this.db.addUser(username, password);
    }

    addSong(song: ISong): IUserSong {
        let addAt = Date.now();
        return this.db.addSong(song, addAt);
    }

    addAlbum(album: IAlbum): IUserAlbum {
        let addAt = Date.now();
        return this.db.addAlbum(album, addAt);
    }

    addArtist(artist: IArtist): IUserArtist {
        let addAt = Date.now();
        return this.db.addArtist(artist, addAt);
    }

    addCollection(collection: ICollection): IUserCollection {
        let addAt = Date.now();
        return this.db.addCollection(collection, addAt);
    }

    deleteSong(song: ISong): boolean {
        return this.db.deleteSong(song);
    }

    deleteAlbum(album: IAlbum): boolean {
        return this.db.deleteAlbum(album);
    }

    deleteArtist(artist: IArtist): boolean {
        return this.db.deleteArtist(artist);
    }

    deleteCollection(collection: ICollection): boolean {
        return this.db.deleteCollection(collection);
    }

    exists(item: ISong | IArtist | IAlbum | ICollection | IUserProfile): boolean {
        return this.db.exists(item);
    }
}


// WARN: no using defaultLibrary for production
const defaultDBPath = paths.join(CHORD_DIR, 'default-library.db');
export const defaultLibrary = new Library('default', defaultDBPath);
