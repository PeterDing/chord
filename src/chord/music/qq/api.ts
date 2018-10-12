'use strict';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';

import { ESize, resizeImageUrl } from 'chord/music/common/size';

import { CookieJar } from 'chord/base/node/cookies';
import { querystringify } from 'chord/base/node/url';
import { request, IRequestOptions } from 'chord/base/node/_request';

import {
    makeSong,
    makeSongs,
    makeAlbum,
    makeAlbums,
    makeCollection,
    makeCollections,
    makeArtist,
} from 'chord/music/qq/parser';

import { AUDIO_FORMAT_MAP } from 'chord/music/qq/parser';


export class QQMusicApi {

    static readonly HEADERS = {
        'accept-encoding': 'gzip, deflate, br',
        'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7,ja;q=0.6,zh-TW;q=0.5',
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
        'accept': '*/*',
    };

    static readonly AUDIO_URI = 'http://dl.stream.qqmusic.qq.com/';

    static readonly NODE_MAP = {
        qqKey: 'https://c.y.qq.com/base/fcgi-bin/fcg_musicexpress.fcg',
        song: 'https://u.y.qq.com/cgi-bin/musicu.fcg',
        album: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_album_info_cp.fcg',

        artist: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        artistSongs: 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg',
        artistAlbums: 'https://u.y.qq.com/cgi-bin/musicu.fcg',

        collection: 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg',

        searchSongs: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        searchAlbums: 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp',
        searchCollections: 'https://c.y.qq.com/soso/fcgi-bin/client_music_search_songlist',
    };

    static cookieJar: CookieJar;


    public async request(method: string, url: string, params?: any, data?: any, referer?: string): Promise<any> {
        if (params) {
            url = url + '?' + querystringify(params);
        }

        referer = referer || 'https://y.qq.com';
        let headers = { ...QQMusicApi.HEADERS, referer };

        let options: IRequestOptions = {
            method,
            url,
            jar: QQMusicApi.cookieJar || null,
            headers: headers,
            body: data,
            gzip: true,
        };
        let json: any = await request(options);
        return JSON.parse(json);
    }


    public async qqKey(guid: string): Promise<string> {
        let params = {
            'json': 3,
            'guid': guid,
            'format': 'json',
        };
        let url = QQMusicApi.NODE_MAP.qqKey;
        let json = await this.request('GET', url, params);
        return json.key;
    }


