'use strict';

import { decodeHtml } from 'chord/base/browser/htmlContent';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
// import { IGenre } from "chord/music/api/genre";
import { ITag } from "chord/music/api/tag";

import {
    getSongUrl,
    getAlbumUrl,
    getArtistUrl,
    getCollectionUrl,
    getSongId,
    getAlbumId,
    getArtistId,
    getCollectionId
} from "chord/music/common/origin";

const _origin = 'qq';

const _getSongUrl: (id: string) => string = getSongUrl.bind(null, _origin);
const _getSongId: (id: string) => string = getSongId.bind(null, _origin);
const _getAlbumUrl: (id: string) => string = getAlbumUrl.bind(null, _origin);
const _getAlbumId: (id: string) => string = getAlbumId.bind(null, _origin);
const _getArtistUrl: (id: string) => string = getArtistUrl.bind(null, _origin);
const _getArtistId: (id: string) => string = getArtistId.bind(null, _origin);
const _getCollectionUrl: (id: string) => string = getCollectionUrl.bind(null, _origin);
const _getCollectionId: (id: string) => string = getCollectionId.bind(null, _origin);


export const AUDIO_FORMAT_MAP = {
    '128mp3': 'M500',
    '320mp3': 'M800',
    'ape': 'A000',
    'flac': 'F000',
};

export const KBPS_MAP = {
    '128': 128,
    '320': 320,
    '128mp3': 128,
    '320mp3': 320,
    'ape': null,
    'flac': null,
}

export const FORMAT_MAP = {
    '128': 'mp3',
    '320': 'mp3',
    '128mp3': 'mp3',
    '320mp3': 'mp3',
    'ape': 'ape',
    'flac': 'flac',
}


function getQQAlbumCoverUrl(mid: string): string {
    return 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + mid + '.jpg?max_age=2592000';
}

function getQQArtistAvatarUrl(mid: string): string {
    return 'http://y.gtimg.cn/music/photo_new/T001R300x300M000' + mid + '.jpg?max_age=2592000';
}

function makeAudios(info: any): Array<IAudio> {
    return Object.keys(info)
        .filter(key => FORMAT_MAP[key.replace(/size_?/, '')] && key.startsWith('size') && info[key])
        .map(key => {
            let chunk = key.replace(/size_?/, '');
            let format = FORMAT_MAP[chunk];
            let kbps = KBPS_MAP[chunk];
            let size: number = info[key];

            let audio: IAudio = {
                format,
                kbps,
                size,
            };
            return audio;
        })
        .sort((x, y) => y.size - x.size);
}


export function makeSong(info: any): ISong {
    let songInfo = info['track_info'] || info;
    let otherInfo = info['info'] || [];

    let songOriginalId = (songInfo['id'] || songInfo['songid']).toString();
    let songMid = songInfo['mid'] || songInfo['songmid'];
    let songMediaMid = songInfo['strMediaMid'] || (songInfo['file'] ? songInfo['file']['media_mid'] : songMid);
    let songName = songInfo['name'] || songInfo['songname'];
    songName = decodeHtml(songName);

    let albumOriginalId = songInfo['album'] ? songInfo['album']['id'].toString() : songInfo['albumid'].toString();
    let albumMid = songInfo['album'] ? songInfo['album']['mid'] : songInfo['albummid'];
    let albumName = songInfo['album'] ? songInfo['album']['name'] : songInfo['albumname'];
    albumName = decodeHtml(albumName);
    let albumCoverUrl = getQQAlbumCoverUrl(albumMid);

    let artistOriginalId = songInfo['singer'][0]['id'].toString();
    let artistMid = songInfo['singer'][0]['mid'];
    let artistName = songInfo['singer'][0]['name'];
    artistName = decodeHtml(artistName);
    let artistAvatarUrl = getQQArtistAvatarUrl(artistMid);

    let track = songInfo['index_album'] || songInfo['belongCD'];
    let cdSerial = (songInfo['index_cd'] || songInfo['cdIdx']) + 1;

    let songWriters = [];
    let songWritersInfo = otherInfo.filter(_info => _info['作词'] == 'title' && _info['content'][0])[0];
    if (songWritersInfo) {
        songWriters = songWritersInfo['content'].map(_info => _info['value']);
    }

    let singers = [];
    let singersInfo = otherInfo.filter(_info => _info['title'] == '演唱者' && _info['content'][0])[0];
    if (singersInfo) {
        singers = singersInfo['content'].map(_info => _info['value']);
    }

    let composer = '';
    let composerInfo = otherInfo.filter(_info => _info['title'] == '作曲' && _info['content'][0])[0];
    if (composerInfo) {
        composer = composerInfo['content'][0]['value'];
    }

    let genres = [];
    let genresInfo = otherInfo.filter(_info => _info['title'] == '歌曲流派' && _info['content'][0])[0];
    if (genresInfo) {
        genres = genresInfo['content'].map(_info => {
            return {
                id: _info['id'].toString(),
                name: _info['value'],
            };
        });
    }

    let audios = makeAudios(songInfo['file'] || songInfo);

    let song: ISong = {
        songId: _getSongId(songOriginalId),

        type: 'song',
        origin: _origin,

        songOriginalId,
        songMid,
        songMediaMid,

        url: _getSongUrl(songMid),

        songName,
        subTitle: songInfo['subtitle'] || '',

        songWriters,
        singers,

        albumId: _getAlbumId(albumOriginalId),
        albumOriginalId,
        albumMid,
        albumName,
        albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistMid,
        artistName,
        artistAvatarUrl,

        composer,

        track,
        cdSerial,

        genres,

        // millisecond
        duration: songInfo['interval'] * 1000,

        releaseDate: Date.parse(songInfo['time_public']) || 0,

        playCount: 0,

        audios,
    };
    return song;
}


