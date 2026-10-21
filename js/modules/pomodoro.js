/**
 * DevPulse - Pomodoro Focus Engine & Ambient Audio Synthesizer
 * Module: Web Audio API & Timer Logic
 * Contributor: Member 3
 */

import { store } from '../store.js';

export class PomodoroModule {
  constructor() {
    this.durations = {
      pomodoro: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60
    };

    this.timer = null;
    this.audioCtx = null;
    this.ambientSource = null;
    this.gainNode = null;

    // DOM References
    this.timeDisplay = document.getElementById('pomoTimeDisplay');
    this.statusLabel = document.getElementById('pomoStatusLabel');
    this.progressFill = document.getElementById('pomoProgressFill');
    this.toggleBtn = document.getElementById('pomoToggleBtn');
    this.toggleText = document.getElementById('pomoToggleText');
    this.playIcon = document.getElementById('pomoPlayIcon');
    this.resetBtn = document.getElementById('pomoResetBtn');
    this.skipBtn = document.getElementById('pomoSkipBtn');
    this.badge = document.getElementById('sessionCounterBadge');
    
    this.modeTabs = document.querySelectorAll('.pomo-tab');
    this.soundChips = document.querySelectorAll('.sound-chip');
    this.volumeSlider = document.getElementById('ambientVolume');
    this.ambientStatus = document.getElementById('ambientStatus');

    this.init();
  }

  init() {
    const pomoState = store.getState().pomodoro;
    this.currentMode = pomoState.currentMode || 'pomodoro';
    this.timeLeft = pomoState.timeLeft !== undefined ? pomoState.timeLeft : this.durations[this.currentMode];
    this.isRunning = false;
    this.sessionsCompleted = pomoState.sessionsCompleted || 0;
    this.currentSound = pomoState.ambientSound || 'off';

    this.updateDisplay();
    this.updateSessionBadge();
    this.bindEvents();
  }