    public makeAudios(song: ISong, qqKey: string, guid: string): Array<IAudio> {
        return song.audios.filter(audio => !!AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`])
            .map(audio => {
                audio.url = QQMusicApi.AUDIO_URI + AUDIO_FORMAT_MAP[`${audio.kbps || ''}${audio.format}`] + song.songMid + '.' + audio.format + '?vkey=' + qqKey + '&guid=' + guid + '&uin=0&fromtag=53';
                return audio;
            });
    }


    public async audios(songId: string): Promise<Array<IAudio>> {
        let guid = Math.floor(Math.random() * 1000000000).toString();
        // guid = '2095717240';
        let qqKey = await this.qqKey(guid);
        let song = await this.song(songId);
        return this.makeAudios(song, qqKey, guid);
    }


    public async songsAudios(songs: Array<ISong>): Promise<Array<Array<IAudio>>> {
        let guid = Math.floor(Math.random() * 1000000000).toString();
        let qqKey = await this.qqKey(guid);
        return songs.map(song => this.makeAudios(song, qqKey, guid));
    }


    public async song(songId: string): Promise<ISong> {
        let data = {
            "comm": {
                "g_tk": 5381,
                "uin": 0,
                "format": "json",
                "inCharset": "utf-8",
                "outCharset": "utf-8",
                "notice": 0,
                "platform": "h5",
                "needNewCode": 1
            },
            "detail": {
                "module": "music.pf_song_detail_svr",
                "method": "get_song_detail",
                "param": {
                    "song_id": parseInt(songId),
                }
            },
            // "simsongs": {
            // "module": "rcmusic.similarSongRadioServer",
            // "method": "get_simsongs",
            // "param": {
            // "songid": 307012
            // }
            // },
            // "gedan": {
            // "module": "music.mb_gedan_recommend_svr",
            // "method": "get_related_gedan",
            // "param": {
            // "sin": 0,
            // "last_id": 0,
            // "song_type": 1,
            // "song_id": 307012
            // }
            // }
        };
        let url = QQMusicApi.NODE_MAP.song;
        let json = await this.request('POST', url, null, JSON.stringify(data));
        return makeSong(json['detail']['data']);
    }


    public async album(albumId: string): Promise<IAlbum> {
        let params = {
            albumid: albumId,
            g_tk: '5381',
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5',
            needNewCode: '1',
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.album;
        let json = await this.request('GET', url, params);
        return makeAlbum(json['data']);
    }


    public async artist(artistId: string): Promise<IArtist> {
        let params = {
            singerid: artistId,
            g_tk: '5381',
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5page',
            needNewCode: '1',
            order: 'listen',
            from: 'h5',
            num: 1,
            begin: 0,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.artist;
        let json = await this.request('GET', url, params);
        return makeArtist(json['data']);
    }


    public async artistSongs(artistId: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let params = {
            singerid: artistId,
            g_tk: '5381',
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5page',
            needNewCode: '1',
            order: 'listen',
            from: 'h5',
            num: limit,
            begin: offset,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.artistSongs;
        let json = await this.request('GET', url, params);
        return makeSongs(json['data']['list'].map(info => info['musicData']));
    }


    /**
     * WARN: `artistMid`
     */
    public async artistAlbums(artistMid: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let data = JSON.stringify({
            "singerAlbum": {
                "method": "get_singer_album",
                "param": {
                    "singermid": artistMid,
                    "order": "time",
                    "begin": offset,
                    "num": limit,
                    "exstatus": 1
                },
                "module": "music.web_singer_info_svr"
            }
        });
        let params = {
            g_tk: '5381',
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
            data,
        };
        let url = QQMusicApi.NODE_MAP.artistAlbums;
        let json = await this.request('GET', url, params);
        return makeAlbums(json['singerAlbum']['data']['list']);
    }


    public async collection(collectionId: string): Promise<ICollection> {
        let params = {
            g_tk: '5381',
            uin: '0',
            format: 'json',
            inCharset: 'utf-8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'h5',
            needNewCode: '1',
            new_format: '1',
            pic: '500',
            disstid: collectionId,
            type: '1',
            json: '1',
            utf8: '1',
            onlysong: '0',
            picmid: '1',
            nosign: '1',
            song_begin: 0,
            song_num: 1000,
            '_': Date.now(),
        };
        let url = QQMusicApi.NODE_MAP.collection;
        let referer = 'https://y.qq.com/w/taoge.html?ADTAG=newyqq.taoge&id=' + collectionId;
        let json = await this.request('GET', url, params, null, referer);
        return makeCollection(json['cdlist'][0]);
    }


    public async searchSongs(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ISong>> {
        let params = {
            remoteplace: 'txt.yqq.song',
            format: 'json',
            p: offset,
            n: limit,
            w: keyword,
            aggr: 1,
            cr: 1,
            lossless: 1,
            flag_qc: 1,
            new_json: 1,
        };
        let url = QQMusicApi.NODE_MAP.searchSongs;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeSongs(json['data']['song']['list']);
    }


    public async searchAlbums(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<IAlbum>> {
        let params = {
            platform: 'yqq',
            ct: 24,
            qqmusic_ver: 1298,
            remoteplace: 'txt.yqq.album',
            format: 'json',
            p: offset,
            n: limit,
            w: keyword,
            lossless: 0,
            aggr: 0,
            sem: 10,
            t: 8,
            catZhida: 1,
        };
        let url = QQMusicApi.NODE_MAP.searchAlbums;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeAlbums(json['data']['album']['list']);
    }


    public async searchCollections(keyword: string, offset: number = 0, limit: number = 10): Promise<Array<ICollection>> {
        let params = {
            remoteplace: 'txt.yqq.playlist',
            flag_qc: '0',
            page_no: offset,
            num_per_page: limit,
            query: keyword,
            g_tk: '5381',
            loginUin: '0',
            hostUin: '0',
            format: 'json',
            inCharset: 'utf8',
            outCharset: 'utf-8',
            notice: '0',
            platform: 'yqq',
            needNewCode: '0',
        };
        let url = QQMusicApi.NODE_MAP.searchCollections;
        let json = await this.request('GET', url, params);
        if (!json['data']) { return []; }
        return makeCollections(json['data']['list']);
    }


    public resizeImageUrl(url: string, size: ESize | number): string {
        return resizeImageUrl(url, size, (url, size) => {
            if (size <= 300) {
                return url;
            } else if (size > 300 && size <= 500) {
                return url.replace('300x300', '500x500');
            } else if (size > 500 && size <= 800) {
                return url.replace('300x300', '800x800');
            } else {
                return url.replace('300x300', '800x800');
            }
        });
    }
}


export const qqMusicApi = new QQMusicApi();
