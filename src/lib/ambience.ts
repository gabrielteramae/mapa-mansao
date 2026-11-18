import type { RoomId } from "@/lib/layout";

export type AmbienceSnap = {
  want: boolean;
  live: boolean;
};

const STORAGE = "mansao-r6-sound";
const MASTER = 0.72;
const SERVER_SNAP: AmbienceSnap = { want: true, live: false };

type Layer = "air" | "whir" | "screen" | "drone" | "warm" | "tv" | "sub";

const MIX: Record<RoomId, Record<Layer, number>> = {
  geral: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
  setup: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
  consoles: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
  arena: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
  mural: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
  lounge: { air: 0, whir: 0, screen: 0, drone: 0, warm: 0, tv: 0, sub: 0 },
};

type SnapListener = () => void;

let snap: AmbienceSnap = { want: true, live: false };
const listeners = new Set<SnapListener>();

function emit(next: Partial<AmbienceSnap>) {
  snap = { ...snap, ...next };
  for (const fn of listeners) fn();
}

function subscribe(fn: SnapListener) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function getSnapshot() {
  return snap;
}

function getServerSnapshot() {
  return SERVER_SNAP;
}

function createCtx() {
  if (typeof window === "undefined") return null;
  const w = window as Window & { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;
  return new Ctor();
}

function pinkBuffer(ctx: AudioContext, seconds = 4) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  let b0 = 0;
  let b1 = 0;
  let b2 = 0;
  let b3 = 0;
  let b4 = 0;
  let b5 = 0;
  let b6 = 0;
  for (let i = 0; i < len; i++) {
    const white = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + white * 0.0555179;
    b1 = 0.99332 * b1 + white * 0.0750759;
    b2 = 0.969 * b2 + white * 0.153852;
    b3 = 0.8665 * b3 + white * 0.3104856;
    b4 = 0.55 * b4 + white * 0.5329522;
    b5 = -0.7616 * b5 - white * 0.016898;
    data[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
    b6 = white * 0.115926;
  }
  let peak = 0.0001;
  for (let i = 0; i < len; i++) peak = Math.max(peak, Math.abs(data[i]!));
  const norm = 0.42 / peak;
  for (let i = 0; i < len; i++) data[i] = data[i]! * norm;
  return buffer;
}

function noiseBurst(ctx: AudioContext, seconds: number, curve: number) {
  const len = Math.max(1, Math.floor(ctx.sampleRate * seconds));
  const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < len; i++) {
    const t = i / len;
    data[i] = (Math.random() * 2 - 1) * Math.exp(-t * curve);
  }
  return buffer;
}

class Engine {
  private ctx: AudioContext | null = null;
  private built = false;
  private room: RoomId = "geral";
  private master: GainNode | null = null;
  private foley: GainNode | null = null;
  private mixes = new Map<Layer, GainNode>();
  private click: AudioBuffer | null = null;
  private stepBuf: AudioBuffer | null = null;
  private clock = 0;
  private voices = 0;
  private resumeTimer = 0;
  private music: GainNode | null = null;
  private musicOn = false;
  private nextStep = 0;
  private stepIndex = 0;
  private musicTimer = 0;

  hydrate() {
    try {
      if (localStorage.getItem(STORAGE) === "off") emit({ want: false });
    } catch {
      /* private mode */
    }
  }

  setRoom(room: RoomId) {
    if (room === this.room) return;
    this.room = room;
    if (!this.built) return;
    this.applyMix(snap.live ? 1.25 : 0.05);
  }

  gesture() {
    if (!snap.want) return;
    if (!snap.live) this.start();
    else if (this.ctx?.state === "suspended") void this.ctx.resume();
  }

  toggle() {
    const want = !snap.want;
    try {
      localStorage.setItem(STORAGE, want ? "on" : "off");
    } catch {
      /* ignore */
    }
    emit({ want, live: want ? snap.live : false });
    if (want) this.start();
    else this.fadeOut();
  }

