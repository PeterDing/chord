'use strict';

import { getOrigin, ORIGIN } from 'chord/music/common/origin';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { IListOption } from 'chord/music/api/listOption';
import { TMusicItems } from 'chord/music/api/items';

import { IUserProfile, IAccount } from 'chord/music/api/user';

import { ESize } from 'chord/music/common/size';

import { AliMusicApi } from 'chord/music/xiami/api';
import { NeteaseMusicApi } from 'chord/music/netease/api';
import { QQMusicApi } from 'chord/music/qq/api';

import { userConfiguration } from 'chord/preference/configuration/user';

import { makeItem, makeItems } from 'chord/music/core/parser';


export class Music {

    xiamiApi: AliMusicApi;
    neteaseApi: NeteaseMusicApi;
    qqApi: QQMusicApi;


    constructor() {
        // initiate xiami api
        let xiamiApi = new AliMusicApi();
        xiamiApi.setUserId('1');
        this.xiamiApi = xiamiApi;

        // initiate netease api
        this.neteaseApi = new NeteaseMusicApi();

        // initiate qq api
        this.qqApi = new QQMusicApi();

        // set user configuration
        let userConfig = userConfiguration.getConfig();
        this.setAccount(userConfig.xiami && userConfig.xiami.account);
        this.setAccount(userConfig.netease && userConfig.netease.account);
        this.setAccount(userConfig.qq && userConfig.qq.account);
    }


