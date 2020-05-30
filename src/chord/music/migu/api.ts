'use strict';

import { Logger, LogLevel } from 'chord/platform/log/common/log';
import { filenameToNodeName } from 'chord/platform/utils/common/paths';
const loggerWarning = new Logger(filenameToNodeName(__filename), LogLevel.Warning);

import { sleep } from 'chord/base/common/time';
import { ok } from 'chord/base/common/assert';
import { querystringify } from 'chord/base/node/url';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
import { TMusicItems } from 'chord/music/api/items';

import { IAccount } from 'chord/music/api/user';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { makeCookieJar, CookieJar } from 'chord/base/node/cookies';
import { request, IRequestOptions } from 'chord/base/node/_request';

import { encrypt } from 'chord/music/migu/crypto';

import {
    makeAudios,
    makeSong,
    makeSongs,
    makeLyric,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeCollections,
    makeArtist,
    makeArtists,
    extractArtistSongIds,
    makeArtistAlbums,
    extractCollectionSongIds,
} from 'chord/music/migu/parser';


export class MiguMusicApi {

    static readonly HEADERS_AUDIO = {
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'Referer': 'http://music.migu.cn/v3/music/player/audio',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
    };

    static readonly HEADERS_h5 = {
        'Connection': 'keep-alive',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Mobile Safari/537.36',
        'Referer': 'http://m.music.migu.cn/v3',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
        'Content-Type': 'application/json; charset=utf-8',
    };

    static readonly HEADERS_WEB = {
        'Connection': 'keep-alive',
        'Accept': '*/*',
        'X-Requested-With': 'XMLHttpRequest',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.97 Safari/537.36',
        'Referer': 'http://music.migu.cn/v3/',
        'Accept-Encoding': 'gzip, deflate',
        'Accept-Language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh-TW;q=0.7,zh;q=0.6,ja;q=0.5',
    };

    static readonly BASICURL = 'http://music.migu.cn/';
    static readonly BASICURL_H5 = 'http://m.music.migu.cn/';

    static readonly NODE_MAP = {
        audio: 'v3/api/music/audioPlayer/getPlayInfo',

        song: 'v3/api/music/audioPlayer/songs',
        song_h5: 'migu/remoting/cms_detail_tag',

        album: 'migu/remoting/cms_album_detail_tag',
        albumSongs: 'v3/api/music/audioPlayer/songs',
        collection: 'migu/remoting/playlist_query_tag',
        collectionSongs: 'v3/music/playlist',  // From web

        artist: 'migu/remoting/cms_artist_detail_tag',
        artistSongs: 'v3/music/artist',  // From web
        artistAlbums: 'v3/music/artist',  // From web

        search: 'migu/remoting/scr_search_tag',
    }

    private account: IAccount;
    private cookieJar: CookieJar;


    constructor() {
        if (!this.cookieJar) {
            let cookieJar = makeCookieJar();
            // initiateCookies().forEach(cookie => {
            //     let domain = cookie.domain;
            //     cookieJar.setCookie(cookie, domain.startsWith('http') ? domain : 'http://' + domain);
            // });
            this.cookieJar = cookieJar;
        }
    }


    public async request(node: string, params: any, to_enc: boolean = false, domain?: string, to_json: boolean = true): Promise<any> {
        let url = (domain || MiguMusicApi.BASICURL) + node;

        let headers;
        switch (domain) {
            case MiguMusicApi.BASICURL_H5:
                headers = MiguMusicApi.HEADERS_h5;
                break;
            case MiguMusicApi.BASICURL:
                headers = MiguMusicApi.HEADERS_WEB;
                break;
            default:
                headers = MiguMusicApi.HEADERS_WEB;
        }
        if (node == MiguMusicApi.NODE_MAP.audio) {
            headers = MiguMusicApi.HEADERS_AUDIO;
        }

        if (to_enc) {
            let { secKey, encBuf } = encrypt(JSON.stringify(params));
            params = {
                dataType: 2,
                data: encBuf,
                secKey,
            }
        }
        if (params) {
            url = url + '?' + querystringify(params);
        }

        let options: IRequestOptions = {
            method: 'GET',
            url: url,
            jar: this.cookieJar || null,
            headers: headers,
            gzip: true,
            json: to_json,
            resolveWithFullResponse: false,
        };

        let result = await request(options);

        ok(result, `[ERROR] [MiguMusicApi.request]: url: ${url}, result is ${result}`);

        let is_ok = true;
        if (to_json) {
            is_ok = ((result['returnCode'] || result['code']) == '000000') || !!result['data'] || !!result['result'] || !!result['success'];
        }
        if (!is_ok) {
            loggerWarning.warning(`[ERROR] [MiguMusicApi.request]: url: ${url}, result is ${JSON.stringify(result)}`);

            let message = result['msg'];
            throw new Error(message);
        }
        return result;
    }


