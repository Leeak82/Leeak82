/**
 * Procedural sound engine built on the Web Audio API.
 *
 * All cues are synthesized at runtime (no external audio assets) so the sim is
 * fully self-contained. Sounds are tuned to evoke real shop tools and engines:
 * ratchet clicks, impact-wrench bursts, torque-wrench "click-off", scan-tool
 * beeps, and per-engine cranking/idle loops.
 */

type EngineProfile = "v6" | "v8" | "i4" | "single-cylinder" | "novelty";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private idleNodes: AudioNode[] = [];
  private idleTimer: number | null = null;
  muted = false;

  private ensure(): AudioContext {
    if (!this.ctx) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.ctx = new Ctx();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.6;
      this.master.connect(this.ctx.destination);
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
    return this.ctx;
  }

  /** Call from a user gesture to unlock audio on strict browsers. */
  unlock() {
    this.ensure();
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (this.master) this.master.gain.value = m ? 0 : 0.6;
  }

  private out(): GainNode {
    this.ensure();
    return this.master as GainNode;
  }

  private noiseBuffer(seconds: number): AudioBuffer {
    const ctx = this.ensure();
    const len = Math.floor(ctx.sampleRate * seconds);
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = Math.random() * 2 - 1;
    return buf;
  }

  private ping(
    freq: number,
    dur: number,
    type: OscillatorType = "sine",
    gain = 0.3,
    when = 0,
  ) {
    const ctx = this.ensure();
    const t = ctx.currentTime + when;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g).connect(this.out());
    osc.start(t);
    osc.stop(t + dur + 0.02);
  }

  private burst(dur: number, gain: number, filterFreq: number, when = 0) {
    const ctx = this.ensure();
    const t = ctx.currentTime + when;
    const src = ctx.createBufferSource();
    src.buffer = this.noiseBuffer(dur + 0.05);
    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = 0.8;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(gain, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    src.connect(filter).connect(g).connect(this.out());
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  click() {
    if (this.muted) return;
    this.ping(420, 0.05, "square", 0.12);
  }

  beep() {
    if (this.muted) return;
    this.ping(880, 0.09, "sine", 0.25);
  }

  scanner() {
    if (this.muted) return;
    this.ping(660, 0.08, "square", 0.18, 0);
    this.ping(990, 0.1, "square", 0.18, 0.12);
  }

  ratchet() {
    if (this.muted) return;
    for (let i = 0; i < 8; i++) this.burst(0.03, 0.18, 2600, i * 0.06);
  }

  impact() {
    if (this.muted) return;
    for (let i = 0; i < 16; i++) this.burst(0.025, 0.22, 1800, i * 0.035);
    this.ping(120, 0.4, "sawtooth", 0.12);
  }

  torqueClick() {
    if (this.muted) return;
    this.burst(0.02, 0.25, 3200);
    this.ping(1500, 0.04, "square", 0.2, 0.02);
  }

  hydraulic() {
    if (this.muted) return;
    const ctx = this.ensure();
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, t);
    osc.frequency.linearRampToValueAtTime(140, t + 0.6);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(0.12, t + 0.1);
    g.gain.linearRampToValueAtTime(0.0001, t + 0.7);
    osc.connect(g).connect(this.out());
    osc.start(t);
    osc.stop(t + 0.75);
  }

  fluid() {
    if (this.muted) return;
    this.burst(0.9, 0.1, 900);
  }

  tool(kind: string) {
    switch (kind) {
      case "ratchet":
        return this.ratchet();
      case "impact":
        return this.impact();
      case "torque-click":
        return this.torqueClick();
      case "hydraulic":
        return this.hydraulic();
      case "fluid":
        return this.fluid();
      case "scanner":
        return this.scanner();
      case "beep":
        return this.beep();
      default:
        return this.click();
    }
  }

  success() {
    if (this.muted) return;
    this.ping(523.25, 0.12, "sine", 0.25, 0);
    this.ping(659.25, 0.12, "sine", 0.25, 0.1);
    this.ping(783.99, 0.2, "sine", 0.25, 0.2);
  }

  error() {
    if (this.muted) return;
    this.ping(200, 0.18, "sawtooth", 0.22, 0);
    this.ping(150, 0.28, "sawtooth", 0.22, 0.14);
  }

  levelUp() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => this.ping(f, 0.22, "triangle", 0.25, i * 0.11));
  }

  /** Cranking + start + looping idle for the given engine profile. */
  startEngine(profile: EngineProfile) {
    if (this.muted) return;
    this.stopEngine();
    const ctx = this.ensure();
    const t0 = ctx.currentTime;

    // Cranking: low chugging bursts.
    const crankCount = profile === "novelty" ? 2 : 5;
    for (let i = 0; i < crankCount; i++) {
      this.burst(0.12, 0.14, 220, i * 0.18);
      this.ping(70, 0.14, "square", 0.1, i * 0.18);
    }
    const startAt = crankCount * 0.18 + 0.1;

    if (profile === "novelty") {
      // Flintstone: happy little "yabba" chirps instead of an engine.
      this.ping(392, 0.15, "triangle", 0.25, startAt);
      this.ping(523, 0.15, "triangle", 0.25, startAt + 0.15);
      this.ping(659, 0.25, "triangle", 0.25, startAt + 0.3);
      return;
    }

    // Idle loop: pulsing firing frequency based on cylinder count / rpm.
    const fireRates: Record<EngineProfile, number> = {
      v8: 26,
      v6: 20,
      i4: 15,
      "single-cylinder": 7,
      novelty: 6,
    };
    const baseFreq = profile === "single-cylinder" ? 55 : 75;
    const idleGain = ctx.createGain();
    idleGain.gain.setValueAtTime(0, t0 + startAt);
    idleGain.gain.linearRampToValueAtTime(0.16, t0 + startAt + 0.25);
    idleGain.connect(this.out());

    const osc = ctx.createOscillator();
    osc.type = "sawtooth";
    osc.frequency.value = baseFreq;

    const lfo = ctx.createOscillator();
    lfo.type = "square";
    lfo.frequency.value = fireRates[profile];
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.12;
    lfo.connect(lfoGain).connect(idleGain.gain);

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 600;

    osc.connect(lp).connect(idleGain);
    osc.start(t0 + startAt);
    lfo.start(t0 + startAt);

    this.idleNodes = [osc, lfo, lfoGain, idleGain, lp];
  }

  stopEngine() {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    this.idleNodes.forEach((n) => {
      if (n instanceof OscillatorNode) {
        try {
          n.stop(t + 0.05);
        } catch {
          /* already stopped */
        }
      }
      if (n instanceof GainNode) {
        n.gain.cancelScheduledValues(t);
        n.gain.linearRampToValueAtTime(0.0001, t + 0.05);
      }
    });
    this.idleNodes = [];
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
      this.idleTimer = null;
    }
  }
}

export const sound = new SoundEngine();