  onHide() {
    if (typeof document !== "undefined" && document.hidden) void this.ctx?.suspend();
    else if (snap.want && snap.live) void this.ctx?.resume();
  }

  private start() {
    if (!this.ctx) this.ctx = createCtx();
    const ctx = this.ctx;
    if (!ctx) return;
    if (!this.built) this.build(ctx);
    this.ensureClock();
    void ctx.resume().then(() => {
      if (!snap.want || !this.master) return;
      this.applyMix(0.8);
      this.ramp(this.master.gain, MASTER, 0.6);
      this.startMusic();
      emit({ live: true });
    });
  }

  private fadeOut() {
    this.musicOn = false;
    if (this.music) this.ramp(this.music.gain, 0, 0.35);
    if (this.master && this.ctx) this.ramp(this.master.gain, 0, 0.28);
    window.clearTimeout(this.resumeTimer);
    this.resumeTimer = window.setTimeout(() => {
      if (!snap.want) void this.ctx?.suspend();
    }, 380);
  }

  private build(ctx: AudioContext) {
    const master = ctx.createGain();
    master.gain.value = 0;
    const comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -18;
    comp.knee.value = 16;
    comp.ratio.value = 2.4;
    comp.attack.value = 0.012;
    comp.release.value = 0.28;
    master.connect(comp);
    comp.connect(ctx.destination);
    this.master = master;

    const foley = ctx.createGain();
    foley.gain.value = 0.85;
    foley.connect(master);
    this.foley = foley;

    const pink = pinkBuffer(ctx, 2);
    const noise = ctx.createBufferSource();
    noise.buffer = pink;
    noise.loop = true;
    noise.start();

    this.layerNoise(ctx, noise, "air", "lowpass", 920, 0.45, master);
    const whir = this.layerNoise(ctx, noise, "whir", "bandpass", 740, 0.65, master);
    this.wobble(ctx, whir, 0.27, 0.22);
    this.wobble(ctx, whir, 9.5, 0.06);
    const tv = this.layerNoise(ctx, noise, "tv", "bandpass", 1500, 0.55, master);
    this.wobble(ctx, tv, 5.4, 0.38);

    const screen = this.bus(ctx, master);
    this.toneNode(ctx, 238, "triangle", 0.02, screen);
    this.toneNode(ctx, 241.6, "triangle", 0.014, screen);
    this.toneNode(ctx, 476, "sine", 0.008, screen);
    this.mixes.set("screen", screen);

    const drone = this.bus(ctx, master);
    this.toneNode(ctx, 98, "sine", 0.05, drone);
    this.toneNode(ctx, 146.8, "sine", 0.034, drone);
    this.toneNode(ctx, 196, "sine", 0.016, drone);
    const droneMotion = ctx.createGain();
    droneMotion.gain.value = 1;
    this.rewire(drone, droneMotion, master);
    this.wobble(ctx, droneMotion, 0.08, 0.18);
    this.mixes.set("drone", drone);

    const warm = this.bus(ctx, master);
    this.toneNode(ctx, 174.6, "sine", 0.03, warm);
    this.toneNode(ctx, 220.4, "sine", 0.022, warm);
    this.toneNode(ctx, 261.6, "sine", 0.016, warm);
    this.mixes.set("warm", warm);

    const sub = this.bus(ctx, master);
    this.toneNode(ctx, 58, "sine", 0.09, sub);
    this.toneNode(ctx, 116, "sine", 0.035, sub);
    const subMotion = ctx.createGain();
    subMotion.gain.value = 0.42;
    this.rewire(sub, subMotion, master);
    this.wobble(ctx, subMotion, 1.65, 0.4);
    this.mixes.set("sub", sub);

    this.click = noiseBurst(ctx, 0.04, 22);
    this.stepBuf = noiseBurst(ctx, 0.11, 9);
    this.built = true;
    this.applyMix(0.05);
  }

