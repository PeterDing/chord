define(["require", "exports", "querystring"], function(require, exports, querystring) {
    'use strict';

    // =====================================================================
    // getDemoAudioUrl
    // {{{
    function i(e) {
        this._randomSeed = e,
            this.cg_hun()
    }
    i.prototype = {
        cg_hun: function() {
            this._cgStr = "";
            var e = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/\\:._-1234567890",
                t = e.length,
                n = 0;
            for (n = 0; n < t; n++) {
                var r = this.ran() * e.length,
                    a = parseInt(r);
                this._cgStr += e.charAt(a),
                    e = e.split(e.charAt(a)).join("")
            }
        },
        cg_fun: function(e) {
            e = e.split("*");
            var t = "",
                n = 0;
            for (n = 0; n < e.length - 1; n++)
                t += this._cgStr.charAt(e[n]);
            return t
        },
        ran: function() {
            return this._randomSeed = (211 * this._randomSeed + 30031) % 65536,
                this._randomSeed / 65536
        },
        cg_decode: function(e) {
            var t = "",
                n = 0;
            for (n = 0; n < e.length; n++) {
                var r = e.charAt(n),
                    a = this._cgStr.indexOf(r); -
                1 !== a && (t += a + "*")
            }
            return t
        }
    };

    function getEncryptedFileName(e, t) {
        var n = new i(e).cg_fun(t);
        return "/" === n[0] ? n : "/" + n
    }

    function a(e, t) {
        for (var n, r = [], a = 0, i = "", o = 0; 256 > o; o++)
            r[o] = o;
        for (o = 0; 256 > o; o++)
            a = (a + r[o] + e.charCodeAt(o % e.length)) % 256,
            n = r[o],
            r[o] = r[a],
            r[a] = n;
        for (var u = a = o = 0; u < t.length; u++)
            a = (a + r[o = (o + 1) % 256]) % 256,
            n = r[o],
            r[o] = r[a],
            r[a] = n,
            i += String.fromCharCode(t.charCodeAt(u) ^ r[(r[o] + r[a]) % 256]);
        return i
    }

    var o = a("xm", 'Ä[Ü\x14J=\x86Û3Áf÷\x17N'),
        u = [19, 1, 4, 7, 30, 14, 28, 8, 24, 17, 6, 35, 34, 16, 9, 10, 13, 22, 32, 29, 31, 21, 18, 3, 2, 23, 25, 27, 11, 20, 5, 15, 12, 0, 33, 26];

    function getEncryptedFileParams(e) {
        var t = a(function(e, t) {
                for (var n = [], r = 0; r < e.length; r++) {
                    for (var a = "a" <= e[r] && "z" >= e[r] ? e[r].charCodeAt() - 97 : e[r].charCodeAt() - 48 + 26, i = 0; 36 > i; i++)
                        if (t[i] == a) {
                            a = i;
                            break
                        }
                    n[r] = 25 < a ? String.fromCharCode(a - 26 + 48) : String.fromCharCode(a + 97)
                }
                return n.join("")
            }("d" + o + "9", u), function(e) {
                if (!e)
                    return "";
                var t, n, r, a, i, o = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 62, -1, -1, -1, 63, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, -1, -1, -1, -1, -1, -1, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, -1, -1, -1, -1, -1, -1, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, -1, -1, -1, -1, -1];
                for (a = (e = e.toString()).length,
                    r = 0,
                    i = ""; r < a;) {
                    do {
                        t = o[255 & e.charCodeAt(r++)]
                    } while (r < a && -1 == t);
                    if (-1 == t)
                        break;
                    do {
                        n = o[255 & e.charCodeAt(r++)]
                    } while (r < a && -1 == n);
                    if (-1 == n)
                        break;
                    i += String.fromCharCode(t << 2 | (48 & n) >> 4);
                    do {
                        if (61 == (t = 255 & e.charCodeAt(r++)))
                            return i;
                        t = o[t]
                    } while (r < a && -1 == t);
                    if (-1 == t)
                        break;
                    i += String.fromCharCode((15 & n) << 4 | (60 & t) >> 2);
                    do {
                        if (61 == (n = 255 & e.charCodeAt(r++)))
                            return i;
                        n = o[n]
                    } while (r < a && -1 == n);
                    if (-1 == n)
                        break;
                    i += String.fromCharCode((3 & t) << 6 | n)
                }
                return i
            }(e)).split("-"),
            n = t,
            // n = (0,
            // r.default)(t, 4),
            i = n[0];
        return {
            sign: n[1],
            buy_key: i,
            token: n[2],
            timestamp: n[3]
        }
    }


    exports.getDemoAudioUrl = function(params) {
        var version = params.apiVersion,

            duration = params.duration,
            domain = params.domain,
            seed = params.seed,
            fileId = params.fileId,
            ep = params.ep,

            file = getEncryptedFileName(seed, fileId),
            p = getEncryptedFileParams(ep);

        p.duration = duration;
        var url = domain + "/download/" + version + file + "?" + querystring.stringify(p);
        return url;
    };

    // }}}



    // ========================================================
    // For xm-sign
    // {{{
    var namespace = {};

    (function(t) {
        var e, n;
        e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
            n = {
                rotl: function(t, e) {
                    return t << e | t >>> 32 - e
                },
                rotr: function(t, e) {
                    return t << 32 - e | t >>> e
                },
                endian: function(t) {
                    if (t.constructor == Number)
                        return 16711935 & n.rotl(t, 8) | 4278255360 & n.rotl(t, 24);
                    for (var e = 0; e < t.length; e++)
                        t[e] = n.endian(t[e]);
                    return t
                },
                randomBytes: function(t) {
                    for (var e = []; 0 < t; t--)
                        e.push(Math.floor(256 * Math.random()));
                    return e
                },
                bytesToWords: function(t) {
                    for (var e = [], n = 0, r = 0; n < t.length; n++,
                        r += 8)
                        e[r >>> 5] |= t[n] << 24 - r % 32;
                    return e
                },
                wordsToBytes: function(t) {
                    for (var e = [], n = 0; n < 32 * t.length; n += 8)
                        e.push(t[n >>> 5] >>> 24 - n % 32 & 255);
                    return e
                },
                bytesToHex: function(t) {
                    for (var e = [], n = 0; n < t.length; n++)
                        e.push((t[n] >>> 4).toString(16)),
                        e.push((15 & t[n]).toString(16));
                    return e.join("")
                },
                hexToBytes: function(t) {
                    for (var e = [], n = 0; n < t.length; n += 2)
                        e.push(parseInt(t.substr(n, 2), 16));
                    return e
                },
                bytesToBase64: function(t) {
                    for (var n = [], r = 0; r < t.length; r += 3)
                        for (var o = t[r] << 16 | t[r + 1] << 8 | t[r + 2], i = 0; i < 4; i++)
                            8 * r + 6 * i <= 8 * t.length ? n.push(e.charAt(o >>> 6 * (3 - i) & 63)) : n.push("=");
                    return n.join("")
                },
                base64ToBytes: function(t) {
                    t = t.replace(/[^A-Z0-9+\/]/gi, "");
                    for (var n = [], r = 0, o = 0; r < t.length; o = ++r % 4)
                        0 != o && n.push((e.indexOf(t.charAt(r - 1)) & Math.pow(2, -2 * o + 8) - 1) << 2 * o | e.indexOf(t.charAt(r)) >>> 6 - 2 * o);
                    return n
                }
            },
            t.Ne = n;
    })(namespace);

    var Ne = namespace.Ne;

    var Le = {
            utf8: {
                stringToBytes: function(t) {
                    return Le.bin.stringToBytes(unescape(encodeURIComponent(t)))
                },
                bytesToString: function(t) {
                    return decodeURIComponent(escape(Le.bin.bytesToString(t)))
                }
            },
            bin: {
                stringToBytes: function(t) {
                    for (var e = [], n = 0; n < t.length; n++)
                        e.push(255 & t.charCodeAt(n));
                    return e
                },
                bytesToString: function(t) {
                    for (var e = [], n = 0; n < t.length; n++)
                        e.push(String.fromCharCode(t[n]));
                    return e.join("")
                }
            }
        },
        Ie = Le;

    function Be(t) {
        return !!t.constructor && "function" == typeof t.constructor.isBuffer && t.constructor.isBuffer(t)
    }

    function Ue() {
        return "undefined" == typeof window
    }

    function Fe(t) {
        return ~~(Math.random() * t)
    }

    function je(t) {
        return null != t && (Be(t) || function(t) {
            return "function" == typeof t.readFloatLE && "function" == typeof t.slice && Be(t.slice(0, 0))
        }(t) || !!t._isBuffer)
    }

    function Ve() {
        var t = 0 < arguments.length && void 0 !== arguments[0] && arguments[0];
        Ue() || window.XM_SERVER_CLOCK && !t || new De(function(t, e) {
            var n = new XMLHttpRequest;
            n.open("GET", "https://www.ximalaya.com/revision/time", !0),
                n.send(null),
                n.onreadystatechange = function() {
                    if (4 === n.readyState) {
                        var e = Number(n.responseText);
                        e = isNaN(e) ? Date.now() : e,
                            t(e)
                    }
                }
        }).then(function(t) {
            We = t,
                window.XM_SERVER_CLOCK = t,
                $e()
        })
    }


    (function(t) {
        var e, n, r, o, i;
        e = Ne,
            n = Ie.utf8,
            r = je,
            o = Ie.bin,
            (i = function(t, a) {
                t.constructor == String ? t = a && "binary" === a.encoding ? o.stringToBytes(t) : n.stringToBytes(t) : r(t) ? t = Array.prototype.slice.call(t, 0) : Array.isArray(t) || (t = t.toString());
                for (var u = e.bytesToWords(t), s = 8 * t.length, c = 1732584193, l = -271733879, f = -1732584194, p = 271733878, h = 0; h < u.length; h++)
                    u[h] = 16711935 & (u[h] << 8 | u[h] >>> 24) | 4278255360 & (u[h] << 24 | u[h] >>> 8);
                u[s >>> 5] |= 128 << s % 32,
                    u[14 + (64 + s >>> 9 << 4)] = s;
                var d = i._ff,
                    v = i._gg,
                    y = i._hh,
                    g = i._ii;
                for (h = 0; h < u.length; h += 16) {
                    var m = c,
                        b = l,
                        w = f,
                        E = p;
                    l = g(l = g(l = g(l = g(l = y(l = y(l = y(l = y(l = v(l = v(l = v(l = v(l = d(l = d(l = d(l = d(l, f = d(f, p = d(p, c = d(c, l, f, p, u[h + 0], 7, -680876936), l, f, u[h + 1], 12, -389564586), c, l, u[h + 2], 17, 606105819), p, c, u[h + 3], 22, -1044525330), f = d(f, p = d(p, c = d(c, l, f, p, u[h + 4], 7, -176418897), l, f, u[h + 5], 12, 1200080426), c, l, u[h + 6], 17, -1473231341), p, c, u[h + 7], 22, -45705983), f = d(f, p = d(p, c = d(c, l, f, p, u[h + 8], 7, 1770035416), l, f, u[h + 9], 12, -1958414417), c, l, u[h + 10], 17, -42063), p, c, u[h + 11], 22, -1990404162), f = d(f, p = d(p, c = d(c, l, f, p, u[h + 12], 7, 1804603682), l, f, u[h + 13], 12, -40341101), c, l, u[h + 14], 17, -1502002290), p, c, u[h + 15], 22, 1236535329), f = v(f, p = v(p, c = v(c, l, f, p, u[h + 1], 5, -165796510), l, f, u[h + 6], 9, -1069501632), c, l, u[h + 11], 14, 643717713), p, c, u[h + 0], 20, -373897302), f = v(f, p = v(p, c = v(c, l, f, p, u[h + 5], 5, -701558691), l, f, u[h + 10], 9, 38016083), c, l, u[h + 15], 14, -660478335), p, c, u[h + 4], 20, -405537848), f = v(f, p = v(p, c = v(c, l, f, p, u[h + 9], 5, 568446438), l, f, u[h + 14], 9, -1019803690), c, l, u[h + 3], 14, -187363961), p, c, u[h + 8], 20, 1163531501), f = v(f, p = v(p, c = v(c, l, f, p, u[h + 13], 5, -1444681467), l, f, u[h + 2], 9, -51403784), c, l, u[h + 7], 14, 1735328473), p, c, u[h + 12], 20, -1926607734), f = y(f, p = y(p, c = y(c, l, f, p, u[h + 5], 4, -378558), l, f, u[h + 8], 11, -2022574463), c, l, u[h + 11], 16, 1839030562), p, c, u[h + 14], 23, -35309556), f = y(f, p = y(p, c = y(c, l, f, p, u[h + 1], 4, -1530992060), l, f, u[h + 4], 11, 1272893353), c, l, u[h + 7], 16, -155497632), p, c, u[h + 10], 23, -1094730640), f = y(f, p = y(p, c = y(c, l, f, p, u[h + 13], 4, 681279174), l, f, u[h + 0], 11, -358537222), c, l, u[h + 3], 16, -722521979), p, c, u[h + 6], 23, 76029189), f = y(f, p = y(p, c = y(c, l, f, p, u[h + 9], 4, -640364487), l, f, u[h + 12], 11, -421815835), c, l, u[h + 15], 16, 530742520), p, c, u[h + 2], 23, -995338651), f = g(f, p = g(p, c = g(c, l, f, p, u[h + 0], 6, -198630844), l, f, u[h + 7], 10, 1126891415), c, l, u[h + 14], 15, -1416354905), p, c, u[h + 5], 21, -57434055), f = g(f, p = g(p, c = g(c, l, f, p, u[h + 12], 6, 1700485571), l, f, u[h + 3], 10, -1894986606), c, l, u[h + 10], 15, -1051523), p, c, u[h + 1], 21, -2054922799), f = g(f, p = g(p, c = g(c, l, f, p, u[h + 8], 6, 1873313359), l, f, u[h + 15], 10, -30611744), c, l, u[h + 6], 15, -1560198380), p, c, u[h + 13], 21, 1309151649), f = g(f, p = g(p, c = g(c, l, f, p, u[h + 4], 6, -145523070), l, f, u[h + 11], 10, -1120210379), c, l, u[h + 2], 15, 718787259), p, c, u[h + 9], 21, -343485551),
                        c = c + m >>> 0,
                        l = l + b >>> 0,
                        f = f + w >>> 0,
                        p = p + E >>> 0
                }
                return e.endian([c, l, f, p])
            })._ff = function(t, e, n, r, o, i, a) {
                var u = t + (e & n | ~e & r) + (o >>> 0) + a;
                return (u << i | u >>> 32 - i) + e
            },
            i._gg = function(t, e, n, r, o, i, a) {
                var u = t + (e & r | n & ~r) + (o >>> 0) + a;
                return (u << i | u >>> 32 - i) + e
            },
            i._hh = function(t, e, n, r, o, i, a) {
                var u = t + (e ^ n ^ r) + (o >>> 0) + a;
                return (u << i | u >>> 32 - i) + e
            },
            i._ii = function(t, e, n, r, o, i, a) {
                var u = t + (n ^ (e | ~r)) + (o >>> 0) + a;
                return (u << i | u >>> 32 - i) + e
            },
            i._blocksize = 16,
            i._digestsize = 16,
            t.He = function(t, n) {
                if (null == t)
                    throw new Error("Illegal argument " + t);
                var r = e.wordsToBytes(i(t, n));
                return n && n.asBytes ? r : n && n.asString ? o.bytesToString(r) : e.bytesToHex(r)
            }
    })(namespace);

    var He = namespace.He;

    exports.getXmSign = function() {
        return function(t) {
            var e = Date.now();
            return ("{himalaya-" + t + "}(" + Fe(100) + ")" + t + "(" + Fe(100) + ")" + e).replace(/{([\w-]+)}/, function(t, e) {
                return He(e)
            })
        }(Ue() ? Date.now() : window.XM_SERVER_CLOCK || 0)
    };

    // }}}
});
