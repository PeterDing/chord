'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import { KuwoMusicApi } from 'chord/music/kuwo/api';

let api = new KuwoMusicApi();

const IN_CI = process.env.IN_CI;


suite('music/kuwo/api', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    test('audios', async function() {
        let item = await api.audios('7149583');
        assert.equal(item.length > 0, true);
    });

    test('song', async function() {
        let id = '7149583';
        let item = await api.song(id);
        assert.equal(item.songOriginalId, id);
    });

    test('lyric', async function() {
        let id = '60478382';
        let item = await api.lyric(id);
        assert.equal(item.songId.split('|')[2], id);
    });

    test('album', async function() {
        let id = '10764969';
        let item = await api.album(id);
        assert.equal(item.albumOriginalId, id);
    });

    test('artist', async function() {
        let id = '12033';
        let item = await api.artist(id);
        assert.equal(item.artistOriginalId, id);
    });

    test('artistSongs', async function() {
        let id = '12033';
        let item = await api.artistSongs(id);
        assert.equal(item.length > 0, true);
    });

    test('artistAlbums', async function() {
        let id = '12033';
        let item = await api.artistAlbums(id);
        assert.equal(item.length > 0, true);
    });

    test('collection', async function() {
        let id = '2433924200';
        let item = await api.collection(id);
        assert.equal(item.collectionOriginalId, id);
    });

    test('searchSongs', async function() {
        let item = await api.searchSongs('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchAlbums', async function() {
        let item = await api.searchAlbums('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchArtists', async function() {
        let item = await api.searchArtists('linkin');
        assert.equal(item.length > 0, true);
    });

    test('searchCollections', async function() {
        let item = await api.searchCollections('linkin');
        assert.equal(item.length > 0, true);
    });
});
