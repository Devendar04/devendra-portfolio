import { useRef, useState, useEffect, useCallback } from "react";
import FadeIn from "../ui/FadeIn";
import { PROJECTS } from "../data";
import VariableProximity from "../ui/VariableProximity";

const STACK_PILL_COLORS = [
  { bg: "rgba(139,92,246,0.1)", border: "#8B5CF6", color: "#8B5CF6" },
  { bg: "rgba(244,114,182,0.1)", border: "#F472B6", color: "#db2777" },
  { bg: "rgba(251,191,36,0.15)", border: "#FBBF24", color: "#D97706" },
  { bg: "rgba(52,211,153,0.15)", border: "#34D399", color: "#059669" },
];

/* ── Metallic & Ambient Web Audio Sound Engine ─────────────────────────── */
class ProjectSoundEngine {
  private ctx: AudioContext | null = null;
  private rollOsc: OscillatorNode | null = null;
  private rollGain: GainNode | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
        this.setupRollingSynth();
      }
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

  private setupRollingSynth() {
    const ctx = this.ctx;
    if (!ctx) return;

    this.rollOsc = ctx.createOscillator();
    this.rollGain = ctx.createGain();

    this.rollOsc.type = 'sine'; 
    this.rollOsc.frequency.setValueAtTime(120, ctx.currentTime);
    this.rollGain.gain.setValueAtTime(0, ctx.currentTime);

    const lpFilter = ctx.createBiquadFilter();
    lpFilter.type = 'lowpass';
    lpFilter.frequency.setValueAtTime(250, ctx.currentTime);

    this.rollOsc.connect(lpFilter);
    lpFilter.connect(this.rollGain);
    this.rollGain.connect(ctx.destination);
    this.rollOsc.start();
  }

  public updateRollingVelocity(velocity: number) {
    const ctx = this.ctx; 
    if (!ctx || !this.rollGain || !this.rollOsc || ctx.state === 'suspended') return;

    const absVel = Math.abs(velocity);
    const t = ctx.currentTime;

    if (absVel < 0.05) {
      this.rollGain.gain.setTargetAtTime(0, t, 0.05);
    } else {
      const targetGain = Math.min(0.08, absVel * 0.005);
      const targetFreq = Math.min(300, 120 + absVel * 5);
      this.rollGain.gain.setTargetAtTime(targetGain, t, 0.03);
      this.rollOsc.frequency.setTargetAtTime(targetFreq, t, 0.04);
    }
  }

  tick() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const frequencies = [880, 1200, 1760];
    frequencies.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      
      const duration = 0.15 / (index + 1);
      
      gain.gain.setValueAtTime(0.06 / (index + 1), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + duration);
    });
  }

  pop() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const bufLen = Math.floor(ctx.sampleRate * 0.015);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = (Math.random() * 2 - 1);

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

  whoosh() {
    const ctx = this.getCtx();
    if (!ctx) return;
    const t = ctx.currentTime;

    const duration = 0.6; 
    const bufLen = Math.floor(ctx.sampleRate * duration);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const src = ctx.createBufferSource();
    src.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(2600, t + 0.2);
    filter.frequency.exponentialRampToValueAtTime(600, t + duration);
    filter.Q.setValueAtTime(3.0, t); 

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);

    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start(t);
  }

  public suspend() {
    if (this.ctx && this.ctx.state === 'running') {
      this.ctx.suspend();
    }
  }

  destroy() {
    if (this.ctx) {
      if (this.rollOsc) { try { this.rollOsc.stop(); } catch(e){} }
      this.ctx.close();
      this.ctx = null;
    }
  }
}

