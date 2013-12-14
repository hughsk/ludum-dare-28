var CHIRP = module.exports = {
    frequencies: [ 16.35, 17.32, 18.35, 19.45, 20.6, 21.83, 23.12, 24.5, 25.96, 27.5, 29.14, 30.87 ],
    instruments: {},
    extend: function() {
        for (var t = 1; t < arguments.length; t++) for (var i in arguments[t]) arguments[0][i] = arguments[t][i];
        return arguments[0];
    }
};

CHIRP.Engine = function() {
    this.setTempo(130), this.tracks = [], this.instruments = [], this.position = 0,
    this.length = 0, this.playing = !1, this.range = 0, this.shift = 0, this.volume = .5,
    this.supertime = 0;
}, CHIRP.Engine.prototype = {
    setTempo: function(t) {
        this.bpm = t, this.bps = this.bpm / 60, this.beatDuration = 60 / this.bpm;
    },
    start: function() {
        var t = this, i = window.AudioContext || window.webkitAudioContext;
        return i ? i ? (this.context = new i(), this.output = this.context.createGainNode(),
        this.output.connect(this.context.destination), this.output.gain.value = this.volume,
        this.lastTick = Date.now(), this._step = this.step.bind(this), requestAnimationFrame(this._step),
        this.length = 4, document.addEventListener("webkitvisibilitychange", function() {
            document.webkitHidden ? (t.output.gain.value = 0, t.playing && (t.playing = !1,
            t.paused = !0)) : (t.output.gain.value = t.volume, t.paused && (t.playing = !0,
            t.paused = !1));
        }, !1), !0) : !1 : !1;
    },
    frequency: function(t, i) {
        if ("undefined" == typeof i) {
            var i = 0 | t / CHIRP.frequencies.length, s = t % CHIRP.frequencies.length;
            return CHIRP.frequencies[s] * Math.pow(2, i);
        }
        return CHIRP.frequencies[t] * Math.pow(2, i);
    },
    play: function() {
        this.playing = !0;
    },
    pause: function() {
        this.playing = !1;
        for (var t = 0; t < this.tracks.length; t++) this.tracks[t].instrument.stop(!0);
    },
    step: function() {
        requestAnimationFrame(this._step);
        var t = Date.now(), i = (t - this.lastTick) / 1e3;
        if (this.lastTick = t, !(i > .05)) {
            for (var s = 0; s < this.tracks.length; s++) {
                var n = this.tracks[s];
                n.step(i), n.instrument && n.instrument.step && n.instrument.step(i);
            }
            this.playing && (this.position += this.bps * i), (this.position >= this.length || this.range && this.position > this.range[0] + this.range[1]) && this.restart(),
            this.supertime += i, this.superposition = this.playing ? this.position : this.supertime / this.beatDuration;
        }
    },
    seek: function(t) {
        this.nextIndex = 0, this.position = t;
        for (var i = 0; i < this.tracks.length; i++) this.tracks[i].seek(t);
    },
    restart: function() {
        this.onrestart && this.onrestart(), this.seek(this.range ? this.range[0] : 0, !0);
    }
}, CHIRP.Track = function(t, i) {
    this.engine = t, this.notes = [], this.clips = [], this.queue = [], this.instrument = i.instrument,
    this.index = i.index, this.seek(0);
}, CHIRP.Track.prototype = {
    step: function(t) {
        if (this.engine.playing) {
            for (var i = this.lastIndex; i < this.notes.length; i++) {
                var s = this.notes[i];
                s.start > this.position || (s.played ? !s.finished && s.start + s.duration < this.position && (s.finished = !0,
                this.instrument.stop(s.key), s.start + s.duration <= this.maxPosition) : (s.played = !0,
                this.instrument.play(s), s.start + s.duration > this.maxPosition && (this.maxPosition = s.start + s.duration)));
            }
            this.position += this.engine.bps * t;
        }
    },
    seek: function(t, i) {
        this.lastIndex = 0, this.position = t, this.instrument && this.instrument.stop(!i),
        this.maxPosition = 0;
        for (var s = 0; s < this.notes.length; s++) {
            var n = this.notes[s];
            n.played = n.start < this.position, n.finished = n.start + n.duration < this.position;
        }
    }
}, CHIRP.Engine.prototype.open = function(t) {
    this.tracks = [], this.meta = t.meta || {};
    for (var i = 0; i < t.tracks.length; i++) {
        var s = t.tracks[i], n = new CHIRP.instruments[s.instrumentPlugin](this, s.instrumentData), e = new CHIRP.Track(this, {
            index: i,
            instrument: n
        });
        n.pluginName = s.instrumentPlugin, e.notes = s.notes, e.clips = s.clips, this.tracks.push(e);
    }
    this.length = t.length || 16, this.setTempo(t.bpm), this.seek(0);
};