    // flac: type = 3
    // 320kbps: type = 2
    // 40kbps: type = 1
    public async audios(songId: string, supKbps?: number): Promise<Array<IAudio>> {
        let audios = [];
        while (true) {
            let tp = 2;
            if (supKbps > 320) {
                tp = 3;
            }
            let node = MiguMusicApi.NODE_MAP.audio;
            let params = {
                copyrightId: songId,
                auditionsFlag: 0,
                type: tp,
            };
            let json = await this.request(node, params, true);
            audios = makeAudios(json['data']);

            // if the audio is not flac, changing to 320kbps
            if (audios.length > 0 && tp == 3) {
                if (audios[0].kbps < 320) {
                    supKbps = 320;
                    continue;
                }
            }
            break;
        }
        return audios;
    }


    // WARN: songId is a copyrightId of migu music
    public async song(songId: string): Promise<ISong> {
        let node = MiguMusicApi.NODE_MAP.song_h5;
        let params: any = {
            cpid: songId,
            // or cpid: songMid
            // cid、cpid和pid至少填写一个
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let song = makeSong(json.data);

        // Get album info
        node = MiguMusicApi.NODE_MAP.song;
        params = {
            type: 1,
            copyrightId: songId,
        };
        json = await this.request(node, params);
        let song_ = makeSong(json.items && json.items[0]);

        song.duration = song_.duration;

        song.albumId = song_.albumId;
        song.albumOriginalId = song_.albumOriginalId;
        song.albumName = song_.albumName;

        song.artistId = song_.artistId;
        song.artistOriginalId = song_.artistOriginalId;
        song.artistName = song_.artistName;

        return song;
    }


    public async songs(songIds: Array<string>): Promise<Array<ISong>> {
        // Get album info
        let node = MiguMusicApi.NODE_MAP.song;
        let params = {
            type: 1,
            copyrightId: songIds.join(','),
        };
        let json = await this.request(node, params);
        return makeSongs(json.items);
    }


    public async lyric(songId: string): Promise<ILyric> {
        let node = MiguMusicApi.NODE_MAP.song_h5;
        let params = {
            cpid: songId,
            // or cpid: songMid
            // cid、cpid和pid至少填写一个
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);

        let lyricInfo = json.data.lyricLrc;
        let transInfo = null;
        return makeLyric(songId, lyricInfo, transInfo);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let node = MiguMusicApi.NODE_MAP.album;
        let params: any = {
            albumId,
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let album = makeAlbum(json.data);

        node = MiguMusicApi.NODE_MAP.albumSongs;
        params = {
            albumId,
            type: 2,
        };
        json = await this.request(node, params, false);
        let songs = makeSongs(json.items).map(song => {
            song.albumCoverUrl = album.albumCoverUrl;
            return song;
        });
        if (songs.length > 0) {
            let song = songs[0];
            album.artistOriginalId = song.artistOriginalId;
            album.artistId = song.artistId;
            album.artistName = song.artistName;
        }
        album.songs = songs;

        return album;
    }


    public async artist(artistId: string): Promise<IArtist> {
        let node = MiguMusicApi.NODE_MAP.artist;
        let params = {
            artistId,
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        return makeArtist(json.data);
    }


    /**
     * There gets an artist's top 50 songs
     * It can't be more
     */
    public async artistSongs(artistId: string, page: number = 1, size: number = 20): Promise<Array<ISong>> {
        let node = MiguMusicApi.NODE_MAP.artistSongs + '/' + artistId + '/song';
        let params = {
            page,
        };
        let html = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
        let songIds = extractArtistSongIds(html);
        return this.songs(songIds);
    }


    public async artistAlbums(artistId: string, page: number = 1, size: number = 30): Promise<Array<IAlbum>> {
        let node = MiguMusicApi.NODE_MAP.artistAlbums + '/' + artistId + '/album';
        let params = {
            page,
        };
        let html = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
        return makeArtistAlbums(html);
    }


    public async collection(collectionId: string, size: number = 10000): Promise<ICollection> {
        let node = MiguMusicApi.NODE_MAP.collection;
        let params: any = {
            onLine: 1,
            queryChannel: 0,
            createUserId: '221acca8-9179-4ba7-ac3f-2b0fdffed356',
            contentCountMin: 5,
            playListId: collectionId,
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        let collection = makeCollection(json.playlist[0]);

        let pages = Math.ceil(collection.songCount / 20);

        let songs = [];
        for (let page of [...Array(pages).keys()]) {
            while (true) {
                let node = MiguMusicApi.NODE_MAP.collectionSongs + '/' + collectionId;
                let params = {
                    page: page + 1,
                };

                let html;
                try {
                    html = await this.request(node, params, false, MiguMusicApi.BASICURL, false);
                } catch (e) {
                    await sleep(1);
                    continue;
                }

                let songIds = extractCollectionSongIds(html);

                let songs_;
                try {
                    songs_ = await this.songs(songIds);
                } catch (e) {
                    await sleep(1);
                    continue;
                }

                songs = [...songs, ...songs_];
                break;
            }
        };

        collection.songs = songs;
        return collection;
    }


    /**
     * Search
     *
     * data params:
     * @type:
     * 2: song
     * 1: artist
     * 4: album
     * 5: mv
     * 6: collection
     */
    public async search(type: number, keyword: string, page: number = 1, size: number = 10): Promise<any> {
        let node = MiguMusicApi.NODE_MAP.search;
        let params: any = {
            rows: size,
            type,
            keyword,
            pgc: page,
        };
        let json = await this.request(node, params, false, MiguMusicApi.BASICURL_H5);
        return json;
    }


    /**
     * Search songs
     *
     * type = 2
     */
    public async searchSongs(keyword: string, page: number = 1, size: number = 10): Promise<Array<ISong>> {
        let json = await this.search(2, keyword, page, size);
        if (!json['musics']) { return []; }
        return makeSongs(json['musics'] || []);
    }


    /**
     * Search albums
     * type = 4
     */
    public async searchAlbums(keyword: string, page: number = 1, size: number = 10): Promise<Array<IAlbum>> {
        let json = await this.search(4, keyword, page, size);
        if (!json['albums']) { return []; }
        return makeAlbums(json['albums'] || []);
    }


    /**
     * Search artists
     *
     * type = 1
     */
    public async searchArtists(keyword: string, page: number = 1, size: number = 10): Promise<Array<IArtist>> {
        let json = await this.search(1, keyword, page, size);
        if (!json['artists']) { return []; }
        return makeArtists(json['artists'] || []);
    }


    /**
     * Search collections
     * type = 6
     */
    public async searchCollections(keyword: string, page: number = 1, size: number = 10): Promise<Array<ICollection>> {
        let json = await this.search(6, keyword, page, size);
        if (!json['songLists']) { return []; }
        return makeCollections(json['songLists'] || []);
    }


    public async playLog(songId: string, seek: number): Promise<boolean> {
        return false;
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => `${url}?${size}x${size}`);
    }


    public async fromURL(input: string): Promise<Array<TMusicItems>> {
        let chunks = input.split(' ');
        let items = [];
        for (let chunk of chunks) {
            let m;
            let originId;
            let type;

            let matchList = [
                // song
                [/song\/([\da-zA-Z]+)/, 'song'],

                // artist
                [/artist\/(\d+)/, 'artist'],

                // album
                [/album\/(\d+)/, 'album'],

                // playlist
                [/playlist\/(\d+)/, 'collection'],
            ];
            for (let [re, tp] of matchList) {
                m = (re as RegExp).exec(chunk);
                if (m) {
                    originId = m[1];
                    type = tp;
                    break;
                }
            }

            if (originId) {
                let item;
                switch (type) {
                    case 'song':
                        item = await this.song(originId);
                        items.push(item);
                        break;
                    case 'artist':
                        item = await this.artist(originId);
                        items.push(item);
                        break;
                    case 'album':
                        item = await this.album(originId);
                        items.push(item);
                        break;
                    case 'collection':
                        item = await this.collection(originId);
                        items.push(item);
                        break;
                    default:
                        break;
                }
            }
        }

        return items;
    }
}

