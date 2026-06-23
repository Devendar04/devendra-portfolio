import { useState, useEffect, useRef } from "react";
import Magnet from "../ui/Magnet";
import FadeIn from "../ui/FadeIn";
import CountUp from "../ui/CountUp"; // Import the new component
import { HERO_STATS } from "../data";

import avatarNeutral from "../assets/avatar.png";
import avatarSmile from "../assets/avatar-smile2.png";

type AvatarState = "neutral" | "smile";

const ROTATING_WORDS = ["Talk", "Connect", "Collaborate", "Build"];

/* ── UI Pop Sound Engine ────────────────────────────────────────────── */
class HeroSoundEngine {
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

function AnimatedAvatar() {
  const [state, setState] = useState<AvatarState>("neutral");
  const [hovered, setHovered] = useState(false);
  const blinkTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    setHovered(true);
    if (blinkTimer.current) clearTimeout(blinkTimer.current);
    setState("smile");
  };
  const handleLeave = () => {
    setHovered(false);
    setState("neutral");
  };

  return (
    <div
      className="relative select-none"
      style={{ width: 380, height: 380 }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <div
        className="absolute -top-7 right-4 w-12 h-12 rounded-full border-2 border-foreground float-1 z-20 pointer-events-none"
        style={{ background: "#F472B6" }}
      />
      <div
        className="absolute bottom-4 -left-7 w-10 h-10 rounded-lg border-2 border-foreground float-2 z-20 pointer-events-none"
        style={{ background: "#FBBF24" }}
      />
      <div
        className="absolute top-14 -left-10 float-3 z-20 pointer-events-none"
        style={{
          width: 0,
          height: 0,
          borderLeft: "20px solid transparent",
          borderRight: "20px solid transparent",
          borderBottom: "36px solid #F472B6",
          filter: "drop-shadow(2px 2px 0px #1E293B)",
        }}
      />
      <div
        className="absolute -bottom-4 -right-4 w-10 h-10 rounded-lg border-2 border-foreground float-4 z-20 pointer-events-none"
        style={{ background: "#34D399" }}
      />

      <div
        className="absolute pointer-events-none z-30"
        style={{
          top: "-40px",
          left: "50%",
          transform: `translateX(-50%) scale(${hovered ? 1 : 0}) translateY(${hovered ? 0 : 10}px)`,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1)",
          fontSize: "28px",
        }}
      >
        😄
      </div>
      <div
        className="absolute pointer-events-none z-30"
        style={{
          top: "6%",
          right: "-34px",
          transform: `scale(${hovered ? 1 : 0}) rotate(${hovered ? "15deg" : "0deg"})`,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.07s",
          fontSize: "22px",
        }}
      >
        ✨
      </div>
      <div
        className="absolute pointer-events-none z-30"
        style={{
          bottom: "10%",
          right: "-30px",
          transform: `scale(${hovered ? 1 : 0}) rotate(${hovered ? "-10deg" : "0deg"})`,
          transition: "transform 0.35s cubic-bezier(0.34,1.56,0.64,1) 0.13s",
          fontSize: "20px",
        }}
      >
        💡
      </div>

      <div
        className="relative w-full h-full rounded-full overflow-hidden"
        style={{
          border: "3px solid #1E293B",
          boxShadow: hovered ? "10px 10px 0px #1E293B" : "8px 8px 0px #1E293B",
          transform: hovered
            ? "scale(1.03) rotate(-1deg)"
            : "scale(1) rotate(0deg)",
          transition:
            "transform 0.4s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s ease",
          cursor: "pointer",
        }}
      >
        <img
          src={avatarNeutral}
          alt="Devendra neutral"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: state === "neutral" ? 1 : 0,
            transition: "opacity 0.18s ease-out",
          }}
        />
        
        <img
          src={avatarSmile}
          alt="Devendra smile"
          draggable={false}
          className="absolute inset-0 w-full h-full object-cover object-top"
          style={{
            opacity: state === "smile" ? 1 : 0,
            transition: "opacity 0.22s ease-out",
          }}
        />
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [wordIndex, setWordIndex] = useState(0);
  const [hoveredStatIndex, setHoveredStatIndex] = useState<number | null>(null);
  const soundEngineRef = useRef<HeroSoundEngine | null>(null);

  useEffect(() => {
    const engine = new HeroSoundEngine();
    soundEngineRef.current = engine;

    const handleWarmup = () => engine.init();
    window.addEventListener('click', handleWarmup);
    window.addEventListener('touchstart', handleWarmup);

    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % ROTATING_WORDS.length);
    }, 2500);

    return () => {
      clearInterval(interval);
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
    <section
      id="hero"
      className="relative min-h-screen grid grid-cols-1 md:grid-cols-2 gap-8
        items-center px-6 sm:px-10 md:px-16 pt-24 pb-16 overflow-hidden"
    >
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-30 pointer-events-none"
        style={{ background: "#FBBF24" }}
      />
      <div className="absolute top-0 right-0 w-1/2 h-full dot-grid opacity-50 pointer-events-none" />

      {/* LEFT CONTENT */}
      <div className="relative z-10 w-full min-w-0">
        <FadeIn delay={0}>
          <div className="inline-flex items-center gap-2 bg-white border-2 border-foreground rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-6 shadow-pop">
            <span className="w-2 h-2 rounded-full bg-quaternary blink-dot" />
            Available for opportunities
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1
            className="font-outfit font-black leading-none tracking-tight mb-3"
            style={{ fontSize: "clamp(46px, 6vw, 76px)" }}
          >
            Devendra
            <br />
            <span className="text-accent relative inline-block">
              Prajapat
              <span
                className="absolute left-0 right-0 h-1 bg-accent"
                style={{ bottom: "-4px" }}
              />
            </span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="font-outfit font-extrabold text-base sm:text-lg text-muted-fg mb-4 mt-3">
            AI/ML Engineer · B.Tech CS · Generative AI
          </p>
        </FadeIn>

        <FadeIn delay={0.3}>
          <p className="text-muted-fg text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-medium">
            Building production-grade AI — deepfake detectors, agentic robots,
            offline LLMs. From research to real deployment.
          </p>
        </FadeIn>

        <FadeIn delay={0.4}>
          <div className="flex gap-4 flex-wrap mb-10 items-center">
            <a
              href="#contact"
              onClick={triggerSound}
              className="inline-flex items-center gap-1 font-outfit font-extrabold text-white text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full border-2 border-foreground bg-accent shadow-pop transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:translate-x-0.5 active:translate-y-0.5"
              style={{
                transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              <span className="flex items-center ">
                Let&apos;s&nbsp;
                <span className="relative inline-flex flex-col overflow-hidden h-[15px] sm:h-[24px] min-w-[85px] sm:min-w-[110px] self-center">
                  {ROTATING_WORDS.map((word, index) => {
                    const isActive = index === wordIndex;
                    const isPrev =
                      index ===
                      (wordIndex - 1 + ROTATING_WORDS.length) %
                        ROTATING_WORDS.length;

                    let transformY = "translateY(100%)";
                    let opacity = 0;
                    if (isActive) {
                      transformY = "translateY(0%)";
                      opacity = 1;
                    } else if (isPrev) {
                      transformY = "translateY(-100%)";
                      opacity = 0;
                    }

                    return (
                      <span
                        key={word}
                        className="absolute left-0 font-extrabold tracking-wide text-left block w-full text-sm sm:text-base top-0 leading-none"
                        style={{
                          transform: transformY,
                          opacity: opacity,
                          transition:
                            "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.4s ease",
                        }}
                      >
                        {word}
                      </span>
                    );
                  })}
                </span>
              </span>
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#8B5CF6"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </span>
            </a>

            <a
              href="#projects"
              onClick={triggerSound}
              className="inline-flex items-center gap-2 font-outfit font-extrabold text-foreground text-sm sm:text-base px-6 sm:px-8 py-3 rounded-full border-2 border-foreground transition-all duration-200 hover:bg-tertiary hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop"
              style={{
                transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
              }}
            >
              View Projects →
            </a>
          </div>
        </FadeIn>

        {/* STATS SECTION FEATURING DYNAMIC COUNTERS */}
        <FadeIn delay={0.5}>
          <div className="flex gap-3 flex-wrap max-w-xl">
            {HERO_STATS.map((s, index) => {
              const isFloat = s.value.includes(".");
              const numericValue =
                parseFloat(s.value.replace(/[^0-9.]/g, "")) || 0;
              const suffix = s.value.replace(/[0-9.]/g, "");

              return (
                <div
                  key={s.label}
                  className="bg-white border-2 border-foreground rounded-2xl px-4 py-3 text-center shadow-pop min-w-[95px] flex-1 sm:flex-initial transition-transform duration-200"
                  onMouseEnter={() => setHoveredStatIndex(index)}
                  onMouseLeave={() => setHoveredStatIndex(null)}
                >
                  <div
                    className="font-outfit font-black text-xl sm:text-2xl leading-none"
                    style={{ color: s.color }}
                  >
                    <CountUp
                      to={numericValue}
                      decimals={isFloat ? 1 : 0}
                      triggerKey={
                        hoveredStatIndex === index
                          ? `hover-${index}-${Date.now()}`
                          : undefined
                      }
                    />
                    {suffix}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wide text-muted-fg mt-1">
                    {s.label}
                  </div>
                </div>
              );
            })}
          </div>
        </FadeIn>
      </div>

      {/* RIGHT AVATAR */}
      <div className="relative z-10 hidden md:flex justify-center items-center">
        <Magnet padding={160} strength={3}>
          <AnimatedAvatar />
        </Magnet>
      </div>
    </section>
  );
}