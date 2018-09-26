'use strict';

import { getOrigin, ORIGIN } from 'chord/music/common/origin';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { AliMusicApi } from 'chord/music/xiami/api';
import { NeteaseMusicApi } from 'chord/music/netease/api';


export class Music {

    xiamiApi: AliMusicApi;
    neteaseApi: NeteaseMusicApi;


    constructor() {
        // initiate xiami api
        let xiamiApi = new AliMusicApi();
        xiamiApi.setUserId('1');
        this.xiamiApi = xiamiApi;

        // initiate netease api
        this.neteaseApi = new NeteaseMusicApi();
    }


    /**
     * audioId is Chord's audio id, not audio original id
     */
    public async audios(songId: string): Promise<Array<IAudio>> {
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.audios(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.audios(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.audio] Here will never be occured. [args]: ${songId}`);
        }
    }


    /**
     * Get many songs' audios
     */
    public async songsAudios(songIds: Array<string>): Promise<Array<Array<IAudio>>> {
        let songsOriginType = songIds.map(songId => getOrigin(songId));
        let xiamiSongIds = songsOriginType.filter(originType => originType.origin == ORIGIN.xiami).reverse().map(originType => originType.id);
        let neteaseSongIds = songsOriginType.filter(originType => originType.origin == ORIGIN.netease).reverse().map(originType => originType.id);

        let [xiamiSongsAudios, neteaseSongsAudios] = await Promise.all(
            [this.xiamiApi.songsAudios(xiamiSongIds), this.neteaseApi.songsAudios(neteaseSongIds)]);

        let songsAudios = [];
        songsOriginType.forEach(originType => {
            let audios;
            switch (originType.origin) {
                case ORIGIN.xiami:
                    audios = xiamiSongsAudios.pop();
                    songsAudios.push(audios);
                    break;
                case ORIGIN.netease:
                    audios = neteaseSongsAudios.pop();
                    songsAudios.push(audios);
                    break;
                default:
                    // Here will never be occured.
                    throw new Error(`[ERROR] [Music.songsAudios] Here will never be occured. wrong originType: ${JSON.stringify(originType)}`);
            }
        });
        return songsAudios;
    }


    /**
     * songId is Chord's song id, not song original id
     */
    public async song(songId: string): Promise<ISong> {
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.song(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.song(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.song] Here will never be occured. [args]: ${songId}`);
        }
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artist(artistId: string): Promise<IArtist> {
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.artist(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.artist(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artist] Here will never be occured. [args]: ${artistId}`);
        }
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.artistSongs(originType.id, offset + 1, limit);
            case ORIGIN.netease:
                return await this.neteaseApi.artistSongs(originType.id, offset * limit, limit);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistSongs] Here will never be occured. [args]: ${artistId}`);
        }
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.artistAlbums(originType.id, offset + 1, limit);
            case ORIGIN.netease:
                return await this.neteaseApi.artistAlbums(originType.id, offset * limit, limit);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistAlbums] Here will never be occured. [args]: ${artistId}`);
        }
    }


    /**
     * albumId is Chord's album id, not album original id
     */
    public async album(albumId: string): Promise<IAlbum> {
        let originType = getOrigin(albumId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.album(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.album(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.album] Here will never be occured. [args]: ${albumId}`);
        }
    }


    /**
     * collectionId is Chord's collection id, not collection original id
     */
    public async collection(collectionId: string): Promise<ICollection> {
        let originType = getOrigin(collectionId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                return await this.xiamiApi.collection(originType.id);
            case ORIGIN.netease:
                return await this.neteaseApi.collection(originType.id);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collection] Here will never be occured. [args]: ${collectionId}`);
        }
    }


    /**
     * xiami searching based on page
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let songs = [];
        let xiamiSongs = await this.xiamiApi.searchSongs(keyword, offset + 1, limit);
        let neteaseSongs = await this.neteaseApi.searchSongs(keyword, offset * limit, limit);

        let maxLength = Math.max(xiamiSongs.length, neteaseSongs.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiSongs[index];
            s1 ? songs.push(s1) : null;
            let s2 = neteaseSongs[index];
            s2 ? songs.push(s2) : null;
        }

        return songs;
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let songs = [];
        let xiamiArtists = await this.xiamiApi.searchArtists(keyword, offset + 1, limit);
        let neteaseArtists = await this.neteaseApi.searchArtists(keyword, offset * limit, limit);

        let maxLength = Math.max(xiamiArtists.length, neteaseArtists.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiArtists[index];
            s1 ? songs.push(s1) : null;
            let s2 = neteaseArtists[index];
            s2 ? songs.push(s2) : null;
        }

        return songs;
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let songs = [];
        let xiamiAlbums = await this.xiamiApi.searchAlbums(keyword, offset + 1, limit);
        let neteaseAlbums = await this.neteaseApi.searchAlbums(keyword, offset * limit, limit);

        let maxLength = Math.max(xiamiAlbums.length, neteaseAlbums.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiAlbums[index];
            s1 ? songs.push(s1) : null;
            let s2 = neteaseAlbums[index];
            s2 ? songs.push(s2) : null;
        }

        return songs;
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let songs = [];
        let xiamiCollections = await this.xiamiApi.searchCollections(keyword, offset + 1, limit);
        let neteaseCollections = await this.neteaseApi.searchCollections(keyword, offset * limit, limit);

        let maxLength = Math.max(xiamiCollections.length, neteaseCollections.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiCollections[index];
            s1 ? songs.push(s1) : null;
            let s2 = neteaseCollections[index];
            s2 ? songs.push(s2) : null;
        }

        return songs;
    }
}


export const musicApi = new Music();
