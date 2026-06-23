import { useState, useCallback, useRef } from 'react'
import { MARQUEE_ROW1, MARQUEE_ROW2 } from '../data'

/* ── Playful Toy / Memphis Sound Engine ────────────────────────────────
   lift()    → light wooden tap (hover — like tapping a toy button)
   drop()    → wooden thud (pill dragged down — heavy toy press)
   respawn() → short chime ping (pill pops back in — reward/return)
   ─────────────────────────────────────────────────────────────────── */
class MarqueeSoundEngine {
  private ctx: AudioContext | null = null;
  private lastLiftTime: number = 0;

  private init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch (e) {
      console.warn("Web Audio API not supported.");
    }
  }

  private getCtx(): AudioContext | null {
    if (this.ctx) {
      if (this.ctx.state === 'suspended') this.ctx.resume();
      return this.ctx;
    }
    this.init();
    return this.ctx;
  }

  /* Light wooden tap — throttled to prevent stutter spam on hover */
  lift() {
    const now = performance.now();
    if (now - this.lastLiftTime < 150) return;
    this.lastLiftTime = now;

    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Very short, soft wood knock — like touching a wooden bead
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(680, t);
    osc.frequency.exponentialRampToValueAtTime(380, t + 0.018);
    gain.gain.setValueAtTime(0.055, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.025);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.026);

    // Tiny surface snap
    const snapLen = Math.floor(ctx.sampleRate * 0.008);
    const snapBuf = ctx.createBuffer(1, snapLen, ctx.sampleRate);
    const snapData = snapBuf.getChannelData(0);
    for (let i = 0; i < snapLen; i++) snapData[i] = Math.random() * 2 - 1;
    const snapSrc = ctx.createBufferSource();
    snapSrc.buffer = snapBuf;
    const snapFilter = ctx.createBiquadFilter();
    snapFilter.type = 'bandpass';
    snapFilter.frequency.setValueAtTime(2200, t);
    snapFilter.Q.setValueAtTime(5, t);
    const snapGain = ctx.createGain();
    snapGain.gain.setValueAtTime(0.035, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.008);
    snapSrc.connect(snapFilter);
    snapFilter.connect(snapGain);
    snapGain.connect(ctx.destination);
    snapSrc.start(t);
  }

  /* Wooden thud — pill dragged off-screen downward, like a toy block dropped */
  drop() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(280, t);
    osc.frequency.exponentialRampToValueAtTime(95, t + 0.085);
    gain.gain.setValueAtTime(0.11, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.10);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.11);

    // Low body knock
    const thudLen = Math.floor(ctx.sampleRate * 0.020);
    const thudBuf = ctx.createBuffer(1, thudLen, ctx.sampleRate);
    const thudData = thudBuf.getChannelData(0);
    for (let i = 0; i < thudLen; i++) thudData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (thudLen * 0.25));
    const thudSrc = ctx.createBufferSource();
    thudSrc.buffer = thudBuf;
    const thudFilter = ctx.createBiquadFilter();
    thudFilter.type = 'lowpass';
    thudFilter.frequency.setValueAtTime(700, t);
    const thudGain = ctx.createGain();
    thudGain.gain.setValueAtTime(0.06, t);
    thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.020);
    thudSrc.connect(thudFilter);
    thudFilter.connect(thudGain);
    thudGain.connect(ctx.destination);
    thudSrc.start(t);
  }

  /* Chime ping — pill pops back in from top, reward / return feeling */
  respawn() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // Two-partial chime: fundamental + 5th
    const partials = [
      { freq: 1318, gain: 0.055, dur: 0.28 }, // E6
      { freq: 1976, gain: 0.028, dur: 0.18 }, // B6 — 5th above
    ];

    partials.forEach(({ freq, gain, dur }) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      g.gain.setValueAtTime(gain, t);
      g.gain.setValueAtTime(gain * 0.55, t + 0.010);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(g);
      g.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + dur + 0.01);
    });

    // Attack click
    const clickLen = Math.floor(ctx.sampleRate * 0.005);
    const clickBuf = ctx.createBuffer(1, clickLen, ctx.sampleRate);
    const clickData = clickBuf.getChannelData(0);
    for (let i = 0; i < clickLen; i++) clickData[i] = (Math.random() * 2 - 1) * (1 - i / clickLen);
    const clickSrc = ctx.createBufferSource();
    clickSrc.buffer = clickBuf;
    const clickFilter = ctx.createBiquadFilter();
    clickFilter.type = 'highpass';
    clickFilter.frequency.setValueAtTime(4500, t);
    const clickGain = ctx.createGain();
    clickGain.gain.setValueAtTime(0.055, t);
    clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.005);
    clickSrc.connect(clickFilter);
    clickFilter.connect(clickGain);
    clickGain.connect(ctx.destination);
    clickSrc.start(t);
  }

  destroy() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

const soundEngine = new MarqueeSoundEngine();

/* ── pill style map ─────────────────────────────────────────── */
const PILL_STYLES: Record<string, { base: string; shadow: string }> = {
  violet:  { base: 'bg-accent text-white border-foreground',    shadow: '3px 3px 0px #1E293B' },
  pink:    { base: 'bg-secondary text-white border-foreground', shadow: '3px 3px 0px #1E293B' },
  yellow:  { base: 'bg-tertiary text-foreground border-foreground', shadow: '3px 3px 0px #1E293B' },
  emerald: { base: 'bg-quaternary text-foreground border-foreground', shadow: '3px 3px 0px #1E293B' },
  white:   { base: 'bg-white text-foreground border-foreground', shadow: '3px 3px 0px #1E293B' },
}

