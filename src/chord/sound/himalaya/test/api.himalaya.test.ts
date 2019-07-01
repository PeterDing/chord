'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import {
    getEpisodeId,
    getPodcastId,
} from "chord/sound/common/origin";


import { HimalayaApi } from 'chord/sound/himalaya/api';


const _origin = 'himalaya';

const _getEpisodeId: (id: string) => string = getEpisodeId.bind(null, _origin);
const _getPodcastId: (id: string) => string = getPodcastId.bind(null, _origin);

const api = new HimalayaApi();

const IN_CI = process.env.IN_CI;


suite('music/qianqian/HimalayaApi', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    // test('demoAudios', async function() {
    //     let audios = await api.demoAudios('68692449');
    // });

    test('audios', async function() {
        let audios = await api.audios('2291267');
        assert.equal(audios.length > 0, true);
    });

    test('episode', async function() {
        let item = await api.episode('2291267');
        assert.equal(item.episodeOriginalId, '2291267');
        assert.equal(item.episodeId, _getEpisodeId('2291267'));
        assert.equal(item.podcastId, _getPodcastId('117912'));
    });

    test('podcast', async function() {
        let item = await api.podcast('117912');
        console.log(item);
        assert.equal(item.podcastOriginalId, '117912');
    });

    test('podcastEpisodes', async function() {
        let item = await api.podcastEpisodes('117912', 1);
        assert.equal(item.length > 0, true);
        assert.equal(item[0].episodeId.includes(_origin), true);
        assert.equal(item[0].podcastId, _getPodcastId('117912'));
    });

    test('searchEpisodes', async function() {
        let item = await api.searchEpisodes('盗墓笔记', 1, 1);
        assert.equal(item.length > 0, true);
    });

    test('searchPodcasts', async function() {
        let item = await api.searchPodcasts('盗墓笔记', 1, 1);
        assert.equal(item.length > 0, true);
    });

    test('fromURL', async function() {
        let data = [
            ['https://www.himalaya.com/history-podcasts/你应该详尽了解的《美国历史》【真正读懂美国史】-117912', 'podcastOriginalId', '117912'],
            ['https://www.himalaya.com/history-podcasts/%E4%BD%A0%E5%BA%94%E8%AF%A5%E8%AF%A6%E5%B0%BD%E4%BA%86%E8%A7%A3%E7%9A%84%E3%80%8A%E7%BE%8E%E5%9B%BD%E5%8E%86%E5%8F%B2%E3%80%8B%E3%80%90%E7%9C%9F%E6%AD%A3%E8%AF%BB%E6%87%82%E7%BE%8E%E5%9B%BD%E5%8F%B2%E3%80%91-117912/6-5-1-%E5%A5%B4%E9%9A%B6%E5%88%B6%E4%B8%8E%E8%87%AA%E7%94%B1%E7%9A%84%E8%AF%AD%E8%A8%80-2291267', 'episodeOriginalId', '2291267'],
        ];
        for (let [url, key, id] of data) {
            let items = await api.fromURL(url);
            assert.equal(items[0][key], id);
        }
    });
});
