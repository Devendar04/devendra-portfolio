import { useState, useEffect, useRef } from "react";
import { CONTACT_LINKS } from "../data";
import VariableProximity from "../ui/VariableProximity";

const EMAIL = "parjapatsunny12@gmail.com";

/* ── UI Pop Sound Engine ────────────────────────────────────────────── */
class ContactSoundEngine {
  private ctx: AudioContext | null = null;

  public init() {
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

  public pop() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

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

export default function ContactSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const soundEngineRef = useRef<ContactSoundEngine | null>(null);

  useEffect(() => {
    const engine = new ContactSoundEngine();
    soundEngineRef.current = engine;

    const handleWarmup = () => engine.init();
    window.addEventListener('click', handleWarmup);
    window.addEventListener('touchstart', handleWarmup);

    return () => {
      window.removeEventListener('click', handleWarmup);
      window.removeEventListener('touchstart', handleWarmup);
      engine.destroy();
    };
  }, []);

  const triggerSound = () => {
    if (soundEngineRef.current) {
      soundEngineRef.current.pop();
    }
  };

  return (
    <section id="contact" className="px-6 md:px-16 pb-20">
      <div
        ref={containerRef}
        className="relative bg-accent border-[3px] border-foreground rounded-[32px]
          px-8 md:px-16 py-16 text-center overflow-hidden"
        style={{ boxShadow: "8px 8px 0px #1E293B" }}
      >
        {/* Floating Shapes */}
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "rgba(251,191,36,0.25)" }}
        />
        <div
          className="absolute top-6 left-10 w-10 h-10 rounded-full border-2 float-1 pointer-events-none"
          style={{ background: "#FBBF24", borderColor: "#1E293B" }}
        />
        <div
          className="absolute bottom-8 right-12 w-8 h-8 rounded-lg border-2 float-2 pointer-events-none"
          style={{ background: "#F472B6", borderColor: "#1E293B" }}
        />

        <div className="relative z-10">
          {/* Headline wrapper clears layout overlapping */}
          <h2
            className="font-outfit font-black text-white mb-3 tracking-tight leading-tight pointer-events-none select-none"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            <span className="inline-block pointer-events-auto">
              <VariableProximity
                label="Let's Build Something "
                containerRef={containerRef}
                radius={95}
                falloff="linear"
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
              />
            </span>
            <br />
            <span className="inline-block pointer-events-auto">
              <VariableProximity
                label="Amazing with AI"
                containerRef={containerRef}
                radius={95}
                falloff="linear"
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
              />
            </span>
            <span className="inline-block select-none ml-2 pointer-events-none">🚀</span>
          </h2>

          <p className="text-white/80 text-base mb-10">
            Open to internships, collaborations, and research in ML/AI.
          </p>

          <div className="flex justify-center flex-wrap gap-3 relative z-20">
            {/* Email Button */}
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
              onClick={triggerSound}
              className="inline-flex items-center gap-2 bg-white text-foreground font-outfit
                font-bold text-sm px-5 py-3 rounded-full border-2 border-foreground
                shadow-pop transition-all duration-200
                hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover hover:bg-tertiary
                active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"
              style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              📧 Email Me
            </a>

            {/* Dynamic Contact Links */}
            {CONTACT_LINKS.filter((l) => !l.href.startsWith("mailto")).map((l) => {
              const isExternal = l.href.startsWith("http");
              const linkObj = l as { label: string; href: string; download?: string };
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  download={linkObj.download ?? undefined}
                  onClick={triggerSound}
                  className="inline-flex items-center gap-2 bg-white text-foreground font-outfit
                    font-bold text-sm px-5 py-3 rounded-full border-2 border-foreground
                    shadow-pop transition-all duration-200
                    hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover hover:bg-tertiary
                    active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"
                  style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}