/* ── animation states ───────────────────────────────────────── */
type PillState = 'idle' | 'hover' | 'dropping' | 'gone' | 'returning'

interface Pill { text: string; style: string }

/* ── invisible safety hitbox styling to eliminate jittering ── */
const inlineHoverStyles = `
  .interactive-marquee-pill {
    position: relative;
  }
  .interactive-marquee-pill::before {
    content: '';
    position: absolute;
    inset: -15px -5px -20px -5px;
    background: transparent;
    pointer-events: auto;
    z-index: -1;
  }
`;

/* ── single interactive pill ───────────────────────────────── */
function InteractivePill({ pill, id }: { pill: Pill; id: string }) {
  const [state, setState] = useState<PillState>('idle')
  const styleMap = PILL_STYLES[pill.style] ?? PILL_STYLES.white

  /* random drop rotation so each pill spins differently */
  const dropRotation = useCallback(() => 
    (Math.random() > 0.5 ? 1 : -1) * (20 + Math.random() * 25),
  [])

  const handleClick = () => {
    if (state !== 'idle' && state !== 'hover') return

    /* 1. drop sound & state */
    soundEngine.drop();
    setState('dropping')

    /* 2. gone — invisible but holds space */
    setTimeout(() => setState('gone'), 550)

    /* 3. returning — fades back in from top with a respawn sound */
    setTimeout(() => {
      soundEngine.respawn();
      setState('returning');
    }, 900)

    /* 4. idle */
    setTimeout(() => setState('idle'), 1200)
  }

  /* ── computed transform per state ── */
  const getTransform = () => {
    switch (state) {
      case 'hover':     return 'translateY(-7px)'
      case 'dropping':  return `translateY(120px) rotate(${dropRotation()}deg)`
      case 'gone':      return `translateY(-30px) rotate(-8deg)`
      case 'returning': return 'translateY(0px) rotate(0deg)'
      default:          return 'translateY(0px) rotate(0deg)'
    }
  }

  const getOpacity = () => {
    switch (state) {
      case 'dropping':  return 0
      case 'gone':      return 0
      case 'returning': return 1
      default:          return 1
    }
  }

  const getShadow = () => {
    switch (state) {
      case 'hover':    return '5px 5px 0px #1E293B'
      case 'dropping': return '0px 0px 0px #1E293B'
      default:         return styleMap.shadow
    }
  }

  const getTransition = () => {
    switch (state) {
      case 'hover':     return 'transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease'
      case 'dropping':  return 'transform 0.5s cubic-bezier(0.55,0,1,0.45), opacity 0.4s ease-in, box-shadow 0.2s ease'
      case 'gone':      return 'none'
      case 'returning': return 'transform 0.35s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease-out'
      default:          return 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease'
    }
  }

  return (
    <>
      <style>{inlineHoverStyles}</style>
      <span
        key={id}
        onClick={handleClick}
        onMouseEnter={() => {
          if (state === 'idle') {
            soundEngine.lift();
            setState('hover');
          }
        }}
        onMouseLeave={() => state === 'hover' && setState('idle')}
        className={`interactive-marquee-pill inline-flex items-center px-5 py-2 rounded-full border-2 font-outfit
          font-bold text-sm whitespace-nowrap select-none ${styleMap.base}`}
        style={{
          boxShadow:  getShadow(),
          transform:  state === 'hover' ? `${getTransform()} scale(1.06)` : getTransform(),
          opacity:    getOpacity(),
          transition: getTransition(),
          cursor:     state === 'idle' || state === 'hover' ? 'pointer' : 'default',
          willChange: 'transform, opacity',
        }}
      >
        {/* little click hint icon on hover */}
        <span
          style={{
            display:    'inline-block',
            width:      state === 'hover' ? '14px' : '0px',
            overflow:   'hidden',
            transition: 'width 0.2s ease',
            marginRight: state === 'hover' ? '4px' : '0px',
            fontSize:   '12px',
          }}
        >
          👇
        </span>
        {pill.text}
      </span>
    </>
  )
}

/* ── pill row ───────────────────────────────────────────────── */
function PillRow({ pills, reverse = false }: { pills: Pill[]; reverse?: boolean }) {
  const [paused, setPaused] = useState(false)
  /* triple for seamless infinite loop */
  const tripled = [...pills, ...pills, ...pills]

  return (
    <div
      className="overflow-hidden py-[0.74rem] "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className={`flex my-[-3px] gap-3  ${reverse ? 'marquee-row-reverse' : 'marquee-row'}`}
        style={{ animationPlayState: paused ? 'paused' : 'running' }}
      >
        {tripled.map((p, i) => (
          <InteractivePill key={`${p.text}-${i}`} pill={p} id={`${p.text}-${i}`} />
        ))}
      </div>
    </div>
  )
}

/* ── section ────────────────────────────────────────────────── */
export default function MarqueeSection() {
  return (
    <div className="border-t-2 border-b-2 border-foreground bg-white py-6 overflow-hidden">
      <p className="text-center font-outfit text-[11px] font-bold tracking-widest uppercase
        text-muted-fg mb-1">
        Tech Stack
      </p>
      <div className="flex flex-col gap-4">
        <PillRow pills={MARQUEE_ROW1} />
        <PillRow pills={MARQUEE_ROW2} reverse />
      </div>
    </div>
  )
}