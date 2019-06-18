'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import {
    getEpisodeId,
    getPodcastId,
    getRadioId,
} from "chord/sound/common/origin";


import { XimalayaApi } from 'chord/sound/ximalaya/api';


const _origin = 'ximalaya';

const _getEpisodeId: (id: string) => string = getEpisodeId.bind(null, _origin);
const _getPodcastId: (id: string) => string = getPodcastId.bind(null, _origin);
const _getRadioId: (id: string) => string = getRadioId.bind(null, _origin);

const api = new XimalayaApi();

const IN_CI = process.env.IN_CI;


suite('music/qianqian/XimalayaApi', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    // test('demoAudios', async function() {
    //     let audios = await api.demoAudios('68692449');
    // });

    test('audios', async function() {
        let audios = await api.audios('185851951');
        console.log(audios);
        assert.equal(audios.length > 0, true);
    });

    test('episode', async function() {
        let item = await api.episode('18556415');
        assert.equal(item.episodeOriginalId, '18556415');
        assert.equal(item.episodeId, _getEpisodeId('18556415'));
        assert.equal(item.podcastId, _getPodcastId('4756811'));
        assert.equal(item.radioId, _getRadioId('1266964'));
    });

    test('podcast', async function() {
        let item = await api.podcast('4756811');
        assert.equal(item.podcastOriginalId, '4756811');
        assert.equal(item.radioId, _getRadioId('1266964'));
    });

    test('podcastEpisodes', async function() {
        let item = await api.podcastEpisodes('4756811', 1);
        assert.equal(item.length > 0, true);
        assert.equal(item[0].episodeId.includes(_origin), true);
        assert.equal(item[0].podcastId, _getPodcastId('4756811'));
        assert.equal(item[0].radioId, _getRadioId('1266964'));
    });

    test('searchEpisodes', async function() {
        let item = await api.searchEpisodes('盗墓笔记', 1, 1);
        console.log(item);
        assert.equal(item.length > 0, true);
    });

    test('searchPodcasts', async function() {
        let item = await api.searchPodcasts('盗墓笔记', 1, 1);
        console.log(item);
        assert.equal(item.length > 0, true);
    });

    test('searchRadios', async function() {
        let item = await api.searchRadios('有声的紫襟', 1, 1);
        console.log(item);
        assert.equal(item.length > 0, true);
    });

    test('radio', async function() {
        let item = await api.radio('1266964');
        assert.equal(item.radioOriginalId, '1266964');
        assert.equal(item.radioId, _getRadioId('1266964'));
    });

    test('radioEpisodes', async function() {
        let item = await api.radioEpisodes('1266964');
        assert.equal(item.length > 0, true);
        assert.equal(item[0].episodeId.includes(_origin), true);
        assert.equal(item[0].podcastId.includes('podcast'),true);
        assert.equal(item[0].radioId, _getRadioId('1266964'));
    });

    test('radioFavoritePodcasts', async function() {
        let item = await api.radioFavoritePodcasts('47769994');
        assert.equal(item.length > 0, true);
        assert.equal(item[0].radioId, _getRadioId('47769994'));
    });

    test('radioCreatedPodcasts', async function() {
        let item = await api.radioPodcasts('1266964');
        assert.equal(item.length > 0, true);
        assert.equal(item[0].radioId, _getRadioId('1266964'));
    });

    test('podcastListOptions', async function() {
        let item = await api.podcastListOptions();
        assert.equal(item.length > 0, true);
    });

    test('podcastOptionSubs', async function() {
        let item = await api.podcastOptionSubs('youshengshu', 'wuxia');
        console.log(item);
        assert.equal(item.length > 0, true);
    });

    test('podcastList', async function() {
        let item = await api.podcastList('youshengshu', 'wuxia');
        console.log(item);
        assert.equal(item.length > 0, true);
    });

    test('fromURL', async function() {
        let data = [
            ['https://www.ximalaya.com/youshengshu/4756811/', 'podcastOriginalId', '4756811'],
            ['https://www.ximalaya.com/youshengshu/4756811/18556415', 'episodeOriginalId', '18556415'],
            ['https://www.ximalaya.com/zhubo/1266964/', 'radioOriginalId', '1266964'],
        ];
        for (let [url, key, id] of data) {
            let items = await api.fromURL(url);
            assert.equal(items[0][key], id);
        }
    });
});
