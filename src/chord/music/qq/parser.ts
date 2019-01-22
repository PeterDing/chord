'use strict';

import { isObject } from 'chord/base/common/objects';
import { decodeHtml } from 'chord/base/browser/htmlContent';

import { IAudio } from 'chord/music/api/audio';
import { ISong } from 'chord/music/api/song';
import { ILyric } from 'chord/music/api/lyric';
import { IAlbum } from 'chord/music/api/album';
import { IArtist } from 'chord/music/api/artist';
import { ICollection } from 'chord/music/api/collection';
// import { IGenre } from "chord/music/api/genre";
import { ITag } from "chord/music/api/tag";

import { IUserProfile } from "chord/music/api/user";

import {
    getSongUrl,
    getAlbumUrl,
    getArtistUrl,
    getCollectionUrl,
    getUserUrl,
    getSongId,
    getAlbumId,
    getArtistId,
    getCollectionId,
    getUserId,
} from "chord/music/common/origin";

import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';


const _origin = 'qq';

const _getSongUrl: (id: string) => string = getSongUrl.bind(null, _origin);
const _getSongId: (id: string) => string = getSongId.bind(null, _origin);
const _getAlbumUrl: (id: string) => string = getAlbumUrl.bind(null, _origin);
const _getAlbumId: (id: string) => string = getAlbumId.bind(null, _origin);
const _getArtistUrl: (id: string) => string = getArtistUrl.bind(null, _origin);
const _getArtistId: (id: string) => string = getArtistId.bind(null, _origin);
const _getCollectionUrl: (id: string) => string = getCollectionUrl.bind(null, _origin);
const _getCollectionId: (id: string) => string = getCollectionId.bind(null, _origin);
const _getUserUrl: (id: string) => string = getUserUrl.bind(null, _origin);
const _getUserId: (id: string) => string = getUserId.bind(null, _origin);


export const AUDIO_FORMAT_MAP = {
    '128mp3': 'M500',
    '320mp3': 'M800',
    '1ape': 'A000',
    '1000flac': 'F000',
};

export const KBPS_MAP = {
    '128': 128,
    '320': 320,
    '128mp3': 128,
    '320mp3': 320,
    // ape file is not accessable, so missing it
    'ape': 1,
    'flac': 1000,
};

export const FORMAT_MAP = {
    '128': 'mp3',
    '320': 'mp3',
    '128mp3': 'mp3',
    '320mp3': 'mp3',
    'ape': 'ape',
    'flac': 'flac',
};


function getQQAlbumCoverUrl(mid: string): string {
    return 'http://y.gtimg.cn/music/photo_new/T002R300x300M000' + mid + '.jpg?max_age=2592000';
}

function getQQArtistAvatarUrl(mid: string): string {
    return 'http://y.gtimg.cn/music/photo_new/T001R300x300M000' + mid + '.jpg?max_age=2592000';
}

