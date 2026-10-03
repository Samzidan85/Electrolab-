/**
 * Web Audio API synthesizer for electronics workbench sound effects.
 * Safe fallback if audio context is blocked by browser policies.
 */

class SoundEffectsManager {
  private ctx: AudioContext | null = null;
  private continuityOsc: OscillatorNode | null = null;
  private continuityGain: GainNode | null = null;

  private initCtx() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  // Multimeter Continuity Buzzer (Continuous tone while probed)
  startContinuityTone(freq = 2400) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      if (this.continuityOsc) return;

      this.continuityOsc = this.ctx.createOscillator();
      this.continuityGain = this.ctx.createGain();

      this.continuityOsc.type = 'square';
      this.continuityOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      this.continuityGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

      this.continuityOsc.connect(this.continuityGain);
      this.continuityGain.connect(this.ctx.destination);
      this.continuityOsc.start();
    } catch {
      // Ignored if user hasn't interacted
    }
  }

  stopContinuityTone() {
    try {
      if (this.continuityOsc) {
        this.continuityOsc.stop();
        this.continuityOsc.disconnect();
        this.continuityOsc = null;
      }
      if (this.continuityGain) {
        this.continuityGain.disconnect();
        this.continuityGain = null;
      }
    } catch {
      // noop
    }
  }

  // Single short beep (button click or reading acquired)
  playBeep(freq = 1200, duration = 0.08) {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // noop
    }
  }

  // Relay click sound (mechanical sharp double-click)
  playRelayClick() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.03);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch {
      // noop
    }
  }

  // Soldering sizzle sound (filtered noise)
  playSolderSizzle() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.25;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(3200, this.ctx.currentTime);
      filter.Q.setValueAtTime(2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.25);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // noop
    }
  }

  // Success chime (arpeggio fanfare)
  playSuccessChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      const now = this.ctx.currentTime;

      notes.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.1);

        gain.gain.setValueAtTime(0, now + index * 0.1);
        gain.gain.linearRampToValueAtTime(0.08, now + index * 0.1 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + index * 0.1 + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + index * 0.1);
        osc.stop(now + index * 0.1 + 0.4);
      });
    } catch {
      // noop
    }
  }

  // Spark / short circuit snap sound
  playShortSnap() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // noop
    }
  }

  // Generator engine rumble
  playGeneratorStart() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(45, now);
      osc.frequency.linearRampToValueAtTime(120, now + 0.4);
      osc.frequency.linearRampToValueAtTime(60, now + 0.8);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch {
      // noop
    }
  }

  // Cold Solder Joint (Scratchy, intermittent buzz with jitter)
  playColdJointTone() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      
      // Burst of 4 micro-intermittent buzzes
      [0, 0.06, 0.14, 0.22].forEach((offset, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1800 + Math.random() * 600, now + offset);

        gain.gain.setValueAtTime(0.04, now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + offset);
        osc.stop(now + offset + 0.045);
      });
    } catch {
      // noop
    }
  }

  // Capacitor in-circuit charge chirp (starts high, quickly glides down and cuts off)
  playCapChargeChirp() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'square';
      osc.frequency.setValueAtTime(2800, now);
      osc.frequency.exponentialRampToValueAtTime(400, now + 0.22);

      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.23);
    } catch {
      // noop
    }
  }

  // Leaky semiconductor / high-resistance continuity tone (1100 Hz warble)
  playDiodeLeakTone() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1100, now);

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // noop
    }
  }

  // Grand Level-Up Fanfare Sound
  playLevelUpFanfare() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880, 1108.73, 1318.51]; // A major triumphant flourish
      const now = this.ctx.currentTime;

      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        gain.gain.setValueAtTime(0.08, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + (idx === notes.length - 1 ? 0.6 : 0.2));

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + (idx === notes.length - 1 ? 0.6 : 0.25));
      });
    } catch {
      // noop
    }
  }

  // Reward / Badge Unlock Chime
  playRewardUnlockChime() {
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      const chords = [523.25, 659.25, 783.99, 987.77, 1046.5]; // C major 7th shimmer
      chords.forEach((f, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, now + i * 0.05);
        gain.gain.setValueAtTime(0.05, now + i * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.05 + 0.4);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.05);
        osc.stop(now + i * 0.05 + 0.45);
      });
    } catch {
      // noop
    }
  }
}

export const soundFx = new SoundEffectsManager();