  bindEvents() {
    // Mode tabs
    this.modeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const mode = tab.dataset.mode;
        this.switchMode(mode);
      });
    });

    // Play/Pause
    this.toggleBtn.addEventListener('click', () => {
      this.toggleTimer();
    });

    // Reset
    this.resetBtn.addEventListener('click', () => {
      this.resetTimer();
    });

    // Skip
    this.skipBtn.addEventListener('click', () => {
      this.skipCycle();
    });

    // Sound chips
    this.soundChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const sound = chip.dataset.sound;
        this.setAmbientSound(sound);
      });
    });

    // Volume slider
    this.volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value) / 100;
      if (this.gainNode) {
        this.gainNode.gain.setValueAtTime(vol, this.audioCtx ? this.audioCtx.currentTime : 0);
      }
      store.setState('pomodoro.ambientVolume', e.target.value);
    });
  }

  switchMode(mode) {
    this.pauseTimer();
    this.currentMode = mode;
    this.timeLeft = this.durations[mode];

    this.modeTabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.mode === mode);
    });

    const labels = {
      pomodoro: 'Time to concentrate!',
      shortBreak: 'Take a quick breather & stretch!',
      longBreak: 'Deep rest & recharge your mind!'
    };
    this.statusLabel.textContent = labels[mode] || 'Focus Engine';

    store.setState('pomodoro.currentMode', mode);
    store.setState('pomodoro.timeLeft', this.timeLeft);
    this.updateDisplay();
  }

  toggleTimer() {
    if (this.isRunning) {
      this.pauseTimer();
    } else {
      this.startTimer();
    }
  }

  startTimer() {
    this.isRunning = true;
    this.toggleText.textContent = 'Pause';
    this.playIcon.className = 'fa-solid fa-pause';
    this.toggleBtn.classList.replace('btn-accent', 'btn-secondary');

    this.timer = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.updateDisplay();
      } else {
        this.onTimerComplete();
      }
    }, 1000);
  }

  pauseTimer() {
    this.isRunning = false;
    clearInterval(this.timer);
    this.toggleText.textContent = 'Resume';
    this.playIcon.className = 'fa-solid fa-play';
    this.toggleBtn.classList.replace('btn-secondary', 'btn-accent');
  }

  resetTimer() {
    this.pauseTimer();
    this.timeLeft = this.durations[this.currentMode];
    this.toggleText.textContent = 'Start Session';
    this.updateDisplay();
  }

  skipCycle() {
    if (this.currentMode === 'pomodoro') {
      this.switchMode('shortBreak');
    } else {
      this.switchMode('pomodoro');
    }
  }

  onTimerComplete() {
    this.pauseTimer();
    this.playNotificationChime();

    if (this.currentMode === 'pomodoro') {
      this.sessionsCompleted++;
      store.setState('pomodoro.sessionsCompleted', this.sessionsCompleted);
      this.updateSessionBadge();
      
      if (this.sessionsCompleted % 4 === 0) {
        this.switchMode('longBreak');
      } else {
        this.switchMode('shortBreak');
      }
    } else {
      this.switchMode('pomodoro');
    }
  }

  updateDisplay() {
    const minutes = Math.floor(this.timeLeft / 60);
    const seconds = this.timeLeft % 60;
    const formatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    this.timeDisplay.textContent = formatted;

    // Progress bar fill
    const total = this.durations[this.currentMode];
    const pct = ((total - this.timeLeft) / total) * 100;
    this.progressFill.style.width = `${pct}%`;

    // Also update document title for tab visibility
    document.title = this.isRunning ? `(${formatted}) DevPulse Focus` : 'DevPulse — Developer Productivity Hub';
  }

  updateSessionBadge() {
    this.badge.textContent = `Completed: ${this.sessionsCompleted}`;
  }

  /* =========================================================================
     Web Audio API Synthesizer (Zero External Dependencies)
     Generates ambient noise, binaural beats, and audio chimes programmatically
     ========================================================================= */

  ensureAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  playNotificationChime() {
    try {
      this.ensureAudioContext();
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, this.audioCtx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, this.audioCtx.currentTime + 0.3); // A5

      gain.gain.setValueAtTime(0.3, this.audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.audioCtx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(this.audioCtx.destination);

      osc.start();
      osc.stop(this.audioCtx.currentTime + 1.2);
    } catch (e) {
      console.warn('Audio chime could not be played', e);
    }
  }

  setAmbientSound(type) {
    this.soundChips.forEach(chip => {
      chip.classList.toggle('active', chip.dataset.sound === type);
    });

    this.stopAmbientSound();
    this.currentSound = type;
    this.ambientStatus.textContent = type.toUpperCase();
    store.setState('pomodoro.ambientSound', type);

    if (type === 'off') return;

    this.ensureAudioContext();
    const vol = parseFloat(this.volumeSlider.value) / 100;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.setValueAtTime(vol, this.audioCtx.currentTime);
    this.gainNode.connect(this.audioCtx.destination);

    if (type === 'white') {
      this.ambientSource = this.createWhiteNoiseNode();
      this.ambientSource.connect(this.gainNode);
    } else if (type === 'rain') {
      this.ambientSource = this.createRainSynthesizer();
      this.ambientSource.connect(this.gainNode);
    } else if (type === 'binaural') {
      this.ambientSource = this.createBinauralBeats();
    } else if (type === 'waves') {
      this.ambientSource = this.createWaveSynthesizer();
      this.ambientSource.connect(this.gainNode);
    }
  }

  stopAmbientSound() {
    if (this.ambientSource) {
      try {
        if (this.ambientSource.stop) this.ambientSource.stop();
        if (this.ambientSource.disconnect) this.ambientSource.disconnect();
      } catch (e) {
        // ignore
      }
      this.ambientSource = null;
    }
  }

  createWhiteNoiseNode() {
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.audioCtx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;
    whiteNoise.start(0);
    return whiteNoise;
  }

  createRainSynthesizer() {
    // Rain is modeled as low-pass filtered brownian noise
    const bufferSize = 2 * this.audioCtx.sampleRate;
    const noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      output[i] = (lastOut + (0.02 * white)) / 1.02;
      lastOut = output[i];
      output[i] *= 3.5;
    }

    const source = this.audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    source.loop = true;

    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, this.audioCtx.currentTime);

    source.connect(filter);
    source.start(0);
    return filter;
  }

  createBinauralBeats() {
    // 200Hz in left ear, 240Hz in right ear = 40Hz Gamma wave for deep focus
    const oscLeft = this.audioCtx.createOscillator();
    const oscRight = this.audioCtx.createOscillator();
    oscLeft.frequency.value = 200;
    oscRight.frequency.value = 240;

    const merger = this.audioCtx.createChannelMerger(2);
    oscLeft.connect(merger, 0, 0);
    oscRight.connect(merger, 0, 1);

    merger.connect(this.gainNode);
    oscLeft.start();
    oscRight.start();

    return {
      stop: () => {
        oscLeft.stop();
        oscRight.stop();
      },
      disconnect: () => {
        merger.disconnect();
      }
    };
  }

  createWaveSynthesizer() {
    const noise = this.createRainSynthesizer();
    const filter = this.audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(300, this.audioCtx.currentTime);

    // Modulate filter frequency to simulate waves ebb & flow
    const lfo = this.audioCtx.createOscillator();
    const lfoGain = this.audioCtx.createGain();
    lfo.frequency.value = 0.12; // slow wave period ~8s
    lfoGain.gain.value = 200;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    noise.connect(filter);
    return filter;
  }
}
