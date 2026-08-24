/**
 * Procedural Web Audio Engine - Quiz Funnel UI
 * Síntese em tempo real sem arquivos .mp3/.wav externos (zero latência).
 */

class UiAudioEngine {
  constructor() {
    this.context = null;
    this.enabled = true;
    this.storageKey = 'quiz-ui-sounds';
    this.init();
  }

  init() {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(this.storageKey);
    this.enabled = stored !== 'off';
  }

  ensureContext() {
    if (!this.context && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.context = new AudioCtx();
      }
    }
    if (this.context && this.context.state === 'suspended') {
      void this.context.resume();
    }
    return this.context;
  }

  playTone(startFreq, endFreq, duration, delay = 0, volume = 0.035, type = 'triangle') {
    if (!this.enabled) return;
    const ctx = this.ensureContext();
    if (!ctx) return;

    try {
      const oscillator = ctx.createOscillator();
      const gain = ctx.createGain();
      const startAt = ctx.currentTime + delay;
      const endAt = startAt + duration;

      oscillator.type = type;
      oscillator.frequency.setValueAtTime(startFreq, startAt);
      oscillator.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), endAt);

      gain.gain.setValueAtTime(0.0001, startAt);
      gain.gain.exponentialRampToValueAtTime(volume, startAt + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, endAt);

      oscillator.connect(gain);
      gain.connect(ctx.destination);

      oscillator.start(startAt);
      oscillator.stop(endAt + 0.015);
    } catch (e) {
      console.warn('[Audio Engine] Playback note error:', e);
    }
  }

  play(kind) {
    if (!this.enabled) return;

    switch (kind) {
      case 'select':
        this.playTone(390, 620, 0.09, 0, 0.04, 'triangle');
        break;
      case 'back':
        this.playTone(330, 190, 0.075, 0, 0.025, 'triangle');
        break;
      case 'success':
        this.playTone(440, 660, 0.13, 0, 0.035, 'sine');
        this.playTone(620, 880, 0.16, 0.075, 0.03, 'sine');
        this.playTone(880, 1100, 0.18, 0.15, 0.025, 'sine');
        break;
      case 'click':
      default:
        this.playTone(270, 210, 0.055, 0, 0.025, 'triangle');
        break;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(this.storageKey, this.enabled ? 'on' : 'off');
    }
    if (this.enabled) {
      this.play('select');
    }
    return this.enabled;
  }
}

// Instância global exportada
export const uiAudio = new UiAudioEngine();

// Compatibilidade Vanilla JS (window.uiAudio)
if (typeof window !== 'undefined') {
  window.uiAudio = uiAudio;
}
