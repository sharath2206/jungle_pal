// Web Audio API synthesizer for playful, latency-free kid audio feedback, background music & phonics speech
import { useState, useEffect } from 'react';

let audioCtx = null;
let bgmGainNode = null;
let bgmInterval = null;
let bgmNoteIndex = 0;

// Read initial mute preferences from localStorage if available
let isMutedState = false;
let isMusicPlayingState = false;

if (typeof window !== 'undefined') {
  try {
    isMutedState = localStorage.getItem('jungle_sound_muted') === 'true';
    const musicPref = localStorage.getItem('jungle_music_enabled');
    isMusicPlayingState = musicPref !== null ? musicPref === 'true' : true;
  } catch {}
}

const muteListeners = new Set();
const musicListeners = new Set();

function notifyListeners() {
  muteListeners.forEach((fn) => {
    try {
      fn(isMutedState);
    } catch {}
  });
  musicListeners.forEach((fn) => {
    try {
      fn(isMusicPlayingState && !isMutedState);
    } catch {}
  });
}

function getAudioContext() {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

// Gentle tropical jungle pentatonic kalimba/marimba melody
const JUNGLE_TUNE = [
  // bar 1: C5, E5, G5, A5
  { note: 523.25, dur: 0.15, step: 0 },
  { note: 659.25, dur: 0.15, step: 2 },
  { note: 783.99, dur: 0.2, step: 4 },
  { note: 880.0, dur: 0.15, step: 6 },
  // bar 2: G5, E5, D5, C5
  { note: 783.99, dur: 0.25, step: 8 },
  { note: 659.25, dur: 0.15, step: 10 },
  { note: 587.33, dur: 0.2, step: 12 },
  { note: 523.25, dur: 0.3, step: 14 },
  // bar 3: E5, G5, C6, A5
  { note: 659.25, dur: 0.15, step: 16 },
  { note: 783.99, dur: 0.15, step: 18 },
  { note: 1046.5, dur: 0.25, step: 20 },
  { note: 880.0, dur: 0.2, step: 22 },
  // bar 4: G5, D5, E5, C5
  { note: 783.99, dur: 0.2, step: 24 },
  { note: 587.33, dur: 0.2, step: 26 },
  { note: 659.25, dur: 0.25, step: 28 },
  { note: 523.25, dur: 0.4, step: 30 },
];

function getBgmGain() {
  const ctx = getAudioContext();
  if (!ctx) return null;
  if (!bgmGainNode) {
    bgmGainNode = ctx.createGain();
    bgmGainNode.connect(ctx.destination);
  }
  return bgmGainNode;
}

function playKalimbaNote(freq, dur = 0.2, vol = 0.05) {
  if (isMutedState || !isMusicPlayingState) return;
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const masterBgm = getBgmGain();
    if (!masterBgm) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Warm wooden percussive envelope
    gain.gain.setValueAtTime(vol, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur + 0.25);

    osc.connect(gain);
    gain.connect(masterBgm);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + dur + 0.26);
  } catch {}
}

function startBgmEngine() {
  if (bgmInterval) return;
  const masterBgm = getBgmGain();
  if (masterBgm && audioCtx) {
    masterBgm.gain.cancelScheduledValues(audioCtx.currentTime);
    masterBgm.gain.setValueAtTime(1, audioCtx.currentTime);
  }
  let currentStep = 0;
  bgmInterval = setInterval(() => {
    if (isMutedState || !isMusicPlayingState) {
      stopBgmEngine();
      return;
    }
    const notesToPlay = JUNGLE_TUNE.filter((item) => item.step === currentStep);
    notesToPlay.forEach((item) => {
      playKalimbaNote(item.note, item.dur, 0.04);
    });
    currentStep = (currentStep + 1) % 32;
  }, 220); // 136 BPM friendly tempo
}

function stopBgmEngine() {
  if (bgmInterval) {
    clearInterval(bgmInterval);
    bgmInterval = null;
  }
  if (bgmGainNode && audioCtx) {
    // Instant silence: zero out gain node to silence active/decaying notes immediately
    try {
      bgmGainNode.gain.cancelScheduledValues(audioCtx.currentTime);
      bgmGainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    } catch {}
  }
}

