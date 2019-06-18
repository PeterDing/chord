'use strict';

import { parseToMillisecond } from 'chord/base/common/time';

import { IListOption } from 'chord/music/api/listOption';

import { IAudio } from 'chord/music/api/audio';
import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';
import { IRadio } from "chord/sound/api/radio";

import {
    getEpisodeId,
    getPodcastId,
    getRadioId,
    getRadioUrl,
} from "chord/sound/common/origin";

import { getAbsolutUrl } from "chord/base/node/url";
import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';

import { getDemoAudioUrl } from 'chord/sound/ximalaya/crypto';


const _origin = 'ximalaya';

const _getEpisodeId: (id: string) => string = getEpisodeId.bind(null, _origin);
const _getPodcastId: (id: string) => string = getPodcastId.bind(null, _origin);
const _getRadioId: (id: string) => string = getRadioId.bind(null, _origin);
const _getRadioUrl: (id: string) => string = getRadioUrl.bind(null, _origin);

const DOMAIN = 'https://www.ximalaya.com';
const IMG_DOMAIN = 'http://imagev2.xmcdn.com';


function _makeAudio(url: string): IAudio {
    return {
        url,
        kbps: 64,
        format: 'm4a',
        size: 1,
    };
}


export function makeDemoAudio(info: any): IAudio {
    let url = getDemoAudioUrl(info);
    if (!url) return null;
    return _makeAudio(url);
}


export function makeAudio(url: any): IAudio {
    if (!url) return null;
    return _makeAudio(url);
}


export function makeEpisode(info: any): IEpisode {
    let episodeInfo = info['trackInfo'] || info;
    let podcastInfo = info['albumInfo'] || info;
    let radioInfo = info['userInfo'] || info;

    let episodeOriginalId = (episodeInfo['trackId'] || info['id']).toString();
    let episodeName = episodeInfo['title'] || episodeInfo['trackName'];
    let url = DOMAIN + (episodeInfo['link'] || episodeInfo['trackUrl'] || episodeInfo['url']);
    let t = url.split('/').slice(-2)[0];

    let podcastOriginalId = (podcastInfo['albumId'] || info['album_id'] || t).toString();
    let podcastName = podcastInfo['albumId'] ? (podcastInfo['title'] || info['albumTitle']) : podcastInfo['albumName'] || info['album_title'];
    let podcastCoverUrl = podcastInfo['coverPath'] || podcastInfo['trackCoverPath'] || info['cover_path'];
    podcastCoverUrl = podcastCoverUrl ? getAbsolutUrl(podcastCoverUrl, IMG_DOMAIN) : null;

    let radioOriginalId = radioInfo['uid'] || radioInfo['anchorId'] || radioInfo['anchorUid'];
    radioOriginalId = radioOriginalId ? radioOriginalId.toString() : null;
    let radioName = radioInfo['nickname'];
    let radioCoverUrl = getAbsolutUrl(radioInfo['coverPath'] || info['cover'] || info['logoPic'], IMG_DOMAIN);

    let lyricUrl = episodeInfo['lyric'];

    let tags = info['tags'] ? info['tags'].split(',').map(name => ({ name, id: null })) : null;

    let duration = episodeInfo['duration'] ? episodeInfo['duration'] * 1000
        : episodeInfo['durationAsString'] ? parseToMillisecond(episodeInfo['durationAsString']) : null;

    let audio = makeAudio(episodeInfo['src']);
    let audios = audio ? [audio] : [];
    if (info['play_path_64']) {
        audio = makeAudio(episodeInfo['play_path_64']);
        audio.kbps = 64;
        audios.push(audio);
    }
    if (info['play_path_32']) {
        audio = makeAudio(episodeInfo['play_path_32']);
        audio.kbps = 32;
        audios.push(audio);
    }

    let releaseDate = episodeInfo['lastUpdate'] ? Date.parse(episodeInfo['lastUpdate'])
        : info['updated_at'] ? info['updated_at']
            : episodeInfo['updateTime'] || episodeInfo['createTime'] || episodeInfo['createDateFormat'] || info['createTimeAsString'];

    let episode: IEpisode = {
        episodeId: _getEpisodeId(episodeOriginalId),

        type: 'episode',
        origin: _origin,

        episodeOriginalId,

        url,

        episodeName,

        podcastId: _getPodcastId(podcastOriginalId),
        podcastOriginalId,
        podcastName,
        podcastCoverUrl,

        radioId: _getRadioId(radioOriginalId),
        radioOriginalId,
        radioName,
        radioCoverUrl,

        description: episodeInfo['richIntro'] || episodeInfo['intro'],

        composer: episodeInfo['compose'],

        tags,

        lyricUrl,

        track: episodeInfo['index'] ? episodeInfo['index'] - 1 : null,

        // millisecond
        duration,

        // millisecond
        releaseDate,

        playCountWeb: episodeInfo['playCount'] || info['count_play'] || null,
        playCount: 0,
        likeCount: info['count_like'],

        audios,
    };
    return episode;
}


export function makeEpisodes(info: any): Array<IEpisode> {
    return (info || []).map(episodeInfo => makeEpisode(episodeInfo));
}


