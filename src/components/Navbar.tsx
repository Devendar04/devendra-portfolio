import { useState, useEffect, useRef } from "react";

/* ── UI Pop Sound Engine (From ProjectSoundEngine Reference) ────────── */
class NavbarSoundEngine {
  private ctx: AudioContext | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) this.ctx = new AC();
    } catch (e) {
      console.warn("Web Audio API not supported in this browser.");
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

  /* Snappy Mechanical Pop — Noise burst + low triangle punch */
  public pop() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    // 1. High-frequency noise snap
    const bufLen = Math.floor(ctx.sampleRate * 0.015);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, t);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.15, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.015);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(t);

    // 2. Low-end triangle body punch
    const subOsc = ctx.createOscillator();
    const subGain = ctx.createGain();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(150, t);
    subGain.gain.setValueAtTime(0.12, t);
    subGain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
    
    subOsc.connect(subGain);
    subGain.connect(ctx.destination);
    subOsc.start(t);
    subOsc.stop(t + 0.03);
  }

  public destroy() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const soundEngineRef = useRef<NavbarSoundEngine | null>(null);

  useEffect(() => {
    const engine = new NavbarSoundEngine();
    soundEngineRef.current = engine;

    const handleWarmup = () => engine.init();
    window.addEventListener('click', handleWarmup);
    window.addEventListener('touchstart', handleWarmup);

    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener('click', handleWarmup);
      window.removeEventListener('touchstart', handleWarmup);
      window.removeEventListener("scroll", onScroll);
      engine.destroy();
    };
  }, []);

  const handleScroll = (targetId: string) => {
    // Triggers the exact custom arrow button click pop sound!
    if (soundEngineRef.current) {
      soundEngineRef.current.pop();
    }

    const id = targetId.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 border-b-2 border-foreground"
      style={{
        background: scrolled ? "rgba(255,253,245,0.95)" : "rgba(255,253,245,0.8)",
        backdropFilter: "blur(10px)",
        transition: "background 0.3s",
      }}
    >
      {/* Logo */}
      <span className="font-outfit font-black text-xl text-foreground">
        dev<span className="text-accent">.</span>dp
      </span>

      {/* Links */}
      <div className="hidden md:flex items-center gap-2">
        {links.map((l) => (
          <button
            key={l.label}
            onClick={() => handleScroll(l.href)}
            className="font-outfit font-bold text-sm text-foreground px-4 py-1.5 rounded-full border-2 border-transparent
            hover:border-foreground hover:bg-tertiary transition-all duration-200"
            style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => handleScroll("#contact")}
          className="font-outfit font-bold text-sm text-white px-5 py-2 rounded-full border-2 border-foreground
            bg-accent shadow-pop transition-all duration-200
            hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover
            active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"
          style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          Hire Me ✨
        </button>
      </div>

      {/* Mobile CTA */}
      <button
        onClick={() => handleScroll("#contact")}
        className="md:hidden font-outfit font-bold text-sm text-white px-4 py-2 rounded-full
          border-2 border-foreground bg-accent shadow-pop"
      >
        Hire Me
      </button>
    </nav>
  );
}