export function makeSongs(info: any): Array<ISong> {
    return info.map(songInfo => makeSong(songInfo));
}


export function makeAlbum(info: any): IAlbum {
    let albumOriginalId = (info['id'] || info['albumid'] || info['albumID']).toString();
    let albumMid = info['mid'] || info['album_mid'] || info['albumMID'];
    let albumName = info['name'] || info['album_name'] || info['albumName'];
    albumName = decodeHtml(albumName);
    let albumCoverUrl = getQQAlbumCoverUrl(albumMid);

    let artistOriginalId = (info['singerid'] || info['singer_id'] || info['singerID']).toString();
    let artistMid = info['singermid'] || info['singer_mid'] || info['singerMID'];
    let artistName = info['singername'] || info['singer_name'] || info['singerName'];
    artistName = decodeHtml(artistName);

    let tags: Array<ITag> = info['genre'] ? [{ id: null, name: info['genre'] }] : [];

    let releaseDate = Date.parse(info['aDate'] || info['pub_time'] || info['publicTime']);

    let songs: Array<ISong> = (info['list'] || []).map(song => makeSong(song));

    let album: IAlbum = {
        albumId: _getAlbumId(albumOriginalId),

        type: 'album',
        origin: _origin,
        albumOriginalId: albumOriginalId,
        albumMid,
        url: _getAlbumUrl(albumMid),

        albumName,
        albumCoverUrl: albumCoverUrl,

        artistId: _getArtistId(artistOriginalId),
        artistOriginalId,
        artistMid,
        artistName,

        tags,

        description: info['desc'] || null,

        releaseDate,

        company: info['company'] || null,

        songs: songs,
        songCount: info['total_song_num'] || info['song_count'],
    };
    return album;
}


export function makeAlbums(info: any): Array<IAlbum> {
    return info.map(albumInfo => makeAlbum(albumInfo));
}


export function makeArtist(info: any): IArtist {
    let artistOriginalId = info['singer_id'].toString();
    let artistMid = info['singer_mid'];
    let artistName = info['singer_name'];
    artistName = decodeHtml(artistName);
    let artistAvatarUrl = getQQArtistAvatarUrl(artistMid);

    let artist: IArtist = {
        artistId: _getArtistId(artistOriginalId),
        type: 'artist',
        origin: _origin,
        artistOriginalId: artistOriginalId,
        artistMid,
        url: _getArtistUrl(artistMid),

        artistName,

        artistAvatarUrl: artistAvatarUrl,

        description: info['SingerDesc'],

        songs: [],
        albums: [],
    };
    return artist;
}


export function makeCollection(info: any): ICollection {
    let collectionOriginalId = (info['disstid'] || info['dissid']).toString();
    let collectionCoverUrl = info['logo'] || info['imgurl'];
    let collectionName = info['dissname'];
    collectionName = decodeHtml(collectionName);

    let tags: Array<ITag> = (info['tags'] || []).map(tag => ({ id: tag['id'].toString(), name: tag['name'] }));
    let songs: Array<ISong> = (info['songlist'] || []).map(songInfo => makeSong(songInfo));
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let userName = info['nickname'] || info['creator']['name'];
    userName = decodeHtml(userName);

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName,

        collectionCoverUrl,

        userName,

        // millisecond
        releaseDate: info['ctime'] * 1000 || Date.parse(info['createtime']),

        description: info['desc'] || info['introduction'],

        tags,

        duration,

        songs,
        songCount: info['total_song_num'] || info['song_count'],
    };
    return collection;
}


export function makeCollections(info: any): Array<ICollection> {
    return info.map(collectionInfo => makeCollection(collectionInfo));
}