export function makePodcast(info: any): IPodcast {
    let podcastInfo = info['mainInfo'] || info;
    let radioInfo = info['anchorInfo'] || info['anchor'] || info;
    let episodeListInfo = info['tracksInfo'] || info;
    let metas = podcastInfo['metas'] || info;

    let podcastOriginalId = (podcastInfo['albumId'] || info['albumId'] || info['id']).toString();
    let podcastId = _getPodcastId(podcastOriginalId);
    let podcastName = podcastInfo['albumTitle'] || info['title'];
    let podcastCoverUrl = podcastInfo['cover'] || podcastInfo['coverPath'] || info['cover_path'];
    podcastCoverUrl = podcastCoverUrl ? getAbsolutUrl(podcastCoverUrl.split('!')[0], IMG_DOMAIN) : null;

    let radioOriginalId = (radioInfo['anchorId'] || radioInfo['anchorUid'] || radioInfo['uid']).toString();
    let radioId = _getRadioId(radioOriginalId);
    let radioName = radioInfo['anchorName'] || radioInfo['anchorNickName'] || radioInfo['nickname'];

    let tags = info['tags'] ? info['tags'].split(',').map(name => ({ name, id: null })) : null;

    let category = metas[0] ? metas[0]['categoryName'] : null;
    let url = category ? (DOMAIN + '/' + category + '/' + podcastOriginalId)
        : info['albumUrl'] ? (DOMAIN + info['albumUrl'])
            : info['url'] ? (DOMAIN + info['url'])
                : info['link'] ? (DOMAIN + info['link']) : null;

    // let episodeList = episodeListInfo['tracks']; // 'tracks' can be number
    // let episodes = (episodeList && episodeList.length) ? (episodeList || []).map(j => {
    //     let episode = makeEpisode(j);
    //     episode = {
    //         ...episode,
    //         url: url + '/' + episode.episodeOriginalId,

    //         podcastOriginalId,
    //         podcastId,
    //         podcastName,
    //         podcastCoverUrl,

    //         radioOriginalId,
    //         radioId: radioId,
    //         radioName: radioName,
    //     };
    //     return episode;
    // }) : [];

    let podcast: IPodcast = {
        podcastId,

        type: 'podcast',
        origin: _origin,
        podcastOriginalId,
        url,

        podcastName,
        podcastCoverUrl,

        radioId,
        radioName,

        description: podcastInfo['richIntro'] || podcastInfo['description'] || info['intro'],

        tags,

        releaseDate: Date.parse(podcastInfo['updateDate']) || info['updated_at'] || 0,

        episodes: [],
        episodeCount: episodeListInfo['trackTotalCount'] || info['trackCount'] || info['tracks'],

        playCount: podcastInfo['playCount'] || info['play'],
        likeCount: null,
    };
    return podcast;
}


export function makePodcasts(info: any): Array<IPodcast> {
    return (info || []).map(episodeInfo => makePodcast(episodeInfo));
}


export function makeRadio(info: any): IRadio {
    let radioOriginalId = info['uid'].toString();
    let radioCoverUrl = getAbsolutUrl(info['cover'] || info['logoPic'] || info['coverPath'], IMG_DOMAIN);
    let radioName = info['nickName'] || info['anchorNickName'] || info['nickname'];

    let followerCount = info['fansCount'] || info['followers_counts'] || info['followerCount'];
    let followingCount = info['followingCount'] || info['followings_counts'];
    let url = _getRadioUrl(radioOriginalId);

    let radio = {
        radioId: _getRadioId(radioOriginalId),

        type: 'radio',
        origin: _origin,

        radioOriginalId: radioOriginalId,
        url,

        radioName: radioName,
        radioCoverUrl,

        followerCount,
        followingCount,

        episodeCount: info['tracks_counts'] || info['trackCount'],
        podcastCount: info['album_counts'] || info['albumCount'],

        description: info['personalSignature'] || info['description'],
    };
    return radio;
}


export function makeRadios(info: any): Array<IRadio> {
    return (info || []).map(radio => makeRadio(radio));
}


export function makePodcastListOptions(info: any): Array<IListOption> {
    let options = [];
    for (let i of info) {
        for (let category of i.categories) {
            let option = {
                id: category.id,
                name: category.displayName,
                type: category.name,
                items: category.subcategories.map(subInfo => ({
                    id: subInfo.id,
                    name: subInfo.displayValue,
                    type: subInfo.code,
                    items: [],
                    info: {
                        metaId: subInfo.metadataId,
                        metaValue: subInfo.metadataValue,

                        // this is category.id
                        category: subInfo.categoryId,
                    },
                })),
            };
            options.push(option);
        }
    }
    return options;
}


export function makePodcastOptionSubs(info: any): Array<IListOption> {
    let options = [];
    let list = [...info.currentSubcategory.metas, ...info.metadata];
    for (let meta of list) {
        let option = {
            id: meta.id,
            name: meta.name,
            type: 'meta',
            items: meta.metaValues.map(val => ({
                id: val.id,
                name: val.name,
                type: val.code,
            })),
        };
        options.push(option);
    }

    return options;
}