function makeAudios(info: any): Array<IAudio> {
    return Object.keys(info)
        .filter(key => FORMAT_MAP[key.replace(/size_?/, '').toLowerCase()] && key.startsWith('size') && info[key])
        .map(key => {
            let chunk = key.replace(/size_?/, '').toLowerCase();
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
        .sort((x, y) => y.kbps - x.kbps);
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
    return (info || []).map(songInfo => makeSong(songInfo));
}


export function makeLyric(songId: string, lyricInfo: string, transInfo: string): ILyric {
    if (!lyricInfo) return null;

    let lyric = _makeLyric(lyricInfo);
    let chunksMap = {};
    lyric.chunks.forEach(chunk => chunksMap[chunk.point] = chunk);

    if (transInfo) {
        let trans = _makeLyric(transInfo);
        trans.chunks.forEach((chunk, index) => {
            let lyricChunk = chunksMap[chunk.point];
            if (lyricChunk) lyricChunk.translation = chunk.text;
        });
    }

    lyric.songId = _getSongId(songId);
    return lyric;
}


export function makeAlbum(info: any): IAlbum {
    let albumOriginalId = (info['id'] || info['albumid'] || info['albumID'] || info['album_id']).toString();
    let albumMid = info['mid'] || info['album_mid'] || info['albumMID'] || info['albummid'];
    let albumName = info['name'] || info['album_name'] || info['albumName'];
    albumName = decodeHtml(albumName);
    let albumCoverUrl = getQQAlbumCoverUrl(albumMid);

    let artistOriginalId = info['singerid'] || info['singer_id'] || info['singerID'];
    let artistMid;
    let artistName;
    if (artistOriginalId) {
        artistOriginalId = artistOriginalId.toString();
        artistMid = info['singermid'] || info['singer_mid'] || info['singerMID'];
        artistName = info['singername'] || info['singer_name'] || info['singerName'];
    } else {
        if (isObject(info['singers'])) {
            let singerInfo = info['singers'][0];
            artistOriginalId = singerInfo['singer_id'].toString();
            artistMid = singerInfo['singer_mid'];
            artistName = singerInfo['singer_name'];
        } else {
            throw new Error(`[Error] [qq.parser.makeAlbum]: can not parse info: ${JSON.stringify(info)}`);
        }
    }
    artistName = decodeHtml(artistName);

    let tags: Array<ITag> = info['genre'] ? [{ id: null, name: info['genre'] }] : [];

    let releaseDate = Date.parse(info['aDate'] || info['pub_time'] || info['publicTime'] || info['public_time']);

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
    return (info || []).map(albumInfo => makeAlbum(albumInfo));
}


export function makeArtist(info: any): IArtist {
    let artistOriginalId = (info['singer_id'] || info['id'] || info['singerid']).toString();
    let artistMid = info['singer_mid'] || info['mid'] || info['singermid'];
    let artistName = info['singer_name'] || info['name'] || info['singername'];
    artistName = decodeHtml(artistName);
    let artistAvatarUrl = getQQArtistAvatarUrl(artistMid);

    let likeCount = info['num'];

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

        likeCount,
    };
    return artist;
}


export function makeArtists(info: any): Array<IArtist> {
    return (info || []).map(artistInfo => makeArtist(artistInfo));
}


export function makeCollection(info: any): ICollection {
    let collectionOriginalId = (info['disstid'] || info['dissid'] || info['tid'] || info['content_id']).toString();
    let collectionCoverUrl = info['logo'] || info['imgurl'] || info['diss_cover'] || info['cover'];
    if (!collectionCoverUrl || !collectionCoverUrl.startsWith('http')) {
        collectionCoverUrl = 'http://y.gtimg.cn/mediastyle/global/img/cover_like.png?max_age=2592000';
    }
    let collectionName = info['dissname'] || info['diss_name'] || info['title'];
    collectionName = decodeHtml(collectionName);

    let tags: Array<ITag> = (info['tags'] || []).map(tag => ({ id: tag['id'].toString(), name: tag['name'] }));
    let songs: Array<ISong> = (info['songlist'] || []).map(songInfo => makeSong(songInfo));
    let duration = songs.length != 0 ? songs.map(s => s.duration).reduce((x, y) => x + y) : null;

    let userOriginalId;
    let userMid;
    let userName;
    if (info['creator'] && !isObject(info['creator'])) {
        userOriginalId = info['creator'];
        userMid = info['creator'];
        userName = info['username'];
    } else {
        userOriginalId = info['creator'] ? (info['creator']['creator_uin'] || info['creator']['qq']).toString() : info['uin'];
        userMid = info['creator'] ? info['creator']['encrypt_uin'].toString() : (info['encrypt_uin'] || info['uin']);
        userName = info['creator'] ? info['creator']['name'] : info['nickname'];
    }
    let userId = _getUserId(userOriginalId);
    userName = decodeHtml(userName);

    let playCount = info['visitnum'] || info['listennum'] || info['listen_num'];

    let releaseDate = (info['ctime'] * 1000) || typeof (info['createtime']) == 'number' ? info['createtime'] * 1000 : Date.parse(info['createtime']);
    let songCount = info['total_song_num'] || info['song_count'] || info['songnum'] || info['song_cnt'];

    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),

        collectionName,

        collectionCoverUrl,

        userId,
        userMid,
        userName,

        // millisecond
        releaseDate,

        description: info['desc'] || info['introduction'],

        tags,

        duration,

        songs,
        songCount,

        playCount,
    };
    return collection;
}


export function makeEmptyCollection(collectionOriginalId: string): ICollection {
    let collection: ICollection = {
        collectionId: _getCollectionId(collectionOriginalId),

        type: 'collection',
        origin: _origin,
        collectionOriginalId,
        url: _getCollectionUrl(collectionOriginalId),
        songs: [],
    };
    return collection;
}


export function makeCollections(info: any): Array<ICollection> {
    return (info || []).map(collectionInfo => makeCollection(collectionInfo));
}


export function makeUserProfile(info: any): IUserProfile {
    let userInfo = info['creator'] || info;
    let musicInfo = info['mymusic'] || info;
    let createdCollectionsInfo = info['mydiss'] || info;

    // qq number
    // if there is not qq number, using encrypt_uin
    let userOriginalId = (userInfo['uin'] || info['uin'] || info['encrypt_uin']).toString();

    let userProfile = {
        userId: _getUserId(userOriginalId),

        type: 'userProfile',

        origin: _origin,

        userOriginalId,

        url: _getUserUrl(userOriginalId),

        userName: userInfo['nick'] || info['nick_name'],

        userMid: userInfo['encrypt_uin'] || info['encrypt_uin'],

        userAvatarUrl: userInfo['headpic'] || info['logo'],

        followerCount: info['listen_num'] != undefined ? info['listen_num'] : userInfo['nums']['fansnum'],
        followingCount: info['follow_num'] != undefined ? info['follow_num'] : userInfo['nums']['followusernum'],

        songCount: musicInfo[1] ? musicInfo[1]['num0'] : null,
        artistCount: userInfo['nums'] ? userInfo['nums']['followsingernum'] : null,
        albumCount: musicInfo[1] ? musicInfo[1]['num1'] : null,
        favoriteCollectionCount: musicInfo[1] ? musicInfo[1]['num2'] : null,
        createdCollectionCount: info['songlist_num'] != undefined ? info['songlist_num'] : createdCollectionsInfo['num'],

        description: info['desc'],
    };
    return userProfile;
}


export function makeUserProfiles(info: any): Array<IUserProfile> {
    return (info || []).map(_info => makeUserProfile(_info));
}
