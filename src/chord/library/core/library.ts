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

import { ILibrarySong } from 'chord/library/api/song';
import { ILibraryAlbum } from 'chord/library/api/album';
import { ILibraryArtist } from 'chord/library/api/artist';
import { ILibraryCollection } from 'chord/library/api/collection';
import { ILibraryUserProfile } from 'chord/library/api/userProfile';
// import { IUserPlayList } from 'chord/library/api/playList';


import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from 'chord/sound/api/radio';

import { ILibraryEpisode } from 'chord/library/api/episode';
import { ILibraryPodcast } from 'chord/library/api/podcast';
import { ILibraryRadio } from 'chord/library/api/radio';

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

    public init() {
        if (fs.existsSync(this.databasePath)) {
            this.db = new LibraryDatabase(this.databasePath);

            // create and check database table schemes
            createTables(this.db);

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

    public librarySongs(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibrarySong> {
        return this.db.librarySongs(lastId, size, keyword);
    }

    public libraryAlbums(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryAlbum> {
        return this.db.libraryAlbums(lastId, size, keyword);
    }

    public libraryArtists(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryArtist> {
        return this.db.libraryArtists(lastId, size, keyword);
    }

    public libraryCollections(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryCollection> {
        return this.db.libraryCollections(lastId, size, keyword);
    }

    public libraryUserProfiles(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryUserProfile> {
        return this.db.libraryUserProfiles(lastId, size, keyword);
    }

    // libraryPlayLists(lastId: number = 0, size: number = 20, keyword?: string): Array<IUserPlayList> {
    // let rows = this.db.libraryPlayLists(lastId, size, keyword);
    // let libraryPlayLists = rows.map(row => makeUserPlayList(row));
    // return libraryPlayLists;
    // }

    public libraryEpisodes(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryEpisode> {
        return this.db.libraryEpisodes(lastId, size, keyword);
    }

    public libraryPodcasts(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryPodcast> {
        return this.db.libraryPodcasts(lastId, size, keyword);
    }

    public libraryRadios(lastId: number = 0, size: number = 20, keyword?: string): Array<ILibraryRadio> {
        return this.db.libraryRadios(lastId, size, keyword);
    }


    public addUser(username: string, password: string): boolean {
        return this.db.addUser(username, password);
    }

    public addSong(song: ISong): ILibrarySong {
        let addAt = Date.now();
        return this.db.addSong(song, addAt);
    }

    public addAlbum(album: IAlbum): ILibraryAlbum {
        let addAt = Date.now();
        return this.db.addAlbum(album, addAt);
    }

    public addArtist(artist: IArtist): ILibraryArtist {
        let addAt = Date.now();
        return this.db.addArtist(artist, addAt);
    }

    public addCollection(collection: ICollection): ILibraryCollection {
        let addAt = Date.now();
        return this.db.addCollection(collection, addAt);
    }

    public addUserProfile(userProfile: IUserProfile): ILibraryUserProfile {
        let addAt = Date.now();
        return this.db.addUserProfile(userProfile, addAt);
    }

    public addEpisode(episode: IEpisode): ILibraryEpisode {
        let addAt = Date.now();
        return this.db.addEpisode(episode, addAt);
    }

    public addPodcast(podcast: IPodcast): ILibraryPodcast {
        let addAt = Date.now();
        return this.db.addPodcast(podcast, addAt);
    }

    public addRadio(radio: IRadio): ILibraryRadio {
        let addAt = Date.now();
        return this.db.addRadio(radio, addAt);
    }

    public deleteSong(song: ISong): boolean {
        return this.db.deleteSong(song);
    }

    public deleteAlbum(album: IAlbum): boolean {
        return this.db.deleteAlbum(album);
    }

    public deleteArtist(artist: IArtist): boolean {
        return this.db.deleteArtist(artist);
    }

    public deleteCollection(collection: ICollection): boolean {
        return this.db.deleteCollection(collection);
    }

    public deleteUserProfile(userProfile: IUserProfile): boolean {
        return this.db.deleteUserProfile(userProfile);
    }

    public deleteEpisode(episode: IEpisode): boolean {
        return this.db.deleteEpisode(episode);
    }

    public deletePodcast(podcast: IPodcast): boolean {
        return this.db.deletePodcast(podcast);
    }

    public deleteRadio(radio: IRadio): boolean {
        return this.db.deleteRadio(radio);
    }

    public exists(item: ISong | IArtist | IAlbum | ICollection | IUserProfile | IEpisode | IPodcast | IRadio): boolean {
        return this.db.exists(item);
    }
}


// WARN: no using defaultLibrary for production
const defaultDBPath = paths.join(CHORD_DIR, 'default-library.db');
export const defaultLibrary = new Library('default', defaultDBPath);