  private bus(ctx: AudioContext, master: GainNode) {
    const g = ctx.createGain();
    g.gain.value = 0;
    g.connect(master);
    return g;
  }

  private layerNoise(
    ctx: AudioContext,
    noise: AudioNode,
    id: Layer,
    type: BiquadFilterType,
    freq: number,
    q: number,
    master: GainNode,
  ) {
    const filter = ctx.createBiquadFilter();
    filter.type = type;
    filter.frequency.value = freq;
    filter.Q.value = q;
    const motion = ctx.createGain();
    motion.gain.value = 1;
    const mix = this.bus(ctx, master);
    noise.connect(filter);
    filter.connect(motion);
    motion.connect(mix);
    this.mixes.set(id, mix);
    return motion;
  }

  private rewire(mix: GainNode, motion: GainNode, master: GainNode) {
    mix.disconnect();
    mix.connect(motion);
    motion.connect(master);
  }

  private toneNode(
    ctx: AudioContext,
    freq: number,
    type: OscillatorType,
    gain: number,
    dest: AudioNode,
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(dest);
    osc.start();
  }

  private wobble(ctx: AudioContext, node: GainNode, rate: number, depth: number) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.frequency.value = rate;
    g.gain.value = depth;
    osc.connect(g);
    g.connect(node.gain);
    osc.start();
  }

  private applyMix(seconds: number) {
    const mix = MIX[this.room];
    for (const [id, node] of this.mixes) {
      this.ramp(node.gain, mix[id] * 0.16, seconds);
    }
  }

  private ramp(param: AudioParam, value: number, seconds: number) {
    const ctx = this.ctx;
    if (!ctx) return;
    const t = ctx.currentTime;
    param.cancelScheduledValues(t);
    if (seconds <= 0.02) {
      param.setValueAtTime(value, t);
      return;
    }
    param.setValueAtTime(param.value, t);
    param.linearRampToValueAtTime(value, t + seconds);
  }

  private startMusic() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    if (!this.music) {
      const bus = ctx.createGain();
      bus.gain.value = 0;
      const filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 880;
      filter.Q.value = 0.4;
      bus.connect(filter);
      filter.connect(this.master);
      this.music = bus;
    }
    this.musicOn = true;
    if (this.nextStep < ctx.currentTime) this.nextStep = ctx.currentTime + 0.08;
    if (!this.musicTimer) this.musicTimer = window.setInterval(() => this.pumpMusic(), 40);
    this.ramp(this.music.gain, 0.22, 1.2);
  }

  private pumpMusic() {
    const ctx = this.ctx;
    const dest = this.music;
    if (!ctx || !dest || !this.musicOn || !snap.want || ctx.state !== "running") return;
    if (this.nextStep < ctx.currentTime - 0.2) this.nextStep = ctx.currentTime + 0.05;
    const step = 5.5;
    while (this.nextStep < ctx.currentTime + 0.2) {
      this.playPad(ctx, dest, this.stepIndex % 4, this.nextStep);
      this.nextStep += step;
      this.stepIndex += 1;
    }
  }

  private playPad(ctx: AudioContext, dest: GainNode, chord: number, time: number) {
    const chords = [
      [48, 55, 60, 64],
      [45, 52, 57, 60],
      [43, 50, 55, 59],
      [41, 48, 53, 57],
    ];
    for (const midi of chords[chord] ?? []) {
      this.note(ctx, dest, midi, time, 7.2, 0.04, "sine");
      this.note(ctx, dest, midi + 12, time, 6.4, 0.016, "triangle");
    }
  }

  private note(
    ctx: AudioContext,
    dest: GainNode,
    midi: number,
    time: number,
    dur: number,
    gain: number,
    type: OscillatorType,
  ) {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(gain, time + 0.03);
    g.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(g);
    g.connect(dest);
    osc.start(time);
    osc.stop(time + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  private ensureClock() {
    if (this.clock) return;
    this.clock = window.setInterval(() => this.spice(), 240);
  }

  private spice() {
    return;
  }

  private key() {
    if (!this.click) return;
    this.burst(this.click, {
      rate: 0.72 + Math.random() * 0.7,
      gain: 0.16 + Math.random() * 0.08,
      filter: { type: "highpass", freq: 1400, q: 0.7 },
    });
  }

  private foot() {
    if (!this.stepBuf) return;
    this.burst(this.stepBuf, {
      rate: 0.75 + Math.random() * 0.5,
      gain: 0.22,
      filter: { type: "lowpass", freq: 280, q: 0.6 },
    });
  }

  private blip() {
    this.voice(520 + Math.random() * 280, 0.07, 0.045, "sine", 320);
  }

  private tick(freq: number, dur: number, gain: number) {
    this.voice(freq, dur, gain, "sine");
  }

  private roundCue() {
    this.voice(880, 0.08, 0.05, "sine");
    window.setTimeout(() => {
      if (snap.live && this.room === "arena") this.voice(660, 0.12, 0.04, "sine");
    }, 110);
  }

  private fridge() {
    this.voice(150, 1.15, 0.045, "triangle", 95);
    if (this.click) {
      this.burst(this.click, {
        rate: 0.45,
        gain: 0.12,
        filter: { type: "lowpass", freq: 500, q: 0.4 },
      });
    }
  }

  private creak() {
    this.voice(210 + Math.random() * 40, 0.22, 0.04, "triangle", 90);
  }

  private burst(
    buffer: AudioBuffer,
    opts: {
      rate: number;
      gain: number;
      filter?: { type: BiquadFilterType; freq: number; q?: number };
    },
  ) {
    const ctx = this.ctx;
    const foley = this.foley;
    if (!ctx || !foley || this.voices > 10) return;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.playbackRate.value = opts.rate;
    let node: AudioNode = src;
    const extra: AudioNode[] = [];
    if (opts.filter) {
      const filter = ctx.createBiquadFilter();
      filter.type = opts.filter.type;
      filter.frequency.value = opts.filter.freq;
      filter.Q.value = opts.filter.q ?? 0.7;
      src.connect(filter);
      node = filter;
      extra.push(filter);
    }
    const g = ctx.createGain();
    g.gain.value = opts.gain;
    node.connect(g);
    g.connect(foley);
    this.voices += 1;
    src.onended = () => {
      this.voices = Math.max(0, this.voices - 1);
      src.disconnect();
      g.disconnect();
      for (const n of extra) n.disconnect();
    };
    src.start();
  }

  private voice(freq: number, dur: number, gain: number, type: OscillatorType, slide?: number) {
    const ctx = this.ctx;
    const foley = this.foley;
    if (!ctx || !foley || this.voices > 10) return;
    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(Math.max(40, freq), t);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(Math.max(0.0001, gain), t + Math.min(0.03, dur * 0.35));
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(g);
    g.connect(foley);
    this.voices += 1;
    osc.onended = () => {
      this.voices = Math.max(0, this.voices - 1);
      osc.disconnect();
      g.disconnect();
    };
    osc.start(t);
    osc.stop(t + dur + 0.03);
  }
}

const globalKey = "__mansaoAmbienceChip";

function engine() {
  const g = globalThis as typeof globalThis & { [globalKey]?: Engine };
  if (!g[globalKey]) g[globalKey] = new Engine();
  return g[globalKey];
}

export const ambience = {
  subscribe,
  getSnapshot,
  getServerSnapshot,
  hydrate: () => engine().hydrate(),
  setRoom: (room: RoomId) => engine().setRoom(room),
  gesture: () => engine().gesture(),
  toggle: () => engine().toggle(),
  onHide: () => engine().onHide(),
};