    /**
     * Clean one music api
     */
    public clean(origin: string): void {
        switch (origin) {
            case ORIGIN.xiami:
                this.xiamiApi = new AliMusicApi();
                this.xiamiApi.setUserId('1');
                break;
            case ORIGIN.netease:
                this.neteaseApi = new NeteaseMusicApi();
                break;
            case ORIGIN.qq:
                this.qqApi = new QQMusicApi();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.clean] Here will never be occured. [args]: ${origin}`);
        }
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
            case ORIGIN.qq:
                return await this.qqApi.audios(originType.id);
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

        let [xiamiSongsAudios, neteaseSongsAudios] = await Promise.all([
            this.xiamiApi.songsAudios(xiamiSongIds),
            this.neteaseApi.songsAudios(neteaseSongIds)
        ]);

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
        let song;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                song = await this.xiamiApi.song(originType.id);
                break;
            case ORIGIN.netease:
                song = await this.neteaseApi.song(originType.id);
                break;
            case ORIGIN.qq:
                song = await this.qqApi.song(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.song] Here will never be occured. [args]: ${songId}`);
        }
        song = makeItem(song);
        return song;
    }


    public async lyric(songId: string, song?: ISong): Promise<ILyric> {
        let lyric;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                lyric = await this.xiamiApi.lyric(originType.id, song);
                break;
            case ORIGIN.netease:
                lyric = await this.neteaseApi.lyric(originType.id);
                break;
            case ORIGIN.qq:
                lyric = await this.qqApi.lyric(originType.id, song.songMid);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.lyric] Here will never be occured. [args]: ${songId}`);
        }
        return lyric;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artist(artistId: string): Promise<IArtist> {
        let artist;
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                artist = await this.xiamiApi.artist(originType.id);
                break;
            case ORIGIN.netease:
                artist = await this.neteaseApi.artist(originType.id);
                break;
            case ORIGIN.qq:
                artist = await this.qqApi.artist(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artist] Here will never be occured. [args]: ${artistId}`);
        }
        artist = makeItem(artist);
        return artist;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let songs = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                songs = await this.xiamiApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                songs = await this.neteaseApi.artistSongs(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                songs = await this.qqApi.artistSongs(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistSongs] Here will never be occured. [args]: ${artistId}`);
        }
        songs = makeItems(songs);
        return songs;
    }


    /**
     * artistId is Chord's artist id, not artist original id
     */
    public async artistAlbums(artistId: string, offset: number = 0, limit: number = 10, artistMid?: string): Promise<Array<IAlbum>> {
        let albums = [];
        let originType = getOrigin(artistId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                albums = await this.xiamiApi.artistAlbums(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                albums = await this.neteaseApi.artistAlbums(originType.id, offset, limit);
                break;
            // there needs qq's mid
            case ORIGIN.qq:
                albums = await this.qqApi.artistAlbums(artistMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistAlbums] Here will never be occured. [args]: ${artistId}`);
        }
        albums = makeItems(albums);
        return albums;
    }


    /**
     * albumId is Chord's album id, not album original id
     */
    public async album(albumId: string): Promise<IAlbum> {
        let album;
        let originType = getOrigin(albumId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                album = await this.xiamiApi.album(originType.id);
                break;
            case ORIGIN.netease:
                album = await this.neteaseApi.album(originType.id);
                break;
            case ORIGIN.qq:
                album = await this.qqApi.album(originType.id);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.album] Here will never be occured. [args]: ${albumId}`);
        }
        album = makeItem(album);
        return album;
    }


    /**
     * collectionId is Chord's collection id, not collection original id
     */
    public async collection(collectionId: string, offset: number = 0, limit: number = 1000): Promise<ICollection> {
        let collection;
        let originType = getOrigin(collectionId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                collection = await this.xiamiApi.collection(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                collection = await this.neteaseApi.collection(originType.id);
                break;
            case ORIGIN.qq:
                collection = await this.qqApi.collection(originType.id, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collection] Here will never be occured. [args]: ${collectionId}`);
        }
        collection = makeItem(collection);
        return collection;
    }


    /**
     * xiami searching based on page
     */
    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let items = [];
        let [xiamiSongs, neteaseSongs, qqSongs] = await Promise.all([
            this.xiamiApi.searchSongs(keyword, offset + 1, limit),
            this.neteaseApi.searchSongs(keyword, offset * limit, limit),
            this.qqApi.searchSongs(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiSongs.length, neteaseSongs.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiSongs[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseSongs[index];
            s2 ? items.push(s2) : null;
            let s3 = qqSongs[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchArtists(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IArtist>> {
        let items = [];
        let [xiamiArtists, neteaseArtists] = await Promise.all([
            this.xiamiApi.searchArtists(keyword, offset + 1, limit),
            this.neteaseApi.searchArtists(keyword, offset * limit, limit),
        ]);
        // qq doesn't support to search artist

        let maxLength = Math.max(xiamiArtists.length, neteaseArtists.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiArtists[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseArtists[index];
            s2 ? items.push(s2) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let items = [];
        let [xiamiAlbums, neteaseAlbums, qqAlbums] = await Promise.all([
            this.xiamiApi.searchAlbums(keyword, offset + 1, limit),
            this.neteaseApi.searchAlbums(keyword, offset * limit, limit),
            this.qqApi.searchAlbums(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiAlbums.length, neteaseAlbums.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiAlbums[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseAlbums[index];
            s2 ? items.push(s2) : null;
            let s3 = qqAlbums[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let items = [];
        let [xiamiCollections, neteaseCollections, qqCollections] = await Promise.all([
            this.xiamiApi.searchCollections(keyword, offset + 1, limit),
            this.neteaseApi.searchCollections(keyword, offset * limit, limit),
            this.qqApi.searchCollections(keyword, offset * limit, limit),
        ]);

        let maxLength = Math.max(xiamiCollections.length, neteaseCollections.length);
        for (let index = 0; index < maxLength; index++) {
            let s1 = xiamiCollections[index];
            s1 ? items.push(s1) : null;
            let s2 = neteaseCollections[index];
            s2 ? items.push(s2) : null;
            let s3 = qqCollections[index];
            s3 ? items.push(s3) : null;
        }

        items = makeItems(items);
        return items;
    }


    public async albumListOptions(origin: string): Promise<Array<IListOption>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.albumListOptions();
                break;
            case ORIGIN.netease:
                items = [];
                break;
            case ORIGIN.qq:
                items = await this.qqApi.albumListOptions();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.albumListOptions] Here will never be occured. [args]: ${origin}`);
        }

        return items;
    }


    public async albumList(
        origin: string,
        order: string,
        area: string,
        genre: string,
        type: string,
        year: string,
        company: string,
        offset: number = 0,
        limit: number = 10): Promise<Array<IAlbum>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.albumList(
                    Number.parseInt(order),
                    Number.parseInt(area),
                    Number.parseInt(genre),
                    Number.parseInt(year),
                    Number.parseInt(type),
                    offset,
                    limit);
                break;
            case ORIGIN.netease:
                items = [];
                break;
            case ORIGIN.qq:
                items = await this.qqApi.albumList(
                    Number.parseInt(order),
                    Number.parseInt(area),
                    Number.parseInt(genre),
                    Number.parseInt(type),
                    Number.parseInt(year),
                    Number.parseInt(company),
                    offset,
                    limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.albumList] Here will never be occured. [args]: ${origin}, ${order}, ${area}, ${genre}, ${type}, ${year}, ${company}, ${offset}, ${limit}`);
        }

        items = makeItems(items);
        return items;
    }


    public collectionListOrders(origin: string): Array<{ name: string, id: string }> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = this.xiamiApi.collectionListOrders();
                break;
            case ORIGIN.netease:
                items = this.neteaseApi.collectionListOrders();
                break;
            case ORIGIN.qq:
                items = this.qqApi.collectionListOrders();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionListOrders] Here will never be occured. [args]: ${origin}`);
        }

        return items;
    }


    public async collectionListOptions(origin: string): Promise<Array<IListOption>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.collectionListOptions();
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.collectionListOptions();
                break;
            case ORIGIN.qq:
                items = await this.qqApi.collectionListOptions();
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionListOptions] Here will never be occured. [args]: ${origin}`);
        }

        return items;
    }


    public async collectionList(
        origin: string,
        keyword: string,
        order: string,
        offset: number = 0,
        limit: number = 10): Promise<Array<ICollection>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.collectionList(keyword, order, offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.collectionList(keyword, order, offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.collectionList(order, keyword, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.collectionList] Here will never be occured. [args]: ${origin}, ${keyword}, ${order}, ${offset}, ${limit}`);
        }

        items = makeItems(items);
        return items;
    }


    public async artistList(
        origin: string,
        area: string,
        genre: string,
        gender: string,
        index: string,
        offset: number = 0,
        limit: number = 40): Promise<any> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.artistList(area, genre, gender, offset, limit);
                items[0] = makeItems(items[0]);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.artistList(genre, index, offset, limit);
                items = makeItems(items);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.artistList(area, genre, gender, index, offset, limit);
                items = makeItems(items);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.artistList] Here will never be occured. [args]: ${origin}, ${area}, ${genre}, ${gender}, ${index}, ${offset}, ${limit}`);
        }

        return items;
    }


    public async newSongs(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.newSongs(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newSongs(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newSongs(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newSongs] Here will never be occured. [args]: ${origin}`);
        }

        items = makeItems(items);
        return items;
    }


    public async newAlbums(origin: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.newAlbums(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newAlbums(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newAlbums(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newAlbums] Here will never be occured. [args]: ${origin}`);
        }

        items = makeItems(items);
        return items;
    }


    public async newCollections(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let items;
        switch (origin) {
            case ORIGIN.xiami:
                items = await this.xiamiApi.newCollections(offset, limit);
                break;
            case ORIGIN.netease:
                items = await this.neteaseApi.newCollections(offset, limit);
                break;
            case ORIGIN.qq:
                items = await this.qqApi.newCollections(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.newCollections] Here will never be occured. [args]: ${origin}`);
        }

        items = makeItems(items);
        return items;
    }


    public async login(origin: string, accountName: string, password: string): Promise<IAccount> {
        let account: IAccount;
        switch (origin) {
            case ORIGIN.xiami:
                account = await this.xiamiApi.login(accountName, password);
                this.xiamiApi.setAccount(account);
                break;
            case ORIGIN.netease:
                account = await this.neteaseApi.login(accountName, password);
                this.neteaseApi.setAccount(account);
                break;
            case ORIGIN.qq:
                account = await this.qqApi.login();
                this.qqApi.setAccount(account);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${origin}, ${accountName}`);
        }
        return account;
    }


    /**
     * Check whether logined
     */
    public logined(origin: string): boolean {
        switch (origin) {
            case ORIGIN.xiami:
                return this.xiamiApi.logined();
            case ORIGIN.netease:
                return this.neteaseApi.logined();
            case ORIGIN.qq:
                return this.qqApi.logined();
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.logined] Here will never be occured. [args]: ${origin}`);
        }
    }


    public setAccount(account: IAccount): void {
        if (!account) { return; }

        let origin = account.user.origin;
        switch (origin) {
            case ORIGIN.xiami:
                this.xiamiApi.setAccount(account);
                break;
            case ORIGIN.netease:
                this.neteaseApi.setAccount(account);
                break;
            case ORIGIN.qq:
                this.qqApi.setAccount(account);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${origin}, ${account}`);
        }
    }


    /**
     * here, the userId is IUserProfile.userId
     */
    public async userProfile(userId: string, userMid?: string): Promise<IUserProfile> {
        let userProfile;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                userProfile = await this.xiamiApi.userProfile(originType.id);
                break;
            case ORIGIN.netease:
                userProfile = await this.neteaseApi.userProfile(originType.id);
                break;
            case ORIGIN.qq:
                userProfile = await this.qqApi.userProfile(userId && userMid);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.login] Here will never be occured. [args]: ${userId}`);
        }
        // TODO: return makeItem(userProfile);
        return userProfile;
    }


    /**
     * here, the userId is IUserProfile.userId
     */
    public async userFavoriteSongs(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ISong>> {
        let songs;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                songs = await this.xiamiApi.userFavoriteSongs(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                songs = await this.neteaseApi.userFavoriteSongs(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                songs = await this.qqApi.userFavoriteSongs(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteSongs] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(songs);
    }


    public async userFavoriteAlbums(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IAlbum>> {
        let albums;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                albums = await this.xiamiApi.userFavoriteAlbums(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                albums = [];
                break;
            case ORIGIN.qq:
                albums = await this.qqApi.userFavoriteAlbums(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteAlbums] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(albums);
    }


    public async userFavoriteArtists(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IArtist>> {
        let artists;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                artists = await this.xiamiApi.userFavoriteArtists(originType.id, offset, limit);
                break;
            case ORIGIN.netease:
                artists = await this.neteaseApi.userFavoriteArtists(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                artists = await this.qqApi.userFavoriteArtists(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteArtists] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(artists);
    }


    public async userFavoriteCollections(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ICollection>> {
        let collections;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                collections = await this.xiamiApi.userFavoriteCollections(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                collections = await this.neteaseApi.userFavoriteCollections(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                collections = await this.qqApi.userFavoriteCollections(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFavoriteCollections] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(collections);
    }


    public async userCreatedCollections(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<ICollection>> {
        let collections;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                collections = await this.xiamiApi.userCreatedCollections(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                collections = [];
                break;
            case ORIGIN.qq:
                collections = await this.qqApi.userCreatedCollections(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userCreatedCollections] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(collections);
    }


    public async userFollowings(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IUserProfile>> {
        let userProfiles;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                userProfiles = await this.xiamiApi.userFollowings(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                userProfiles = await this.neteaseApi.userFollowings(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                userProfiles = await this.qqApi.userFollowings(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFollowings] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(userProfiles);
    }


    public async userFollowers(userId: string, offset: number = 0, limit: number = 10, userMid?: string): Promise<Array<IUserProfile>> {
        let userProfiles;
        let originType = getOrigin(userId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                userProfiles = await this.xiamiApi.userFollowers(originType.id, offset, limit);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                userProfiles = await this.neteaseApi.userFollowers(originType.id, offset, limit);
                break;
            case ORIGIN.qq:
                userProfiles = await this.qqApi.userFollowers(userMid, offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userFollowers] Here will never be occured. [args]: ${userId}`);
        }
        return makeItems(userProfiles);
    }


    protected async userLikeOrDislike(funcName: string, itemId: string, itemMid?: string): Promise<boolean> {
        let result;
        let originType = getOrigin(itemId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                result = await this.xiamiApi[funcName](originType.id, itemMid);
                break;
            // netease only give favorite collections
            case ORIGIN.netease:
                result = await this.neteaseApi[funcName](originType.id, itemMid);
                break;
            case ORIGIN.qq:
                result = await this.qqApi[funcName](originType.id, itemMid);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.userLikeOrDislike] Here will never be occured. [args]: ${funcName} ${itemId}`);
        }
        return result;
    }


    public async userLikeSong(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeSong', itemId, itemMid);
    }


    public async userLikeArtist(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeArtist', itemId, itemMid);
    }


    public async userLikeAlbum(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeAlbum', itemId, itemMid);
    }


    public async userLikeCollection(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeCollection', itemId, itemMid);
    }


    public async userLikeUserProfile(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userLikeUserProfile', itemId, itemMid);
    }


    public async userDislikeSong(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeSong', itemId, itemMid);
    }


    public async userDislikeArtist(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeArtist', itemId, itemMid);
    }


    public async userDislikeAlbum(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeAlbum', itemId, itemMid);
    }


    public async userDislikeCollection(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeCollection', itemId, itemMid);
    }


    public async userDislikeUserProfile(itemId: string, itemMid?: string): Promise<boolean> {
        return this.userLikeOrDislike('userDislikeUserProfile', itemId, itemMid);
    }


    public async playLog(songId: string, seek: number, songMid?: string): Promise<boolean> {
        let result;
        let originType = getOrigin(songId);
        switch (originType.origin) {
            case ORIGIN.xiami:
                result = await this.xiamiApi.playLog(originType.id, seek);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.playLog(originType.id, seek);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.playLog(originType.id, seek, songMid);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.playLog] Here will never be occured. [args]: ${songId} ${seek}`);
        }
        return result;
    }


    public async recommendSongs(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let result;
        switch (origin) {
            case ORIGIN.xiami:
                result = await this.xiamiApi.recommendSongs(offset, limit);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.recommendSongs(offset, limit);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.recommendSongs(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.recommendSongs] Here will never be occured. [args]: ${origin}`);
        }
        return result;
    }


    public async recommendCollections(origin: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let result;
        switch (origin) {
            case ORIGIN.xiami:
                result = await this.xiamiApi.recommendCollections(offset, limit);
                break;
            case ORIGIN.netease:
                result = await this.neteaseApi.recommendCollections(offset, limit);
                break;
            case ORIGIN.qq:
                result = await this.qqApi.recommendCollections(offset, limit);
                break;
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.recommendCollections] Here will never be occured. [args]: ${origin}`);
        }
        return result;
    }


    public resizeImageUrl(origin: string, url: string, size: ESize | number): string {
        if (!url) { return url; }
        switch (origin) {
            case ORIGIN.xiami:
                return this.xiamiApi.resizeImageUrl(url, size);
            case ORIGIN.netease:
                return this.neteaseApi.resizeImageUrl(url, size);
            case ORIGIN.qq:
                return this.qqApi.resizeImageUrl(url, size);
            default:
                // Here will never be occured.
                throw new Error(`[ERROR] [Music.resizeImageUrl] Here will never be occured. [args]: ${url}`);
        }
    }


    /**
     * Get music items directly from urls
     */
    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let futs = [];
        let chunks = input.split(' ');
        for (let chunk of chunks) {
            if (chunk.includes('xiami')) {
                futs.push(this.xiamiApi.fromURL(chunk));
            } else if (input.includes('163.com')) {
                futs.push(this.neteaseApi.fromURL(chunk));
            } else if (input.includes('qq.com')) {
                futs.push(this.qqApi.fromURL(chunk));
            }
        }
        if (futs.length == 0) return [];
        let list = await Promise.all(futs);
        return makeItems([].concat(...list));
    }
}


export const musicApi = new Music();
