import { useRef, useEffect } from 'react'
import FadeIn from '../ui/FadeIn'
import AnimatedText from '../ui/AnimatedText'
import VariableProximity from '../ui/VariableProximity'

const FACTS = [
  { icon: '🎓', bg: 'rgba(139,92,246,0.1)', text: <><strong>Geetanjali Institute</strong>, Udaipur · CGPA 9.0</> },
  { icon: '💼', bg: 'rgba(244,114,182,0.1)', text: <>Interned at <strong>GRRAS Solutions</strong> & <strong>Team #9 Productions</strong></> },
  { icon: '🏆', bg: 'rgba(251,191,36,0.1)',  text: <><strong>Winner</strong> — Tie-U Ideathon 2025 · 2× SIH Finalist</> },
  { icon: '🤗', bg: 'rgba(52,211,153,0.1)',  text: <>Publishing models on <strong>Hugging Face Hub</strong></> },
  { icon: '📍', bg: 'rgba(139,92,246,0.1)',  text: <>Based in <strong>Rajasthan, India</strong> · Open to remote</> },
]

/* ── Playful Toy / Memphis — Acoustic Wooden Clack ────────────────────── */
class AboutSoundEngine {
  private ctx: AudioContext | null = null;

  public init() {
    if (this.ctx) return;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) {
        this.ctx = new AC();
      }
    } catch (e) {
      console.warn("Web Audio API not supported in this browser.");
    }
  }

  /* Acoustic Wooden Clack — pressing a colourful button on a wooden toy */
  public clack() {
    if (!this.ctx) this.init();
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const t = ctx.currentTime;

    // 1. Wood body resonance — pitched fast-decay drop
    const osc = ctx.createOscillator();
    const oscGain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(820, t);
    osc.frequency.exponentialRampToValueAtTime(340, t + 0.028);
    oscGain.gain.setValueAtTime(0.14, t);
    oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.040);

    // 2. Surface snap — bandpass noise burst
    const bufLen = Math.floor(ctx.sampleRate * 0.013);
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;

    const noise = ctx.createBufferSource();
    noise.buffer = buf;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1700, t);
    filter.Q.setValueAtTime(4.5, t);

    const noiseGain = ctx.createGain();
    noiseGain.gain.setValueAtTime(0.07, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.013);

    osc.connect(oscGain);
    oscGain.connect(ctx.destination);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
    noise.start(t);
  }

  public destroy() {
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export default function AboutSection() {
  const aboutContainerRef = useRef<HTMLDivElement>(null)
  const soundEngineRef = useRef<AboutSoundEngine | null>(null);

  useEffect(() => {
    const engine = new AboutSoundEngine();
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

  return (
    <section id="about" ref={aboutContainerRef} className="px-4 sm:px-6 md:px-16 py-12 md:py-20 overflow-hidden relative">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center max-w-6xl mx-auto w-full">

        {/* Left text column */}
        <div className="w-full min-w-0">
          <FadeIn>
            <span className="inline-flex items-center gap-2 font-outfit text-xs font-bold
              tracking-widest uppercase text-accent mb-3">
              <span className="block w-6 h-0.5 bg-accent rounded" />
              About Me
            </span>
            <h2 className="leading-tight tracking-tight mb-6"
              style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}>
              <VariableProximity
                label="Building AI that actually works"
                containerRef={aboutContainerRef}
                radius={100}
                falloff="linear"
                fromFontVariationSettings="'wght' 600, 'opsz' 9"
                toFontVariationSettings="'wght' 1000, 'opsz' 40"
              />
            </h2>
            <AnimatedText
              className="text-sm sm:text-base leading-loose text-foreground mb-6"
            >
              With 5+ years of passion for technology, I'm a B.Tech CS student specializing in Machine Learning and Generative AI. I build and deploy deep learning models, agentic AI systems, and RAG pipelines using PyTorch, LangChain, and Transformers. I love turning complex AI research into production-ready systems that solve real problems.
            </AnimatedText>
            <a
              href="mailto:parjapatsunny12@gmail.com"
              className="inline-flex items-center gap-3 font-outfit font-bold text-white text-sm
                px-6 sm:px-7 py-3 rounded-full border-2 border-foreground bg-accent shadow-pop
                transition-all duration-200
                hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover
                active:translate-x-0.5 active:translate-y-0.5"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
            >
              Say Hello
              <span className="w-7 h-7 rounded-full bg-white flex items-center justify-center flex-shrink-0">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none"
                  stroke="#8B5CF6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
            </a>
          </FadeIn>
        </div>

        {/* Right facts list column */}
        <div className="w-full min-w-0 mt-4 md:mt-0">
          <FadeIn delay={0.15}>
            <div className="flex flex-col gap-3 w-full">
              {FACTS.map((f, i) => (
                <div
                  key={i}
                  onMouseEnter={() => {
                    if (soundEngineRef.current) {
                      soundEngineRef.current.clack();
                    }
                  }}
                  className="flex items-center gap-3 bg-white border-2 border-foreground rounded-xl
                    px-4 py-3 shadow-pop text-xs sm:text-sm font-semibold w-full
                    transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
                >
                  <div
                    className="w-9 h-9 rounded-full border-2 border-foreground flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: f.bg }}
                  >
                    {f.icon}
                  </div>
                  <div className="leading-snug break-words max-w-full overflow-hidden">{f.text}</div>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>

      </div>
    </section>
  )
}