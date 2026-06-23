import { useRef, useEffect } from 'react'
import FadeIn from '../ui/FadeIn'
import { EDUCATION } from '../data'
import VariableProximity from '../ui/VariableProximity'

/* ── Playful Toy / Memphis — Acoustic Wooden Clack ────────────────────── */
class EduSoundEngine {
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

  /* Acoustic Wooden Clack — the primary interaction sound.
     Think: pressing a colourful button on a wooden toy. */
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

    // 2. Surface snap — bandpass noise burst for tactile click feeling
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

/* ── Education Section ─────────────────────────────────────────── */
export default function EducationSection() {
  const educationContainerRef = useRef<HTMLDivElement>(null);
  const soundEngineRef = useRef<EduSoundEngine | null>(null);

  // Initialize sound engine on mount and clean up on unmount
  useEffect(() => {
    const engine = new EduSoundEngine();
    soundEngineRef.current = engine;

    // Warm up AudioContext on user interaction to satisfy browser policies
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
    <section id="education" ref={educationContainerRef} className="px-4 sm:px-6 md:px-16 py-12 md:py-20 bg-muted relative">
      <FadeIn>
        <div className="mb-8 md:mb-10">
          <span className="inline-flex items-center gap-2 font-outfit text-xs font-bold
            tracking-widest uppercase text-accent mb-3">
            <span className="block w-6 h-0.5 bg-accent rounded" />
            Education
          </span>
          <h2 className="leading-tight tracking-tight" style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}>
            <VariableProximity
              label="Background"
              containerRef={educationContainerRef}
              radius={100}
              falloff="linear"
              fromFontVariationSettings="'wght' 600, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
            />
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-4xl w-full">
        {EDUCATION.map((edu, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div
              className="bg-white border-2 border-foreground rounded-2xl p-5 sm:p-7 shadow-pop
                transition-all duration-300 h-full w-full cursor-pointer
                hover:shadow-pop-hover"
              style={{ transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)' }}
              onMouseEnter={(e) => {
                // Play tactile wooden clack sound
                if (soundEngineRef.current) {
                  soundEngineRef.current.clack();
                }

                if (window.innerWidth > 768) {
                  e.currentTarget.style.transform = 'rotate(1deg) scale(1.01)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
            >
              <div className="text-2xl sm:text-3xl mb-3">{edu.icon}</div>
              <h3 className="font-outfit font-extrabold text-base sm:text-lg mb-1 leading-snug">{edu.degree}</h3>
              <p className="text-accent font-semibold text-xs sm:text-sm mb-3">{edu.school}</p>
              <div className="flex flex-wrap gap-2.5 items-center">
                <span className="text-xs sm:text-sm text-muted-fg">{edu.period}</span>
                <span
                  className="font-outfit font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full border-2"
                  style={{
                    background: 'rgba(52,211,153,0.12)',
                    borderColor: '#34D399',
                    color: '#059669',
                  }}
                >
                  {edu.grade}
                </span>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}