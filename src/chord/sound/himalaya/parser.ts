'use strict';

import { literal_to_number } from 'chord/platform/utils/common/size';

import { IAudio } from 'chord/music/api/audio';
import { IEpisode } from 'chord/sound/api/episode';
import { IPodcast } from 'chord/sound/api/podcast';

import {
    getEpisodeId,
    getPodcastId,
    getRadioId,
} from "chord/sound/common/origin";

import { makeLyric as _makeLyric } from 'chord/music/utils/lyric';

const _origin = 'himalaya';

const _getEpisodeId: (id: string) => string = getEpisodeId.bind(null, _origin);
const _getPodcastId: (id: string) => string = getPodcastId.bind(null, _origin);
const _getRadioId: (id: string) => string = getRadioId.bind(null, _origin);

const DOMAIN = 'https://www.himalaya.com';


function makeEpisodeUrl(type: string, podcastName: string, podcastOriginalId: string, episodeName: string, episodeOriginalId: string): string {
    let url = DOMAIN + '/' + type + '-podcasts/' + podcastName + '-' + podcastOriginalId + '/' + episodeName + '-' + episodeOriginalId;
    return url.toLowerCase().replace(/[- ]+/g, '-');
}

function makePodcastUrl(type: string, podcastName: string, podcastOriginalId: string): string {
    let url = DOMAIN + '/' + type + '-podcasts/' + podcastName + '-' + podcastOriginalId;
    return url.toLowerCase().replace(/[- ]+/g, '-');
}


export function makeAudio(url: any): IAudio {
    if (!url) return null;
    return {
        url,
        kbps: 64,
        format: 'mp3',
        size: 1,
    };
}


export function makeEpisode(info: any): IEpisode {
    let episodeOriginalId = (info['trackId'] || info['id']).toString();
    let episodeName = info['title'] || info['trackName'];

    let podcastOriginalId = info['albumId'].toString();
    let podcastName = info['albumTitle'];
    let podcastCoverUrl = info['coverSmall'];

    let url = makeEpisodeUrl(info['secondCategory']['seoTitle'], podcastName, podcastOriginalId, episodeName, episodeOriginalId);

    let radioOriginalId = info['uid'].toString();
    let radioName = info['nickname'];

    let duration = info['duration'] * 1000;

    let audio = makeAudio(info['downloadUrl']);
    let audios = audio ? [audio] : [];

    let releaseDate = info['createdAt'];

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

        description: info['intro'],

        // millisecond
        duration,

        // millisecond
        releaseDate,

        playCountWeb: info['playtimes'],
        playCount: 0,
        likeCount: info['likes'],

        audios,

        disable: !info['isFree'],
    };
    return episode;
}


export function makeEpisodes(info: any): Array<IEpisode> {
    return (info || []).map(info => makeEpisode(info));
}


export function makePodcast(info: any): IPodcast {
    let podcastOriginalId = info['albumId'].toString();
    let podcastId = _getPodcastId(podcastOriginalId);
    let podcastName = info['title'];
    let podcastCoverUrl = info['coverOrigin'];

    let radioOriginalId = (info['anchorId'] || info['anchorUid'] || info['uid']).toString();
    let radioId = _getRadioId(radioOriginalId);
    let radioName = info['anchorName'] || info['anchorNickName'] || info['nickname'];

    let tags = [
        { name: info['firstCategory']['title'], id: info['firstCategory']['id'] },
        { name: info['secondCategory']['title'], id: info['secondCategory']['id'] },
    ];

    let url = makePodcastUrl(info['secondCategory']['title'], podcastName, podcastOriginalId);

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

        description: info['intro'],

        tags,

        releaseDate: info['createdAt'],

        episodes: [],
        episodeCount: info['tracks'],

        playCount: literal_to_number(info['playTimes']),
        likeCount: literal_to_number(info['subscribeCount']),
    };
    return podcast;
}


export function makePodcasts(info: any): Array<IPodcast> {
    return (info || []).map(episodeInfo => makePodcast(episodeInfo));
}
