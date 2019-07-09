'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import { QianQianApi } from 'chord/music/qianqian/api';

const api = new QianQianApi();

const IN_CI = process.env.IN_CI;


suite('music/qianqian/QianQianApi', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    test('audios', async function() {
        let audios = await api.audios('931434');
        assert.equal(audios.length > 0, true);
    });

    test('audio', async function() {
        let audios = await api.audio('2108946');
        assert.equal(audios.length > 0, true);
    });

    test('song', async function() {
        let song = await api.song('2108946');
        assert.equal(song.songOriginalId, '2108946');
    });

    test('album', async function() {
        let album = await api.album('613447457');
        assert.equal(album.albumOriginalId, '613447457');
    });

    test('artist', async function() {
        let item = await api.artist('123');
        assert.equal(item.artistOriginalId, '123');
    });

    test('artistSongs', async function() {
        let item = await api.artistSongs('123', 0, 1);
        assert.equal(item.length > 0, true);
    });

    test('artistAlbums', async function() {
        let item = await api.artistAlbums('123', 0, 1);
        assert.equal(item.length > 0, true);
    });

    test('collection', async function() {
        let item = await api.collection('566332125');
        assert.equal(item.collectionOriginalId, '566332125');
    });

    test('collectionSongs', async function() {
        let item = await api.collectionSongs('566332125');
        assert.equal(item.length > 0, true);
    });

    test('searchSongs', async function() {
        let item = await api.searchSongs('linkin', 0, 2);
        assert.equal(item.length > 0, true);
    });

    test('searchAlbums', async function() {
        let item = await api.searchAlbums('linkin', 0, 2);
        assert.equal(item.length > 0, true);
    });

    test('searchArtists', async function() {
        let item = await api.searchArtists('linkin', 0, 2);
        assert.equal(item.length > 0, true);
    });

    test('searchCollections', async function() {
        let item = await api.searchCollections('linkin', 0, 2);
        assert.equal(item.length > 0, true);
    });

    test('userProfile', async function() {
        let item = await api.userProfile('麦芽糖糖');
        assert.equal(item.userName, '麦芽糖糖');
    });

    test('userFavoriteAlbums', async function() {
        let item = await api.userFavoriteAlbums('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('userFavoriteArtists', async function() {
        let item = await api.userFavoriteArtists('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('userFavoriteCollections', async function() {
        let item = await api.userFavoriteCollections('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('userCreatedCollections', async function() {
        let item = await api.userCreatedCollections('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('userFollowers', async function() {
        let item = await api.userFollowers('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('userFollowings', async function() {
        let item = await api.userFollowings('2698337947');
        assert.equal(item.length > 0, true);
    });

    test('fromURL', async function() {
        let data = [
            ['http://music.taihe.com/song/931434', 'songOriginalId', '931434'],
            ['http://music.taihe.com/artist/1097?pst=sug', 'artistOriginalId', '123'],
            ['http://music.taihe.com/album/613447457', 'albumOriginalId', '613447457'],
            ['http://music.taihe.com/songlist/566332198', 'collectionOriginalId', '566332198'],
            ['http://music.taihe.com/user?nickname=%E4%B8%80%E6%9D%AF%E6%B8%85%E8%8C%B6%E5%92%8C%E8%80%81%E6%AD%8C', 'userOriginalId', '2698316399'],
        ];
        for (let [url, key, id] of data) {
            let items = await api.fromURL(url);
            assert.equal(items[0][key], id);
        }
    });
});