!function() {
    var t = {};
    t.sin = function(t, n, e) {
        e = e || 1;
        for (var a = 2 * Math.PI / n, r = 0; n > r; r++) t[r] = Math.sin(r * a * e);
    }, t.white = function(t, n) {
        for (var e = 0; n > e; e++) t[e] = 2 * Math.random() - 1;
    }, t.pink = function(t, n) {
        var e, a, r, i, s, o, h;
        e = a = r = i = s = o = h = 0;
        for (var u = 0; n > u; u++) {
            var f = 2 * Math.random() - 1;
            e = .99886 * e + .0555179 * f, a = .99332 * a + .0750759 * f, r = .969 * r + .153852 * f,
            i = .8665 * i + .3104856 * f, s = .55 * s + .5329522 * f, o = -.7616 * o - .016898 * f,
            t[u] = e + a + r + i + s + o + h + .5362 * f, t[u] *= .11, h = .115926 * f;
        }
    }, t.brown = function(t, n) {
        for (var e = 0, a = 0; n > a; a++) {
            var r = 2 * Math.random() - 1;
            t[a] = (e + .02 * r) / 1.02, e = t[a], t[a] *= 3.5;
        }
    }, t.add = function(n, e, a) {
        for (var r = t.generateAudioSample(e), i = t.generateAudioSample(a), s = Math.min(r.length, i.length), o = 0; s > o; ++o) n[o] = r[o] + i[o];
    }, t.gain = function(t, n) {
        for (var e = t.length, a = 0; e > a; ++a) t[a] *= n;
    }, t.sampleRate = function(n, e) {
        t.currentSampleRate = e;
    }, t.distort = function(t) {
        for (var n = t.length, e = 0; n > e; ++e) t[e] = Math.abs(t[e]) < .3 ? 2 * t[e] : t[e] / 2 + .4 * (t[e] > 0 ? 1 : -1);
    }, t.sinDistort = function(t, n) {
        for (var e = t.length, a = Math.PI * n / 2, r = 0; e > r; ++r) t[r] = Math.sin(t[r] * a);
    }, t.envelope = function(t, n, e, a, r) {
        var i = t.length;
        n *= i, e *= i, r *= i;
        for (var s = 1 - a, o = 0; n > o; ++o) t[o] *= o / n;
        for (;n + e > o; ++o) t[o] *= (1 - (o - n) / e) * s + a;
        for (;i - r > o; ++o) t[o] *= a;
        for (var h = o; i > o; ++o) t[o] *= a * (1 - (o - h) / r);
    }, t.decay = function(t, n) {
        for (var e = t.length, a = 4 * n, r = 0; e > r; ++r) t[r] *= Math.exp(-r / e * a);
    }, t.resonantFilter = function(n, e, a, r, i) {
        var s = n.length, o = 2 * e / t.currentSampleRate * Math.PI, h = Math.cos(o) * a;
        Math.sin(o) * a;
        var u = Math.cos(o) * r;
        Math.sin(o) * r;
        for (var f = 1, l = -2 * h, c = a, p = 1, v = -2 * u, m = r, g = 0, d = 0, M = 0, S = 0, y = 0; s > y; ++y) {
            var C = (p * n[y] + v * M + m * S - l * g - c * d) / f * i;
            S = M, M = n[y], d = g, g = C, n[y] = C;
        }
    }, t.sweep = function(n, e, a, r) {
        for (var i = 2 * Math.PI * a / t.currentSampleRate, s = 2 * Math.PI * r / t.currentSampleRate, o = (s - i) / e, h = i, u = 0, f = 0; e > f; ++f) n[f] = Math.sin(u),
        u += h, h += o;
    }, t.noise = function(n, e) {
        return t.white(n, e);
    }, t.generateAudioSample = function(n) {
        for (var e = [], a = 0; a < n.length; ++a) {
            var r = t[n[a].shift()], i = n[a];
            i.unshift(e), r.apply(this, i);
        }
        return e;
    }, CHIRP.instruments.drumkit = function(t, n) {
        this.plugin = n.plugin, this.engine = t, this.raw = {}, this.volume = n.volume || .5,
        this.data = n.samples ? n.samples : CHIRP.instruments.drumkit.presets ? CHIRP.instruments.drumkit.presets[0] : {},
        this.samples = {}, this.channels = new Array(8), this.currentChannel = 0;
        for (var e = 0; 8 > e; e++) this.channels[e] = this.engine.context.createBuffer(1, 44100, 44100);
        this.buffers = [];
        for (var a in this.data) this.createSample(a);
    }, CHIRP.instruments.drumkit.prototype = {
        createSample: function(n) {
            if (t.currentSampleRate = 44100, this.data[n]) {
                var e = JSON.parse(JSON.stringify(this.data[n] || "[]")), a = t.generateAudioSample(e);
                this.raw[n] = a, this.buffers[n] = new Float32Array(44100);
                for (var r = 0; r < a.length; r++) this.buffers[n][r] = a[r];
                this.onsampleready && this.onsampleready();
            }
        },
        step: function(t) {
            this.lifespan > 0 && (this.lifespan -= t, this.lifespan <= 0);
        },
        noteon: function(t) {
            this.currentChannel = (this.currentChannel + 1) % 8;
            for (var n = this.channels[this.currentChannel].getChannelData(0), e = 44100, a = this.buffers[t], r = 0; e > r; r++) n[r] = a[r];
            var i = this.engine.context.createBufferSource();
            i.buffer = this.channels[this.currentChannel], i.gain.value = this.volume, i.connect(this.engine.output),
            i.noteOn(0);
        },
        play: function(t) {
            var n = t.key % 12;
            this.samples[n], this.noteon(n), this.onnote && this.onnote(t, n);
        },
        save: function() {
            return {
                volume: this.volume,
                samples: this.data
            };
        },
        stop: function() {}
    };
}();
