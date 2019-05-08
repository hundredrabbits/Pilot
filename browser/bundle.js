var Pilot = (function () {
  'use strict';

  const dgram = require('dgram');

  function Listener (pilot) {
    this.server = dgram.createSocket('udp4');

    this.server.on('message', (msg, rinfo) => {
      pilot.mixer.run(`${msg}`);
    });

    this.server.on('listening', () => {
      const address = this.server.address();
      console.log(`Server listening for UDP:\n ${address.address}:${address.port}`);
    });

    this.server.on('error', (err) => {
      console.log(`Server error:\n ${err.stack}`);
      server.close();
    });

    this.server.bind(49161); // TODO - make this configurable
  }

  var listener = Listener;

  const Tone = require('tone');

  function Interface (pilot, id, node) {
    this.node = node;
    this.meter = new Tone.Meter(0.95);
    this.waveform = new Tone.Waveform(256);

    this.el = document.createElement('div');
    this.el.id = `ch${id}`;
    this.canvas = document.createElement('canvas');

    const self = this;

    const waveform = this.waveform;
    const meter = this.meter;
    const canvasWidth = 13 * 4;
    const canvasHeight = 13 * 2;
    const context = this.canvas.getContext('2d');

    let lastUpdate = null;

    this.install = function (host) {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
      this.canvas.style.width = (canvasWidth / 2) + 'px';
      this.canvas.style.height = (canvasHeight / 2) + 'px';

      context.lineJoin = 'round';
      context.lineWidth = 2;
      context.strokeStyle = pilot.theme.active.f_high;

      this.node.connect(this.meter);
      this.node.fan(this.waveform);
      this.el.appendChild(this.canvas);
      host.appendChild(this.el);
    };

    this.start = function () {
      this.updateAll({}, true);
      loop();
    };

    this.connect = function (node) {
      this.node.connect(node);
    };

    function draw (level) {
      if (pilot.animate !== true) { return }
      if (lastUpdate && performance.now() - lastUpdate < 30) { return }

      context.clearRect(0, 0, canvasWidth, canvasHeight);

      drawActivity();
      drawWaveform();

      lastUpdate = performance.now();
    }

    function drawWaveform () {
      const values = waveform.getValue();
      const level = meter.getLevel();
      const gain = Tone.dbToGain(level);

      context.beginPath();
      context.moveTo(0, parseInt(((values[0] + 1) / 2) * canvasHeight));

      if (gain > 0.01) {
        for (let i = 1, len = values.length; i < len; i++) {
          if (i % 17 !== 0) { continue }
          const x = parseInt(canvasWidth * (i / len));
          const y = parseInt(((values[i] + 1) / 2) * canvasHeight);
          context.lineTo(clamp(x, 2, canvasWidth - 2), clamp(y, 2, canvasHeight - 2));
        }
      }

      context.lineTo(canvasWidth, parseInt(((values[0] + 1) / 2) * canvasHeight));

      context.stroke();
      context.closePath();
    }

    function drawActivity () {
      if (!self) { return }
      if (!self.lastNote) { return }

      const elapsed = performance.now() - self.lastNote;
      const max = 500;

      context.beginPath();
      context.arc(2, 4, 2, 0, 2 * Math.PI, false);
      context.fillStyle = `rgba(255,255,255,${(1 - (elapsed / max))})`;
      context.fill();
      context.closePath();
    }

    function loop () {
      requestAnimationFrame(loop);
      draw();
    }

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var _interface = Interface;

  const Tone$1 = require('tone');


  const OCTAVE = ['C', 'c', 'D', 'd', 'E', 'F', 'f', 'G', 'g', 'A', 'a', 'B'];
  const MAJOR = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const MINOR = ['c', 'd', 'F', 'f', 'g', 'a', 'C'];
  const WAVCODES = ['si', 'tr', 'sq', 'sw', '2i', '2r', '2q', '2w', '4i', '4r', '4q', '4w', '8i', '8r', '8q', '8w'];
  const WAVNAMES = ['sine', 'triangle', 'square', 'sawtooth', 'sine2', 'triangle2', 'square2', 'sawtooth2', 'sine4', 'triangle4', 'square4', 'sawtooth4', 'sine8', 'triangle8', 'square8', 'sawtooth8'];

  function ChannelInterface (pilot, id, node) {
    _interface.call(this, pilot, id, node, true);

    this.node = node;

    this.el = document.createElement('div');
    this.el.id = `ch${id.toString(16)}`;
    this.el.className = 'channel';
    this.cid_el = document.createElement('span');
    this.cid_el.className = `cid`;
    this.env_el = document.createElement('span');
    this.env_el.className = `env`;
    this.osc_el = document.createElement('span');
    this.osc_el.className = `osc`;

    this.cid_el.innerHTML = `${str36(id)}`;

    this.el.appendChild(this.cid_el);
    this.el.appendChild(this.env_el);
    this.el.appendChild(this.osc_el);
    this.el.appendChild(this.canvas);

    // Run

    this.run = function (msg) {
      const channel = `${msg}`.substr(0, 1);
      if (int36(channel) === id) {
        this.operate(`${msg}`.substr(1));
      }
    };

    this.operate = function (msg) {
      const data = parse(`${msg}`);
      if (!data) { console.warn(`Unknown data`); return }
      if (data.isEnv) {
        this.setEnv(data);
      } else if (data.isOsc) {
        this.setOsc(data);
      } else if (data.isNote) {
        this.playNote(data);
      } else if (data.isRen) {
        this.randEnv();
      } else if (data.isRos) {
        this.randOsc();
      }
    };

    this.playNote = function (data) {
      if (isNaN(data.octave)) { return }
      if (OCTAVE.indexOf(data.note) < 0) { console.warn(`Unknown Note`); return }
      if (this.lastNote && performance.now() - this.lastNote < 100) { return }
      const name = `${data.note}${data.sharp}${data.octave}`;
      const length = clamp(data.length, 0.1, 0.9);
      this.node.triggerAttackRelease(name, length, '+0', data.velocity);
      this.lastNote = performance.now();
    };

    this.setEnv = function (data) {
      if (this.lastEnv && performance.now() - this.lastEnv < 100) { return }
      if (!this.node.envelope) { return }
      if (id > 11) { return }
      if (!isNaN(data.attack)) { this.node.envelope.attack = clamp(data.attack, 0.01, 1.0); }
      if (!isNaN(data.decay)) { this.node.envelope.decay = clamp(data.decay, 0.01, 1.0); }
      if (!isNaN(data.sustain)) { this.node.envelope.sustain = clamp(data.sustain, 0.01, 1.0); }
      if (!isNaN(data.release)) { this.node.envelope.release = clamp(data.release, 0.01, 1.0); }
      this.lastEnv = performance.now();
      this.updateEnv(data);
    };

    this.setOsc = function (data) {
      if (this.lastOsc && performance.now() - this.lastOsc < 100) { return }
      if (data.wav && this.node.oscillator) {
        this.node.oscillator._oscillator.set('type', data.wav);
      }
      if (data.mod && this.node.modulation) {
        this.node.modulation._oscillator.set('type', data.mod);
      }
      this.lastOsc = performance.now();
      this.updateOsc(data);
    };

    // Updates

    this.updateAll = function (data, force = false) {
      this.updateEnv(data, force);
      this.updateOsc(data, force);
    };

    this.updateEnv = function (data, force = false) {
      if (pilot.animate !== true) { return }
      if (force !== true && (!data || !data.isEnv)) { return }
      if (!this.node.envelope) { return }
      setContent(this.env_el, `${to16(this.node.envelope.attack)}${to16(this.node.envelope.decay)}${to16(this.node.envelope.sustain)}${to16(this.node.envelope.release)}`);
    };

    this.updateOsc = function (data, force = false) {
      if (pilot.animate !== true) { return }
      if (force !== true && (!data || !data.isOsc)) { return }
      setContent(this.osc_el, `${this.node.oscillator ? wavCode(this.node.oscillator._oscillator.type) : '--'}${this.node.modulation ? wavCode(this.node.modulation._oscillator.type) : '--'}`);
    };

    this.randEnv = function () {
      const a = to16(Math.random() * 0.25);
      const s = to16(Math.random() * 0.5);
      const d = to16(Math.random() * 0.75);
      const r = to16(Math.random() * 1);
      this.operate(`env${a}${s}${d}${r}`);
    };

    this.randOsc = function () {
      const a = WAVCODES[parseInt(Math.random() * WAVCODES.length)];
      const b = WAVCODES[parseInt(Math.random() * WAVCODES.length)];
      this.operate(`osc${a}${b}`);
    };

    // Parsers

    function parse (msg) {
      const cmd = msg.substr(0, 3).toLowerCase();
      const val = msg.substr(3);
      if (cmd === 'osc') {
        return parseOsc(val)
      } else if (cmd === 'env') {
        return parseEnv(val)
      } else if (cmd === 'ren') {
        return { isRen: true }
      } else if (cmd === 'ros') {
        return { isRos: true }
      }
      return parseNote(msg)
    }

    function parseNote (msg) {
      if (msg.length < 2) { console.warn(`Misformatted note`); return }
      const octave = clamp(parseInt(msg.substr(0, 1)), 0, 8);
      const note = msg.substr(1, 1);
      const velocity = msg.length >= 3 ? from16(msg.substr(2, 1)) : 0.66;
      const length = msg.length === 4 ? from16(msg.substr(3, 1)) : 0.1;
      const transposed = transpose(octave, note);
      return { isNote: true, octave: transposed.octave, note: transposed.note, sharp: isUpperCase(transposed.note) === false ? '#' : '', string: `${octave}${note}`, length: length, velocity: velocity }
    }

    function parseEnv (msg) {
      if (msg.length < 1) { console.warn(`Misformatted env`); return }
      const attack = int36(msg.substr(0, 1)) / 15;
      const decay = msg.length > 1 ? int36(msg.substr(1, 1)) / 15 : null;
      const sustain = msg.length > 2 ? int36(msg.substr(2, 1)) / 15 : null;
      const release = msg.length > 3 ? int36(msg.substr(3, 1)) / 15 : null;
      return { isEnv: true, attack: attack, decay: decay, sustain: sustain, release: release, string: 'env' }
    }

    function parseOsc (msg) {
      if (msg.length < 2) { console.warn(`Misformatted osc`); return }
      return { isOsc: true, wav: (msg.length > 1 ? wavName(msg.substr(0, 2)) : null), mod: (msg.length > 3 ? wavName(msg.substr(2, 2)) : null), string: 'osc' }
    }

    // Tools

    function transpose (octave, note) {
      if (OCTAVE.indexOf(note) > -1) { return { octave, note } }
      const noteArray = isUpperCase(note) === true ? MAJOR : MINOR;
      const noteIndex = letterValue(note) - 7;
      const noteMod = noteArray[noteIndex % noteArray.length];
      const octaveMod = Math.floor(noteIndex / noteArray.length) + 1;
      return { octave: octave + octaveMod, note: noteMod === 'e' ? 'F' : noteMod === 'b' ? 'C' : noteMod }
    }

    // Wave Codes

    function wavCode (n) {
      const name = n.toLowerCase();
      const index = WAVNAMES.indexOf(name);
      return index > -1 ? WAVCODES[index] : '??'
    }

    function wavName (c) {
      const code = c.toLowerCase();
      const index = WAVCODES.indexOf(code);
      return index > -1 ? WAVNAMES[index] : 'sine'
    }

    // Helpers
    function letterValue (c) { return c.toLowerCase().charCodeAt(0) - 97 }
    function isUpperCase (s) { return `${s}`.toUpperCase() === `${s}` }
    function from16 (str) { return (int36(str) / 15) }
    function to16 (float) { return str36(Math.floor(float * 15)) }
    function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
    function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str.toLowerCase()}`) }
    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
    function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct; } }
  }

  var interface_channel = ChannelInterface;

  const Tone$2 = require('tone');


  function EffectInterface (pilot, id, node) {
    _interface.call(this, pilot, id, node, true);

    this.node = node;
    if (this.node.wet) {
      this.node.wet.value = 0;
    }

    this.el = document.createElement('div');
    this.el.id = `ch${id}`;
    this.el.className = 'effect';
    this.cid_el = document.createElement('span');
    this.cid_el.className = `cid`;
    this.val_el = document.createElement('span');
    this.val_el.className = `val`;

    this.cid_el.innerHTML = `${id}`;

    this.el.appendChild(this.cid_el);
    this.el.appendChild(this.val_el);

    // Run

    this.run = function (msg) {
      if (!msg || msg.substr(0, 3).toLowerCase() !== id) { return }

      if (msg.substr(0, 3).toLowerCase() === id) {
        this.operate(`${msg}`.substr(3));
      }
    };

    this.operate = function (msg) {
      const data = parse(`${msg}`);
      if (!data) { console.warn(`Unknown data`); return }
      this.setEffect(data);
    };

    this.setEffect = function (data) {
      if (this.lastEffect && performance.now() - this.lastEffect < 100) { return }

      if (this.node.wet) {
        this.node.wet.value = data.wet;
      }

      if (!isNaN(data.value)) {
        if (data.code === 'rev') {
          this.node.roomSize.value = data.value;
        } else if (data.code === 'dis') {
          this.node.distortion = data.value;
        } else if (data.code === 'bit') {
          this.node.bits = clamp(parseInt(data.value * 8), 1, 8);
        } else if (data.code === 'cho') {
          this.node.depth = data.value;
        } else if (data.code === 'fee') {
          this.node.delayTime.value = data.value;
        } else if (data.code === 'tre') {
          this.node.depth.value = data.value;
        } else if (data.code === 'vib') {
          this.node.depth.value = data.value;
        } else if (data.code === 'aut') {
          this.node.depth.value = data.value;
        } else if (data.code === 'pha') {
          this.node.octaves = clamp(parseInt(data.value * 3), 0, 8);
        } else if (data.code === 'wah') {
          this.node.octaves = clamp(parseInt(data.value * 6), 0, 8);
        } else if (data.code === 'che') {
          this.node.order = clamp(parseInt(data.value * 100), 0, 8);
        } else {
          console.warn('Unknown value', this.node);
        }
      }
      this.lastEffect = performance.now();
      this.updateEffect(data, true);
    };

    this.rand = function () {
      this.operate(`${to16(Math.random() * 0.5)}${to16(Math.random() * 1)}`);
    };

    // Updates

    this.updateAll = function (data, force = false) {
      this.updateEffect(data, force);
    };

    this.updateEffect = function (data, force = false) {
      if (pilot.animate !== true) { return }
      if (force !== true && (!data || !data.isEffect)) { return }

      let value = 0;
      if (id === 'rev') {
        value = this.node.roomSize.value;
      } else if (id === 'dis') {
        value = this.node.distortion;
      } else if (id === 'cho') {
        value = this.node.depth;
      } else if (id === 'bit') {
        value = this.node.bits / 8;
      } else if (id === 'fee') {
        value = this.node.delayTime.value;
      } else if (id === 'tre') {
        value = this.node.depth.value;
      } else if (id === 'vib') {
        value = this.node.depth.value;
      } else if (id === 'aut') {
        value = this.node.depth.value;
      } else if (id === 'pha') {
        value = this.node.octaves / 3;
      } else if (id === 'wah') {
        value = this.node.octaves / 6;
      } else if (id === 'che') {
        value = this.node.order / 100;
      }

      if (this.node.wet) {
        setContent(this.val_el, `${to16(this.node.wet.value)}${to16(value)}`);
      }
    };

    // Parsers

    function parse (msg) {
      if (msg.length !== 2 && msg.length !== 1) { console.warn(`Misformatted effect`, msg); return }
      const wet = int36(msg.substr(0, 1)) / 15;
      const value = int36(msg.substr(1, 1)) / 15;
      return { isEffect: true, code: id, wet: wet, value: value }
    }
    function to16 (float) { return str36(Math.floor(float * 15)) }
    function str36 (int) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'][parseInt(int)] }
    function int36 (str) { return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].indexOf(`${str}`) }
    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }

    // Dom Tools
    function setContent (el, ct) { if (el.innerHTML !== ct) { el.innerHTML = ct; } }
  }

  var interface_effect = EffectInterface;

  const Tone$3 = require('tone');



  function Mixer (pilot) {
    this.el = document.createElement('div');
    this.el.id = 'mixer';

    this.channels = [];
    this.effects = {};

    this.install = function (host) {
      console.log('Mixer', 'Installing..');

      Tone$3.start();
      Tone$3.Transport.start();

      // AM
      this.channels[0] = new interface_channel(pilot, 0, new Tone$3.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine8' }, 'modulation': { 'type': 'sine' } }));
      this.channels[1] = new interface_channel(pilot, 1, new Tone$3.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle8' }, 'modulation': { 'type': 'sawtooth' } }));
      this.channels[2] = new interface_channel(pilot, 2, new Tone$3.AMSynth({ 'harmonicity': 1.75, 'oscillator': { 'type': 'sawtooth8' }, 'modulation': { 'type': 'triangle' } }));
      this.channels[3] = new interface_channel(pilot, 3, new Tone$3.AMSynth({ 'harmonicity': 2, 'oscillator': { 'type': 'square8' }, 'modulation': { 'type': 'square' } }));
      // AM
      this.channels[4] = new interface_channel(pilot, 4, new Tone$3.AMSynth({ 'harmonicity': 1.25, 'oscillator': { 'type': 'sine4' }, 'modulation': { 'type': 'square8' } }));
      this.channels[5] = new interface_channel(pilot, 5, new Tone$3.AMSynth({ 'harmonicity': 1.5, 'oscillator': { 'type': 'triangle4' }, 'modulation': { 'type': 'sawtooth8' } }));
      this.channels[6] = new interface_channel(pilot, 6, new Tone$3.FMSynth({ 'harmonicity': 1.75, 'modulationIndex': 10, 'oscillator': { 'type': 'sawtooth4' }, 'modulation': { 'type': 'triangle8' } }));
      this.channels[7] = new interface_channel(pilot, 7, new Tone$3.FMSynth({ 'harmonicity': 2, 'modulationIndex': 20, 'oscillator': { 'type': 'square4' }, 'modulation': { 'type': 'sine8' } }));
      // FM
      this.channels[8] = new interface_channel(pilot, 8, new Tone$3.FMSynth({ 'harmonicity': 0.5, 'modulationIndex': 30, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'sawtooth4' } }));
      this.channels[9] = new interface_channel(pilot, 9, new Tone$3.FMSynth({ 'harmonicity': 2.5, 'modulationIndex': 40, 'oscillator': { 'type': 'sine' }, 'modulation': { 'type': 'triangle8' } }));
      this.channels[10] = new interface_channel(pilot, 10, new Tone$3.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sawtooth4' } }));
      this.channels[11] = new interface_channel(pilot, 11, new Tone$3.MonoSynth({ 'volume': -20, oscillator: { 'type': 'sine4' } }));
      // Membrane
      this.channels[12] = new interface_channel(pilot, 12, new Tone$3.MembraneSynth({ 'octaves': 5, 'oscillator': { 'type': 'sine' } }));
      this.channels[13] = new interface_channel(pilot, 13, new Tone$3.MembraneSynth({ 'octaves': 10, 'oscillator': { 'type': 'sawtooth' } }));
      this.channels[14] = new interface_channel(pilot, 14, new Tone$3.MembraneSynth({ 'octaves': 15, 'oscillator': { 'type': 'triangle' } }));
      this.channels[15] = new interface_channel(pilot, 15, new Tone$3.MembraneSynth({ 'octaves': 20, 'oscillator': { 'type': 'square' } }));

      // I
      this.effects.bitcrusher = new interface_effect(pilot, 'bit', new Tone$3.BitCrusher(4));
      this.effects.distortion = new interface_effect(pilot, 'dis', new Tone$3.Distortion(0.05));
      this.effects.autowah = new interface_effect(pilot, 'wah', new Tone$3.AutoWah(100, 6, 0));
      this.effects.chebyshev = new interface_effect(pilot, 'che', new Tone$3.Chebyshev(50));
      // II
      this.effects.feedback = new interface_effect(pilot, 'fee', new Tone$3.FeedbackDelay(0));
      this.effects.delay = new interface_effect(pilot, 'del', new Tone$3.PingPongDelay('4n', 0.2));
      this.effects.tremolo = new interface_effect(pilot, 'tre', new Tone$3.Tremolo());
      this.effects.reverb = new interface_effect(pilot, 'rev', new Tone$3.JCReverb(0));
      // III
      this.effects.phaser = new interface_effect(pilot, 'pha', new Tone$3.Phaser(0.5, 3, 350));
      this.effects.vibrato = new interface_effect(pilot, 'vib', new Tone$3.Vibrato());
      this.effects.chorus = new interface_effect(pilot, 'cho', new Tone$3.Chorus(4, 2.5, 0.5));
      this.effects.widener = new interface_effect(pilot, 'ste', new Tone$3.StereoWidener(0.5, 3, 350));
      // Mastering
      this.effects.equalizer = new interface_effect(pilot, 'equ', new Tone$3.EQ3(5, 0, 5));
      this.effects.compressor = new interface_effect(pilot, 'com', new Tone$3.Compressor(-6, 4));
      this.effects.volume = new interface_effect(pilot, 'vol', new Tone$3.Volume(6));
      this.effects.limiter = new interface_effect(pilot, 'lim', new Tone$3.Limiter(-2));

      // Connect
      for (const id in this.channels) {
        this.channels[id].connect(this.effects.bitcrusher.node);
      }

      this.effects.bitcrusher.connect(this.effects.distortion.node);
      this.effects.distortion.connect(this.effects.autowah.node);
      this.effects.autowah.connect(this.effects.chebyshev.node);
      this.effects.chebyshev.connect(this.effects.feedback.node);

      this.effects.feedback.connect(this.effects.delay.node);
      this.effects.delay.connect(this.effects.tremolo.node);
      this.effects.tremolo.connect(this.effects.reverb.node);
      this.effects.reverb.connect(this.effects.phaser.node);

      this.effects.phaser.connect(this.effects.vibrato.node);
      this.effects.vibrato.connect(this.effects.chorus.node);
      this.effects.chorus.connect(this.effects.widener.node);
      this.effects.widener.connect(this.effects.equalizer.node);

      this.effects.equalizer.connect(this.effects.compressor.node);
      this.effects.compressor.connect(this.effects.volume.node);
      this.effects.volume.connect(this.effects.limiter.node);

      // Add all instruments to dom
      for (const id in this.channels) {
        this.channels[id].install(this.el);
      }

      // Add all effects to dom
      for (const id in this.effects) {
        this.effects[id].install(this.el);
      }

      host.appendChild(this.el);
    };

    this.start = function () {
      console.log('Synthetiser', 'Starting..');
      for (const id in this.channels) {
        this.channels[id].start();
      }
      for (const id in this.effects) {
        this.effects[id].start();
      }

      // Create Env Presets
      for (const id in this.channels) {
        this.channels[id].setEnv({ isEnv: true,
          attack: 0.001,
          decay: clamp(((8 - (id % 8)) / 8), 0.01, 0.9),
          sustain: clamp(((id % 4) / 4), 0.01, 0.9),
          release: clamp(((id % 6) / 6), 0.01, 0.9)
        });
      }

      this.setSpeed(120);
      setTimeout(() => { this.effects.limiter.node.toMaster(); },2000);
      this.run();
    };

    this.run = function (msg) {
      // Multi
      if (`${msg}`.indexOf(';') > -1) {
        const parts = `${msg}`.split(';');
        for (const id in parts) {
          this.run(parts[id]);
        }
        return
      }
      // Single
      for (const id in this.channels) {
        this.channels[id].run(msg);
      }
      for (const id in this.effects) {
        this.effects[id].run(msg);
      }
      // Special
      if (msg && `${msg}`.substr(0, 3).toLowerCase() === 'bpm') {
        this.setSpeed(msg.substr(3));
      }
      // Special
      if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'renv') {
        for (const id in this.channels) {
          this.channels[id].randEnv();
        }
      }
      if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'rosc') {
        for (const id in this.channels) {
          this.channels[id].randOsc();
        }
      }
      if (msg && `${msg}`.substr(0, 4).toLowerCase() === 'refx') {
        for (const id in this.effects) {
          this.effects[id].rand(msg);
        }
      }
    };

    this.setSpeed = function (bpm) {
      if (parseInt(bpm) < 30) { return }
      Tone$3.Transport.bpm.rampTo(parseInt(bpm), 4);
      console.log(`Changed BPM to ${bpm}.`);
      pilot.recorder.el.innerHTML = `${bpm}`;
    };

    function clamp (v, min, max) { return v < min ? min : v > max ? max : v }
  }

  var mixer = Mixer;

  const { dialog, app } = require('electron').remote;
  const Tone$4 = require('tone');
  const fs = require('fs');

  function Recorder (pilot) {
    this.el = document.createElement('div');
    this.el.id = 'recorder';
    this.el.className = 'blink';
    this.el.textContent = '•';
    this.isRecording = false;

    let chunks = [];

    this.install = function (host) {
      console.log('Recorder', 'Installing..');

      pilot.mixer.hook = Tone$4.context.createMediaStreamDestination();
      pilot.mixer.recorder = new MediaRecorder(pilot.mixer.hook.stream);
      pilot.mixer.effects.limiter.connect(pilot.mixer.hook);

      pilot.mixer.recorder.onstop = evt => {
        const blob = new Blob(chunks, { type: 'audio/opus; codecs=opus' });
        pilot.recorder.save(blob);
      };

      pilot.mixer.recorder.ondataavailable = evt => {
        chunks.push(evt.data);
      };

      host.appendChild(this.el);
    };

    this.start = function () {
      console.log('Recorder', 'Starting..');
      this.isRecording = true;
      chunks = [];
      pilot.mixer.recorder.start();
      pilot.el.className = 'recording';
    };

    this.stop = function () {
      if (!this.isRecording) { return }

      console.log('Recorder', 'Stopping..');
      this.isRecording = false;
      pilot.mixer.recorder.stop();
      pilot.el.className = '';
    };

    this.toggle = function () {
      if (this.isRecording !== true) {
        this.start();
      } else {
        this.stop();
      }
    };

    this.save = function (blob) {
      dialog.showSaveDialog({ filters: [{ name: 'Audio File', extensions: ['opus'] }] }, (path) => {
        if (path === undefined) { return }
        pilot.recorder.write(path, blob);
      });
    };

    this.write = function (path, blob) {
      const reader = new FileReader();
      reader.onload = function () {
        const buffer = new Buffer.from(reader.result);
        fs.writeFile(path, buffer, {}, (err, res) => {
          if (err) { console.error(err); return }
          console.log('Recorder', 'Export complete.');
        });
      };
      reader.readAsArrayBuffer(blob);
    };
  }

  var recorder = Recorder;

  function Commander (pilot) {
    this.el = document.createElement('div');
    this.el.id = 'commander';

    this.input = document.createElement('input');

    // History of commands entered.
    this.history = [];

    // Index of history command to show in input.
    this.historyIndex = 0;

    // Holds whether the user is browsing the history or not.
    this.isBrowsingHistory = false;

    this.install = function (host) {
      this.el.appendChild(this.input);
      host.appendChild(this.el);
    };

    this.start = function () {
      this.input.focus();
    };

    this.input.oninput = (e) => {

    };

    this.input.onkeydown = (e) => {
      switch (e.keyCode) {
        case 40: // Down
          e.preventDefault();
          if (!this.isBrowsingHistory) {
            return
          }

          if (this.history.length) {
            if (this.historyIndex === this.history.length - 1) {
              this.isBrowsingHistory = false;
              this.input.value = '';
              return
            }

            this.historyIndex += 1;
            this.input.value = this.history[this.historyIndex];
          }
          break
        case 38: // Up
          e.preventDefault();
          if (!this.isBrowsingHistory) {
            this.historyIndex = this.history.length;
          }

          this.isBrowsingHistory = true;
          if (this.history.length && this.historyIndex > 0) {
            this.historyIndex -= 1;
            this.input.value = this.history[this.historyIndex];
          }

          break
      }
    };

    this.input.onkeypress = (e) => {
      if (e.keyCode !== 13) { return }
      e.preventDefault();
      this.isBrowsingHistory = false;
      this.history.push(this.input.value);
      pilot.mixer.run(this.input.value);
      this.input.value = '';
    };
  }

  var commander = Commander;

  function Theme (_default) {
    const themer = this;

    this.active = _default;

    this.el = document.createElement('style');
    this.el.type = 'text/css';

    this.install = function (host = document.body, callback) {
      console.log('Theme', 'Installing..');
      host.appendChild(this.el);
      this.callback = callback;
    };

    this.start = function () {
      console.log('Theme', 'Starting..');
      if (isJson(localStorage.theme)) {
        const storage = JSON.parse(localStorage.theme);
        if (validate(storage)) {
          console.log('Theme', 'Found theme in localStorage!');
          this.load(storage);
          return
        }
      }
      this.load(_default);
    };

    this.load = function (data) {
      const theme = parse(data);
      if (!validate(theme)) { console.warn('Theme', 'Not a theme', theme); return }
      console.log('Theme', `Loading theme with background ${theme.background}.`);
      this.el.innerHTML = `:root { --background: ${theme.background}; --f_high: ${theme.f_high}; --f_med: ${theme.f_med}; --f_low: ${theme.f_low}; --f_inv: ${theme.f_inv}; --b_high: ${theme.b_high}; --b_med: ${theme.b_med}; --b_low: ${theme.b_low}; --b_inv: ${theme.b_inv}; }`;
      localStorage.setItem('theme', JSON.stringify(theme));
      this.active = theme;
      if (this.callback) {
        this.callback();
      }
    };

    this.reset = function () {
      this.load(_default);
    };

    function parse (any) {
      if (any && any.background) { return any } else if (any && any.data) { return any.data } else if (any && isJson(any)) { return JSON.parse(any) } else if (any && isHtml(any)) { return extract(any) }
      return null
    }

    // Drag

    this.drag = function (e) {
      e.stopPropagation();
      e.preventDefault();
      e.dataTransfer.dropEffect = 'copy';
    };

    this.drop = function (e) {
      e.preventDefault();
      e.stopPropagation();
      const file = e.dataTransfer.files[0];
      if (!file || !file.name) { console.warn('Theme', 'Unnamed file.'); return }
      if (file.name.indexOf('.thm') < 0 && file.name.indexOf('.svg') < 0) { console.warn('Theme', 'Skipped, not a theme'); return }
      const reader = new FileReader();
      reader.onload = function (e) {
        themer.load(e.target.result);
      };
      reader.readAsText(file);
    };

    this.open = function () {
      const fs = require('fs');
      const { dialog, app } = require('electron').remote;
      let paths = dialog.showOpenDialog(app.win, { properties: ['openFile'], filters: [{ name: 'Themes', extensions: ['svg'] }] });
      if (!paths) { console.log('Nothing to load'); }
      fs.readFile(paths[0], 'utf8', function (err, data) {
        if (err) throw err
        themer.load(data);
      });
    };

    window.addEventListener('dragover', this.drag);
    window.addEventListener('drop', this.drop);

    // Helpers

    function validate (json) {
      if (!json) { return false }
      if (!json.background) { return false }
      if (!json.f_high) { return false }
      if (!json.f_med) { return false }
      if (!json.f_low) { return false }
      if (!json.f_inv) { return false }
      if (!json.b_high) { return false }
      if (!json.b_med) { return false }
      if (!json.b_low) { return false }
      if (!json.b_inv) { return false }
      return true
    }

    function extract (text) {
      const svg = new DOMParser().parseFromString(text, 'text/xml');
      try {
        return {
          'background': svg.getElementById('background').getAttribute('fill'),
          'f_high': svg.getElementById('f_high').getAttribute('fill'),
          'f_med': svg.getElementById('f_med').getAttribute('fill'),
          'f_low': svg.getElementById('f_low').getAttribute('fill'),
          'f_inv': svg.getElementById('f_inv').getAttribute('fill'),
          'b_high': svg.getElementById('b_high').getAttribute('fill'),
          'b_med': svg.getElementById('b_med').getAttribute('fill'),
          'b_low': svg.getElementById('b_low').getAttribute('fill'),
          'b_inv': svg.getElementById('b_inv').getAttribute('fill')
        }
      } catch (err) {
        console.warn('Theme', 'Incomplete SVG Theme', err);
      }
    }

    function isJson (text) {
      try { JSON.parse(text); return true } catch (error) { return false }
    }

    function isHtml (text) {
      try { new DOMParser().parseFromString(text, 'text/xml'); return true } catch (error) { return false }
    }
  }
  var theme = Theme;

  function Controller () {
    const fs = require('fs');
    const { dialog, app } = require('electron').remote;

    this.menu = { default: {} };
    this.mode = 'default';

    this.app = require('electron').remote.app;

    this.start = function () {
    };

    this.add = function (mode, cat, label, fn, accelerator) {
      if (!this.menu[mode]) { this.menu[mode] = {}; }
      if (!this.menu[mode][cat]) { this.menu[mode][cat] = {}; }
      this.menu[mode][cat][label] = { fn: fn, accelerator: accelerator };
    };

    this.addRole = function (mode, cat, label) {
      if (!this.menu[mode]) { this.menu[mode] = {}; }
      if (!this.menu[mode][cat]) { this.menu[mode][cat] = {}; }
      this.menu[mode][cat][label] = { role: label };
    };

    this.format = function () {
      const f = [];
      const m = this.menu[this.mode];
      for (const cat in m) {
        const submenu = [];
        for (const name in m[cat]) {
          const option = m[cat][name];
          if (option.role) {
            submenu.push({ role: option.role });
          } else {
            submenu.push({ label: name, accelerator: option.accelerator, click: option.fn });
          }
        }
        f.push({ label: cat, submenu: submenu });
      }
      return f
    };

    this.commit = function () {
      this.app.injectMenu(this.format());
    };
  }

  var controller = Controller;

  function Pilot () {
    this.listener = null;
    this.mixer = null;
    this.recorder = null;
    this.commander = null;
    this.controller = new controller();
    this.theme = new theme({ background: '#000000', f_high: '#ffffff', f_med: '#777777', f_low: '#444444', f_inv: '#000000', b_high: '#eeeeee', b_med: '#333', b_low: '#444444', b_inv: '#fff' });

    this.el = document.createElement('div');
    this.el.id = 'pilot';

    this.animate = true;

    this.install = function (host) {
      console.info('Pilot is installing..');

      this.mixer = new mixer(this);
      this.listener = new listener(this);
      this.recorder = new recorder(this);
      this.commander = new commander(this);

      host.appendChild(this.el);

      this.theme.install();
      this.mixer.install(this.el);
      this.recorder.install(this.el);
      this.commander.install(this.el);
    };

    this.start = function () {
      console.info('Pilot is starting..');
      this.mixer.start();
      this.commander.start();
      this.theme.start();
    };

    this.toggleAnimations = function (mod, set = false) {
      this.animate = this.animate !== true;
    };

    this.modZoom = function (mod = 0, set = false) {
      const { webFrame } = require('electron');
      const currentZoomFactor = webFrame.getZoomFactor();
      webFrame.setZoomFactor(set ? mod : currentZoomFactor + mod);
    };
  }

  var pilot = Pilot;

  return pilot;

}());