/* ── Project Card ─────────────────────────────────────────────── */
function ProjectCard({ project }: { project: (typeof PROJECTS)[0]; index: number }) {
  return (
    <div className="w-[82vw] sm:w-[45vw] md:w-[35vw] max-w-md h-[48vh] sm:h-[45vh] md:h-[50vh] shrink-0 pointer-events-auto">
      <div
        className="bg-white border-[3px] border-foreground rounded-[24px] sm:rounded-[32px] p-5 sm:p-6 md:p-8 w-full h-full
          overflow-hidden relative select-none flex flex-col justify-between"
        style={{ boxShadow: project.shadow || "4px 4px 0px 0px #1E293B" }}
      >
        <div className="w-full flex flex-col gap-2 sm:gap-3 relative z-10">
          <div className="flex justify-between items-center w-full">
            <p className="font-outfit text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-muted-fg">
              #{project.num} · {project.cat}
            </p>
            <div className="flex gap-1.5">
              {project.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="font-outfit font-bold text-[10px] sm:text-[11px] text-foreground px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full
                    border border-foreground bg-white shadow-pop transition-all duration-200
                    hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover hover:bg-tertiary"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>
          <h3 className="font-outfit font-black tracking-tight leading-tight text-foreground" style={{ fontSize: "clamp(16px, 4.5vw, 26px)" }}>
            {project.name}
          </h3>
        </div>

        <div className="flex-1 flex flex-col justify-start mt-3 mb-3 relative z-10 overflow-y-auto no-scrollbar">
          <p className="text-muted-fg text-xs sm:text-[13px] leading-relaxed">
            {project.desc}
          </p>
        </div>

        <div className="w-full flex flex-wrap gap-1.5 mt-auto relative z-10">
          {project.stack.slice(0, 4).map((s, i) => {
            const c = STACK_PILL_COLORS[i % STACK_PILL_COLORS.length];
            return (
              <span
                key={s}
                className="font-outfit font-bold text-[9px] sm:text-[10px] px-2.5 py-0.5 sm:py-1 rounded-full border-[1.5px]"
                style={{ background: c.bg, borderColor: c.border, color: c.color }}
              >
                {s}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Projects Section ─────────────────────────────────────────── */
export default function ProjectsSection() {
  const containerRef    = useRef<HTMLDivElement>(null);
  const wheelRef        = useRef<HTMLDivElement>(null);
  const progressBarRef  = useRef<HTMLDivElement>(null);
  const cardRefs        = useRef<(HTMLDivElement | null)[]>([]);

  const rotationRef       = useRef(0);
  const targetRotationRef = useRef(0);
  const velocityRef       = useRef(0);
  const isDragging        = useRef(false);
  const isTouchLocked     = useRef(false);
  const isVerticalScroll  = useRef(false);
  const lastInteraction   = useRef(performance.now());
  const lastCenterTime    = useRef(performance.now());
  const currentCenter     = useRef(0);
  const startX            = useRef(0);
  const startY            = useRef(0);
  const lastX             = useRef(0);
  const lastTime          = useRef(performance.now());
  const rafId             = useRef<number | null>(null);
  const hasDragged        = useRef(false);

  const engineRef         = useRef<ProjectSoundEngine | null>(null);
  const isIntersectingRef = useRef(false);

  const totalItems    = PROJECTS.length;
  const anglePerItem  = 360 / totalItems;
  const [radius, setRadius] = useState(600);
  const [isMobile, setIsMobile] = useState(false);

  /* Audio Context + Intersection Observer Integration */
  useEffect(() => {
    const engine = new ProjectSoundEngine();
    engineRef.current = engine;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isIntersectingRef.current = entry.isIntersecting;
        if (entry.isIntersecting) {
          engine.init();
        } else {
          engine.suspend();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    const wakeAudioContext = () => {
      if (engineRef.current && isIntersectingRef.current) {
        engineRef.current.init();
      }
    };

    window.addEventListener('click', wakeAudioContext);
    window.addEventListener('touchstart', wakeAudioContext);

    return () => {
      observer.disconnect();
      window.removeEventListener('click', wakeAudioContext);
      window.removeEventListener('touchstart', wakeAudioContext);
      engine.destroy();
    };
  }, []);

  useEffect(() => {
    const calc = () => {
      const mobileCheck = window.innerWidth < 640;
      setIsMobile(mobileCheck);
      
      const cw = mobileCheck ? window.innerWidth * 0.82 : window.innerWidth * 0.35;
      setRadius(Math.max(cw / 2 / Math.tan(Math.PI / totalItems) + 130, 380));
    };
    calc();
    window.addEventListener('resize', calc);
    return () => window.removeEventListener('resize', calc);
  }, [totalItems]);

  useEffect(() => {
    const tickLoop = () => {
      const now = performance.now();

      if (isDragging.current && !isVerticalScroll.current) {
        rotationRef.current += (targetRotationRef.current - rotationRef.current) * 0.35;
        lastCenterTime.current = now;
      } else {
        velocityRef.current *= 0.93;
        rotationRef.current += velocityRef.current;

        const closest      = Math.round(-rotationRef.current / anglePerItem);
        const snapped      = -closest * anglePerItem;
        const diff         = snapped - rotationRef.current;
        const settled      = Math.abs(diff) < 0.08 && Math.abs(velocityRef.current) < 0.08;

        if (settled) {
          rotationRef.current  = snapped;
          velocityRef.current  = 0;
          
          // Modulo index wrapping calculation for absolute center checks
          const wrappedClosest = ((closest % totalItems) + totalItems) % totalItems;
          if (wrappedClosest !== currentCenter.current) {
            currentCenter.current   = wrappedClosest;
            lastCenterTime.current  = now;
            if (engineRef.current && isIntersectingRef.current) engineRef.current.tick(); 
          }
          if (now - lastCenterTime.current > 4000 && now - lastInteraction.current > 6000 ) {
            velocityRef.current = (-(closest + 1) * anglePerItem - rotationRef.current) * 0.085;
          }
        } else if (Math.abs(velocityRef.current) < 1) {
          const raw = Math.round(-rotationRef.current / anglePerItem);
          const wrappedRaw = ((raw % totalItems) + totalItems) % totalItems;
          if (wrappedRaw !== currentCenter.current) {
            currentCenter.current = wrappedRaw;
            if (engineRef.current && isIntersectingRef.current) engineRef.current.tick();
          }
          rotationRef.current += diff * 0.015;
        }
      }

      if (engineRef.current && isIntersectingRef.current) {
        engineRef.current.updateRollingVelocity(velocityRef.current);
      }

      if (wheelRef.current) {
        if (isMobile) {
          wheelRef.current.style.transform = `none`;
        } else {
          wheelRef.current.style.transform = `translateZ(-${radius}px) rotateY(${rotationRef.current}deg)`;
        }
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        
        if (isMobile) {
          const cardWidth = window.innerWidth * 0.82;
          const gap = 16;
          const totalWidth = cardWidth + gap;
          
          // Normalized active floating index that wraps seamlessly
          const activeIndex = ((-rotationRef.current / anglePerItem) % totalItems + totalItems) % totalItems;
          
          // Find the raw difference and wrap cards dynamically across shortest circular pathways
          let diff = i - activeIndex;
          if (diff > totalItems / 2) {
            diff -= totalItems;
          } else if (diff < -totalItems / 2) {
            diff += totalItems;
          }
          
          const offset = diff * totalWidth;
          const distFromCenter = Math.abs(diff);
          
          const s = Math.max(0.85, 1 - distFromCenter * 0.12);
          const opacity = Math.max(0, 1 - distFromCenter * 0.75);

          el.style.transform = `translateX(${offset}px) scale(${s})`;
          el.style.opacity = `${opacity}`;
          el.style.filter = distFromCenter > 0.4 ? `blur(0.8px)` : 'none';
          el.style.zIndex = `${Math.round((10 - distFromCenter) * 10)}`;
        } else {
          const itemAngle   = i * anglePerItem;
          const total       = (rotationRef.current + itemAngle) % 360;
          const norm        = total < 0 ? total + 360 : total;
          const dist        = norm > 180 ? 360 - norm : norm;
          const proximity   = Math.max(0, 1 - dist / 80);
          const global      = Math.max(0, 1 - dist / 180);
          const s           = 0.52 + global * 0.33 + proximity * 0.25;
          const opacity     = 0.08 + global * 0.92;
          const blur        = Math.max(0, (1 - proximity) * 4);
          
          el.style.transform = `rotateY(${itemAngle}deg) translateZ(${radius}px) scale(${s})`;
          el.style.opacity   = `${opacity}`;
          el.style.filter    = blur > 0.3 ? `blur(${Math.round(blur * 10) / 10}px) grayscale(40%)` : 'none';
          el.style.zIndex    = `${Math.round(global * 100)}`;
        }
      });

      if (progressBarRef.current) {
        const active = (((-rotationRef.current / anglePerItem) % totalItems) + totalItems) % totalItems;
        progressBarRef.current.style.width = `${((active + 0.5) / totalItems) * 100}%`;
      }

      rafId.current = requestAnimationFrame(tickLoop);
    };

    rafId.current = requestAnimationFrame(tickLoop);
    return () => { if (rafId.current) cancelAnimationFrame(rafId.current); };
  }, [anglePerItem, radius, totalItems, isMobile]);

  const handleDragStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if ((e.target as HTMLElement).closest('a') || (e.target as HTMLElement).closest('button')) return;
    lastInteraction.current    = performance.now();
    isDragging.current         = true;
    isTouchLocked.current      = false;
    isVerticalScroll.current   = false;
    hasDragged.current         = false;
    velocityRef.current        = 0;
    
    const cx = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const cy = 'touches' in e ? e.touches[0].clientY : e.clientY;
    startX.current             = cx;
    startY.current             = cy;
    lastX.current              = cx;
    lastTime.current           = performance.now();
    targetRotationRef.current  = rotationRef.current;
    
    if (engineRef.current && isIntersectingRef.current) engineRef.current.whoosh(); 
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      lastInteraction.current  = performance.now();
      const now = performance.now();
      const dt  = Math.max(1, now - lastTime.current);
      const dx  = e.clientX - lastX.current;
      velocityRef.current         = -(dx / dt) * 10;
      targetRotationRef.current  -= dx * 0.14;
      lastX.current              = e.clientX;
      lastTime.current           = now;
      hasDragged.current         = true;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (!isDragging.current) return;
      lastInteraction.current = performance.now();
      const cx = e.touches[0].clientX;
      const cy = e.touches[0].clientY;
      
      if (!isTouchLocked.current) {
        const dX = Math.abs(cx - startX.current);
        const dY = Math.abs(cy - startY.current);
        if (dY > dX && dY > 5) { 
          isVerticalScroll.current = true; 
          isDragging.current = false; 
          return; 
        }
        if (dX > 5 || dY > 5) isTouchLocked.current = true;
      }
      
      if (isVerticalScroll.current) return;
      if (e.cancelable) e.preventDefault();
      
      const now = performance.now();
      const dt = Math.max(1, now - lastTime.current);
      const dx = cx - lastX.current;
      
      const sensitivity = isMobile ? (anglePerItem / (window.innerWidth * 0.35)) : 0.14;
      velocityRef.current        = -(dx / dt) * 8;
      targetRotationRef.current  -= dx * sensitivity;
      lastX.current              = cx;
      lastTime.current           = now;
      hasDragged.current         = true;
    };

    const onUp = () => { isDragging.current = false; isVerticalScroll.current = false; };

    window.addEventListener('mousemove',  onMove);
    window.addEventListener('mouseup',    onUp);
    window.addEventListener('touchmove',  onTouchMove, { passive: false });
    window.addEventListener('touchend',   onUp);
    return () => {
      window.removeEventListener('mousemove',  onMove);
      window.removeEventListener('mouseup',    onUp);
      window.removeEventListener('touchmove',  onTouchMove);
      window.removeEventListener('touchend',   onUp);
    };
  }, [anglePerItem, isMobile, totalItems]);

  const handleStep = (dir: 'prev' | 'next') => {
    lastInteraction.current = performance.now();
    if (engineRef.current && isIntersectingRef.current) engineRef.current.pop(); 

    const rawCurrent = -rotationRef.current / anglePerItem;
    const currentIndex = ((Math.round(rawCurrent) % totalItems) + totalItems) % totalItems;

    let targetIndex = dir === 'next' ? currentIndex + 1 : currentIndex - 1;

    if (targetIndex >= totalItems) targetIndex = 0;
    if (targetIndex < 0) targetIndex = totalItems - 1;

    const currentRotation = rotationRef.current;
    const targetRotationBase = -targetIndex * anglePerItem;
    
    const diff = ((targetRotationBase - currentRotation + 180) % 360 + 360) % 360 - 180;
    
    velocityRef.current = diff * 0.22;
    lastCenterTime.current = performance.now();
  };

  return (
    <section id="projects" ref={containerRef} className="relative bg-muted h-screen w-full overflow-hidden flex flex-col justify-center py-6 sm:py-10 select-none">
      <FadeIn>
        <div className="text-center mb-2 sm:mb-4 shrink-0 px-4 z-10 relative">
          <span className="inline-flex items-center justify-center gap-2 font-outfit text-xs font-bold tracking-widest uppercase text-accent mb-1 sm:mb-2">
            <span className="block w-6 h-0.5 bg-accent rounded" />
            Projects
            <span className="block w-6 h-0.5 bg-accent rounded" />
          </span>
          <h2 className="font-outfit font-black tracking-tight" style={{ fontSize: 'clamp(24px, 5vw, 48px)' }}>
            <VariableProximity
              label="Featured Work"
              containerRef={containerRef}
              radius={120}
              falloff="linear"
              fromFontVariationSettings="'wght' 500, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
            />
          </h2>
          <p className="text-muted-fg text-xs sm:text-sm mt-1">Swipe or use arrows to explore all {totalItems} projects</p>
        </div>
      </FadeIn>

      <div className="w-full relative flex items-center justify-center px-2 sm:px-12 md:px-20">
        {/* Desktop Previous Button */}
        <button
          onClick={() => handleStep('prev')}
          className="absolute left-4 sm:left-8 z-30 p-3 rounded-full bg-white border-2 border-foreground shadow-pop hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:shadow-pop-active transition-all hidden sm:flex items-center justify-center"
          style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
          aria-label="Previous project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        <div 
          className="w-full relative flex items-center justify-center cursor-grab active:cursor-grabbing touch-pan-y" 
          style={{ perspective: isMobile ? 'none' : '2000px', height: '52vh' }} 
          onMouseDown={handleDragStart} 
          onTouchStart={handleDragStart}
        >
          <div 
            ref={wheelRef} 
            className="relative w-full h-full flex items-center justify-center will-change-transform" 
            style={{ 
              transformStyle: isMobile ? 'flat' : 'preserve-3d', 
              backfaceVisibility: 'hidden' 
            }}
          >
            {PROJECTS.map((p, i) => (
              <div 
                key={p.num} 
                ref={(el) => { cardRefs.current[i] = el; }} 
                className="absolute transform-gpu flex items-center justify-center" 
                style={{ backfaceVisibility: 'hidden', willChange: 'transform, opacity' }}
              >
                <ProjectCard project={p} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Next Button */}
        <button
          onClick={() => handleStep('next')}
          className="absolute right-4 sm:right-8 z-30 p-3 rounded-full bg-white border-2 border-foreground shadow-pop hover:translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover active:shadow-pop-active transition-all hidden sm:flex items-center justify-center"
          style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
          aria-label="Next project"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
            <path d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      <FadeIn>
        <div className="w-full max-w-xs sm:max-w-md mx-auto mt-4 sm:mt-8 px-6 z-30 relative flex flex-col items-center gap-4">
          {/* Progress Bar Track */}
          <div className="w-full bg-foreground/10 h-2 rounded-full overflow-hidden border border-foreground/20">
            <div ref={progressBarRef} className="h-full bg-foreground rounded-full will-change-[width] transition-[width] duration-100" style={{ width: `${(0.5 / totalItems) * 100}%` }} />
          </div>

          {/* Mobile-Only Arrow Row Interface */}
          <div className="flex sm:hidden items-center justify-center gap-24 mt-1">
            <button
              onClick={() => handleStep('prev')}
              className="p-3 rounded-full bg-white border-2 border-foreground shadow-pop active:shadow-pop-active transition-all flex items-center justify-center"
              aria-label="Previous project mobile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() => handleStep('next')}
              className="p-3 rounded-full bg-white border-2 border-foreground shadow-pop active:shadow-pop-active transition-all flex items-center justify-center"
              aria-label="Next project mobile"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}