export const sounds = {
  // Check mute state
  isMuted: () => isMutedState,

  // Set mute state
  setMuted: (muted) => {
    isMutedState = Boolean(muted);
    try {
      localStorage.setItem('jungle_sound_muted', isMutedState ? 'true' : 'false');
    } catch {}

    if (isMutedState) {
      stopBgmEngine();
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    } else {
      // If unmuted, resume audio context and music if enabled
      getAudioContext();
      if (isMusicPlayingState) {
        startBgmEngine();
      }
    }

    notifyListeners();
    return isMutedState;
  },

  // Toggle mute on / off
  toggleMute: () => {
    return sounds.setMuted(!isMutedState);
  },

  // Music controls
  isMusicPlaying: () => isMusicPlayingState && !isMutedState,

  setMusicEnabled: (enabled) => {
    isMusicPlayingState = Boolean(enabled);
    try {
      localStorage.setItem('jungle_music_enabled', isMusicPlayingState ? 'true' : 'false');
    } catch {}

    if (isMusicPlayingState) {
      // Turning music ON directly unmutes so audio can play immediately
      isMutedState = false;
      try {
        localStorage.setItem('jungle_sound_muted', 'false');
      } catch {}
      const ctx = getAudioContext();
      if (ctx && ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      startBgmEngine();
    } else {
      stopBgmEngine();
    }

    notifyListeners();
    return isMusicPlayingState && !isMutedState;
  },

  toggleMusic: () => {
    const isCurrentlyActive = isMusicPlayingState && !isMutedState;
    if (isCurrentlyActive) {
      // User tapped to turn music off
      sounds.setMusicEnabled(false);
      return false;
    } else {
      // User tapped to turn music on
      sounds.setMusicEnabled(true);
      return true;
    }
  },

  startMusic: () => {
    sounds.setMusicEnabled(true);
  },

  stopMusic: () => {
    sounds.setMusicEnabled(false);
  },

  // Subscribe to mute & music changes in React components
  subscribeMute: (listener) => {
    muteListeners.add(listener);
    return () => muteListeners.delete(listener);
  },

  subscribeMusic: (listener) => {
    musicListeners.add(listener);
    return () => musicListeners.delete(listener);
  },

  // Pleasant tactile button pop
  playTap: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch {}
  },

  // Playful pop effect
  playPop: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(620, ctx.currentTime + 0.06);
      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.07);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch {}
  },

  // Star and coin celebration chime
  playSuccess: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * 0.08;
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.23);
      });
    } catch {}
  },

  // Chime sound
  playChime: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [659.25, 880.0, 1046.5].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * 0.07;
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.26);
      });
    } catch {}
  },

  // Magical sparkling reward burst
  playSparkle: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      for (let i = 0; i < 6; i++) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 1200 + Math.random() * 800;
        const start = ctx.currentTime + i * 0.05;
        gain.gain.setValueAtTime(0.15, start);
        gain.gain.exponentialRampToValueAtTime(0.005, start + 0.15);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.16);
      }
    } catch {}
  },

  // Realistic Layered Lion Roar: sub-bass rumble, throat flutter LFO & filtered resonant noise
  playRoar: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const duration = 1.2;

      // 1. Throat Growl Sub-Bass Oscillator
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sawtooth';
      subOsc.frequency.setValueAtTime(110, now);
      subOsc.frequency.exponentialRampToValueAtTime(160, now + 0.25);
      subOsc.frequency.exponentialRampToValueAtTime(55, now + 0.85);
      subOsc.frequency.exponentialRampToValueAtTime(40, now + duration);

      // Low-pass filter to keep roar warm and guttural
      const subFilter = ctx.createBiquadFilter();
      subFilter.type = 'lowpass';
      subFilter.frequency.setValueAtTime(320, now);
      subFilter.frequency.linearRampToValueAtTime(480, now + 0.3);
      subFilter.frequency.exponentialRampToValueAtTime(150, now + duration);

      // 2. Throat Tremolo / Guttural Flutter (LFO)
      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(24, now); // 24Hz growl flutter
      lfoGain.gain.setValueAtTime(0.35, now);
      lfo.connect(subGain.gain);

      // Sub-bass volume envelope
      subGain.gain.setValueAtTime(0.01, now);
      subGain.gain.linearRampToValueAtTime(0.55, now + 0.18);
      subGain.gain.exponentialRampToValueAtTime(0.35, now + 0.65);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      subOsc.connect(subFilter);
      subFilter.connect(subGain);
      subGain.connect(ctx.destination);

      subOsc.start(now);
      lfo.start(now);
      subOsc.stop(now + duration);
      lfo.stop(now + duration);

      // 3. Resonant Air Flow / Breath Roar Noise Layer
      const bufferSize = Math.floor(ctx.sampleRate * duration);
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.Q.setValueAtTime(3.0, now);
      noiseFilter.frequency.setValueAtTime(260, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(580, now + 0.28);
      noiseFilter.frequency.exponentialRampToValueAtTime(180, now + duration);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.01, now);
      noiseGain.gain.linearRampToValueAtTime(0.4, now + 0.2);
      noiseGain.gain.exponentialRampToValueAtTime(0.2, now + 0.7);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      whiteNoise.start(now);
      whiteNoise.stop(now + duration);
    } catch {}
  },

  // Alias for Lion
  playLion: () => {
    sounds.playRoar();
  },

  // Friendly elephant trumpet with rich brassy harmonics
  playElephant: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const duration = 0.75;

      // Primary brass oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(620, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(480, now + 0.55);
      osc.frequency.exponentialRampToValueAtTime(380, now + duration);

      // Brass formant bandpass
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.Q.setValueAtTime(2.5, now);
      filter.frequency.setValueAtTime(900, now);
      filter.frequency.linearRampToValueAtTime(1600, now + 0.22);
      filter.frequency.exponentialRampToValueAtTime(700, now + duration);

      // Vibrato / Trumpet Flutter
      const vib = ctx.createOscillator();
      const vibGain = ctx.createGain();
      vib.frequency.setValueAtTime(6, now);
      vibGain.gain.setValueAtTime(18, now);
      vib.connect(osc.frequency);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.25, now + 0.5);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      vib.start(now);
      osc.stop(now + duration);
      vib.stop(now + duration);
    } catch {}
  },

  // Milo the Monkey happy rhythmic chatter ("ooh-ooh-aah-aah!")
  playMonkey: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [
        { freq: 520, dur: 0.08, delay: 0 },
        { freq: 760, dur: 0.1, delay: 0.1 },
        { freq: 580, dur: 0.08, delay: 0.22 },
        { freq: 880, dur: 0.12, delay: 0.32 },
        { freq: 1040, dur: 0.14, delay: 0.46 },
      ];
      notes.forEach((item) => {
        const start = ctx.currentTime + item.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(item.freq, start);
        osc.frequency.exponentialRampToValueAtTime(item.freq * 1.35, start + item.dur);

        gain.gain.setValueAtTime(0.35, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + item.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + item.dur + 0.01);
      });
    } catch {}
  },

  // Toucan tropical birdsong trill
  playToucan: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [
        { startF: 950, endF: 1650, delay: 0 },
        { startF: 1100, endF: 1950, delay: 0.09 },
        { startF: 1300, endF: 2200, delay: 0.18 },
      ].forEach((chirp) => {
        const start = ctx.currentTime + chirp.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(chirp.startF, start);
        osc.frequency.exponentialRampToValueAtTime(chirp.endF, start + 0.07);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.075);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.08);
      });
    } catch {}
  },

  // Barnaby the Bear friendly rumble growl
  playBear: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(95, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.65);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.65);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.66);
    } catch {}
  },

  // Danny the Dolphin playful whistle and sonar clicks
  playDolphin: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(2100, now);
      osc.frequency.exponentialRampToValueAtTime(3200, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(2400, now + 0.35);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.37);
    } catch {}
  },

  // Alex the Alligator throat hiss and water chomp
  playAlligator: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(65, now);
      osc.frequency.linearRampToValueAtTime(95, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.45);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  },

  // Charlie the Chameleon tongue zap & soft click
  playChameleon: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(250, now + 0.12);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.13);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch {}
  },

  // Flora the Flamingo double nasal honk
  playFlamingo: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [0, 0.14].forEach((delay) => {
        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(440, start);
        osc.frequency.linearRampToValueAtTime(560, start + 0.05);
        osc.frequency.exponentialRampToValueAtTime(380, start + 0.11);

        gain.gain.setValueAtTime(0.3, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.11);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    } catch {}
  },

  // Gigi the Giraffe gentle savannah hum
  playGiraffe: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.linearRampToValueAtTime(220, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.55);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.3, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.56);
    } catch {}
  },

  // Hugo the Hippo river splash bellow
  playHippo: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.linearRampToValueAtTime(145, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.45, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    } catch {}
  },

  // Iggy the Iguana quick breath hiss & rustle
  playIguana: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(950, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.22);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.23);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.24);
    } catch {}
  },

  // Jaguar Jack snarling cat purr & growl
  playJaguar: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(190, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(75, now + 0.6);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    } catch {}
  },

  // Koala Kip friendly woodland grunt
  playKoala: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.linearRampToValueAtTime(390, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(170, now + 0.45);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.46);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.47);
    } catch {}
  },

  // Nala the Nuthatch forest bird whistle
  playNuthatch: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [1400, 1800, 1600].forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.08;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.2, start + 0.07);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.075);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.08);
      });
    } catch {}
  },

  // Ollie the Owl twin hoot ("Hooo... Hooo!")
  playOwl: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [
        { freq: 360, dur: 0.22, delay: 0 },
        { freq: 330, dur: 0.35, delay: 0.3 },
      ].forEach((hoot) => {
        const start = ctx.currentTime + hhoot.delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(hoot.freq, start);
        osc.frequency.exponentialRampToValueAtTime(hoot.freq * 0.92, start + hoot.dur);

        gain.gain.setValueAtTime(0.01, start);
        gain.gain.linearRampToValueAtTime(0.35, start + 0.06);
        gain.gain.exponentialRampToValueAtTime(0.01, start + hoot.dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + hoot.dur + 0.01);
      });
    } catch {}
  },

  // Pip the Panda playful cub chirp & chew
  playPanda: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(680, now);
      osc.frequency.exponentialRampToValueAtTime(1150, now + 0.12);
      osc.frequency.exponentialRampToValueAtTime(820, now + 0.25);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.26);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.27);
    } catch {}
  },

  // Quinn the Quail 3-note coo
  playQuail: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [820, 1250, 980].forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.09;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.15, start + 0.08);

        gain.gain.setValueAtTime(0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.085);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.09);
      });
    } catch {}
  },

  // Roxy the Rhino heavy snort & puff
  playRhino: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(85, now);
      osc.frequency.linearRampToValueAtTime(130, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(55, now + 0.45);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  },

  // Sammy the Sloth sleepy yawny sigh
  playSloth: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(380, now);
      osc.frequency.linearRampToValueAtTime(480, now + 0.25);
      osc.frequency.exponentialRampToValueAtTime(240, now + 0.7);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.72);
    } catch {}
  },

  // Uma the Umbrella Bird deep booming foghorn resonance
  playUmbrellaBird: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(125, now);
      osc.frequency.linearRampToValueAtTime(145, now + 0.2);
      osc.frequency.exponentialRampToValueAtTime(95, now + 0.6);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.62);
    } catch {}
  },

  // Vicki the Viper tail rattle & hiss
  playViper: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [0, 0.06, 0.12, 0.18].forEach((delay) => {
        const start = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1600, start);
        osc.frequency.exponentialRampToValueAtTime(800, start + 0.04);

        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.05);
      });
    } catch {}
  },

  // Wally the Whale majestic deep underwater song
  playWhale: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(420, now + 0.35);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.85);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.85);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.86);
    } catch {}
  },

  // Xavier the X-Ray Fish water shimmer and bubble clicks
  playXrayFish: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      [800, 1200, 1600, 2100].forEach((freq, idx) => {
        const start = ctx.currentTime + idx * 0.05;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.4, start + 0.05);

        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.055);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.06);
      });
    } catch {}
  },

  // Yanni the Yak shaggy mountain grunt & breath
  playYak: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(105, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.15);
      osc.frequency.exponentialRampToValueAtTime(70, now + 0.5);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.52);
    } catch {}
  },

  // Ziggy the Zebra whinny & bray ("kwa-ha!")
  playZebra: () => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(460, now);
      osc.frequency.linearRampToValueAtTime(840, now + 0.18);
      osc.frequency.exponentialRampToValueAtTime(380, now + 0.45);

      gain.gain.setValueAtTime(0.02, now);
      gain.gain.linearRampToValueAtTime(0.4, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.46);
    } catch {}
  },

  // Universal Animal Sound Dispatcher supporting all 26 animals (A through Z)
  playAnimal: (nameOrLetter = '') => {
    const key = String(nameOrLetter).toLowerCase().trim();

    // Direct single letter lookup (a-z)
    const letterMap = {
      a: sounds.playAlligator,
      b: sounds.playBear,
      c: sounds.playChameleon,
      d: sounds.playDolphin,
      e: sounds.playElephant,
      f: sounds.playFlamingo,
      g: sounds.playGiraffe,
      h: sounds.playHippo,
      i: sounds.playIguana,
      j: sounds.playJaguar,
      k: sounds.playKoala,
      l: sounds.playLion,
      m: sounds.playMonkey,
      n: sounds.playNuthatch,
      o: sounds.playOwl,
      p: sounds.playPanda,
      q: sounds.playQuail,
      r: sounds.playRhino,
      s: sounds.playSloth,
      t: sounds.playToucan,
      u: sounds.playUmbrellaBird,
      v: sounds.playViper,
      w: sounds.playWhale,
      x: sounds.playXrayFish,
      y: sounds.playYak,
      z: sounds.playZebra,
    };

    if (key.length === 1 && letterMap[key]) {
      letterMap[key]();
      return;
    }

    if (key.includes('alligator')) {
      sounds.playAlligator();
    } else if (key.includes('bear')) {
      sounds.playBear();
    } else if (key.includes('chameleon')) {
      sounds.playChameleon();
    } else if (key.includes('dolphin')) {
      sounds.playDolphin();
    } else if (key.includes('elephant')) {
      sounds.playElephant();
    } else if (key.includes('flamingo')) {
      sounds.playFlamingo();
    } else if (key.includes('giraffe')) {
      sounds.playGiraffe();
    } else if (key.includes('hippo')) {
      sounds.playHippo();
    } else if (key.includes('iguana')) {
      sounds.playIguana();
    } else if (key.includes('jaguar')) {
      sounds.playJaguar();
    } else if (key.includes('koala')) {
      sounds.playKoala();
    } else if (key.includes('lion') || key.includes('roar')) {
      sounds.playRoar();
    } else if (key.includes('monkey')) {
      sounds.playMonkey();
    } else if (key.includes('nuthatch') || key.includes('nest')) {
      sounds.playNuthatch();
    } else if (key.includes('owl')) {
      sounds.playOwl();
    } else if (key.includes('panda')) {
      sounds.playPanda();
    } else if (key.includes('quail')) {
      sounds.playQuail();
    } else if (key.includes('rhino')) {
      sounds.playRhino();
    } else if (key.includes('sloth')) {
      sounds.playSloth();
    } else if (key.includes('toucan')) {
      sounds.playToucan();
    } else if (key.includes('umbrella')) {
      sounds.playUmbrellaBird();
    } else if (key.includes('viper') || key.includes('snake')) {
      sounds.playViper();
    } else if (key.includes('whale')) {
      sounds.playWhale();
    } else if (key.includes('x-ray') || key.includes('xray') || key.includes('fish')) {
      sounds.playXrayFish();
    } else if (key.includes('yak')) {
      sounds.playYak();
    } else if (key.includes('zebra')) {
      sounds.playZebra();
    } else {
      sounds.playSparkle();
    }
  },

  // Counting pop (scales pitch from 1 to 10)
  playCountPop: (count = 1) => {
    if (isMutedState) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      const baseFreq = 300 + count * 60;
      osc.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.35, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.11);
    } catch {}
  },

  // Speech pronunciation for phonics & word cards (crystal clean natural speech, NO slashes)
  speak: (text, rate = 0.9, pitch = 1.2) => {
    if (isMutedState || !text) return;
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      // Completely strip out slash phonetic notations like /æ/, /a/a/, IPA bullets, brackets
      const cleanText = String(text)
        .replace(/\/[^/]+\//g, ' ')
        .replace(/[•·/\\_~*^[\](){}]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      if (!cleanText) return;
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.lang = 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  },
};

// React hook to observe and control mute & music state
export function useSoundMute() {
  const [isMuted, setIsMuted] = useState(sounds.isMuted());
  const [isMusicPlaying, setIsMusicPlaying] = useState(sounds.isMusicPlaying());

  useEffect(() => {
    const unsubMute = sounds.subscribeMute((newMuted) => {
      setIsMuted(newMuted);
    });
    const unsubMusic = sounds.subscribeMusic((newMusic) => {
      setIsMusicPlaying(newMusic);
    });
    return () => {
      unsubMute();
      unsubMusic();
    };
  }, []);

  return {
    isMuted,
    toggleMute: sounds.toggleMute,
    setMuted: sounds.setMuted,
    isMusicPlaying,
    toggleMusic: sounds.toggleMusic,
    setMusicEnabled: sounds.setMusicEnabled,
  };
}
