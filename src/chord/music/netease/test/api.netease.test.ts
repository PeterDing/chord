'use strict';

import * as assert from 'assert';
import * as process from 'process';

import { suite, test } from 'mocha';

import { NeteaseMusicApi } from 'chord/music/netease/api';
import { encrypt } from 'chord/music/netease/crypto';


const neteaseApi = new NeteaseMusicApi();

const IN_CI = process.env.IN_CI;


suite('music/netease/NeteaseMusicApi', () => {

    /**
     * Net requests have some probability to be fail,
     * so we test these requests at local, missing at CI
    */
    if (IN_CI) return;

    test('toAES', function() {
        encrypt({ a: 1 });
    });

    test('audios', async function() {
        let id = '108795';
        let audios = await neteaseApi.audios(id);
        assert.equal(audios.length > 0, true)
    });

    test('songsAudios', async function() {
        let songsAudios = await neteaseApi.songsAudios(['185868', '1309814820']);
        assert.equal(songsAudios.length, 2);
    });

    test('song', async function() {
        let id = '546769020';
        let song = await neteaseApi.song(id);
        assert.equal(song.songOriginalId, id);
    });

    test('album', async function() {
        let id = '18893';
        let album = await neteaseApi.album(id);
        assert.equal(album.albumOriginalId, id);
    });

    test('artist', async function() {
        let id = '10563';
        let artist = await neteaseApi.artist(id);
        assert.equal(artist.artistOriginalId, id);
    });

    test('artistAlbums', async function() {
        let id = '10563';
        let albums = await neteaseApi.artistAlbums(id, 0, 1);
        assert.equal(albums.length, 1);
    });

    test('collection', async function() {
        let id = '2309425946';
        let collection = await neteaseApi.collection(id);
        assert.equal(collection.collectionOriginalId, id);
    });

    test('searchSongs', async function() {
        let keyword = 'linkin';
        let songs = await neteaseApi.searchSongs(keyword, 0, 1);
        assert.equal(songs.length, 1);
    });

    test('searchAlbums', async function() {
        let keyword = 'linkin';
        let albums = await neteaseApi.searchAlbums(keyword, 0, 1);
        assert.equal(albums.length, 1);
    });

    test('searchArtists', async function() {
        let keyword = 'linkin';
        let artists = await neteaseApi.searchArtists(keyword, 0, 1);
        assert.equal(artists.length, 1);
    });

    test('searchCollections', async function() {
        let keyword = 'linkin';
        let collections = await neteaseApi.searchCollections(keyword, 0, 1);
        assert.equal(collections.length, 1);
    });

    test('similarSongs', async function() {
        let id = '298317';
        let songs = await neteaseApi.similarSongs(id);
        assert.equal(songs.length > 0, true);
    });

    // test('similarArtists', async function() {
    // let id = '10563';
    // let artists = await neteaseApi.similarArtists(id);
    // });

    test('similarCollections', async function() {
        let id = '2394955929';
        let collections = await neteaseApi.similarCollections(id);
        assert.equal(collections.length > 0, true);
    });

    test('songBelongsToCollections', async function() {
        let id = '546769020';
        let collections = await neteaseApi.songBelongsToCollections(id);
        assert.equal(collections.length > 0, true);
    });

    test('collectionListOptions', async function() {
        let options = await neteaseApi.collectionListOptions();
        assert.equal(options.length > 0, true);
        assert.equal(options[0].name, '全部歌单');
    });

    test('collectionListOptions', async function() {
        let collections = await neteaseApi.collectionList('全部', 'hot', 0, 1);
        assert.equal(collections.length, 1);
    });

    test('newSongs', async function() {
        let songs = await neteaseApi.newSongs();
        assert.equal(songs.length > 0, true);
    });

    test('newAlbums', async function() {
        let albums = await neteaseApi.newAlbums();
        assert.equal(albums.length > 0, true);
    });

    test('newCollections', async function() {
        let collections = await neteaseApi.newCollections();
        assert.equal(collections.length > 0, true);
    });

    test('logined', function() {
        let ok = neteaseApi.logined();
        assert.equal(ok, false);
    });

    test('userProfile', async function() {
        let id = '103780233';
        let userProfile = await neteaseApi.userProfile(id);
        assert.equal(userProfile.userOriginalId, id);
    });

    test('userFavoriteSongs', async function() {
        let id = '103780233';
        let songs = await neteaseApi.userFavoriteSongs(id, 0, 1);
        assert.equal(songs.length, 1);
    });

    test('userFavoriteArtists', async function() {
        let id = '103780233';
        let artists = await neteaseApi.userFavoriteArtists(id, 0, 1);
        assert.equal(artists.length, 0);
    });

    test('userFavoriteCollections', async function() {
        let id = '103780233';
        let collections = await neteaseApi.userFavoriteCollections(id, 0, 1);
        assert.equal(collections.length, 2);
    });

    test('userFollowers', async function() {
        let id = '103780233';
        let followers = await neteaseApi.userFollowers(id, 0, 1);
        assert.equal(followers.length, 1);
    });

    test('userFollowings', async function() {
        let id = '103780233';
        let followings = await neteaseApi.userFollowings(id, 0, 1);
        assert.equal(followings.length, 1);
    });

    test('recommendSongs', async function() {
        let songs = await neteaseApi.recommendSongs(0, 1);
        assert.equal(songs.length, 1);
    });

    test('recommendCollections', async function() {
        let collections = await neteaseApi.recommendCollections(0, 1);
        assert.equal(collections.length, 1);
    });
});
