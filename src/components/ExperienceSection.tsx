import { useRef, useEffect } from "react";
import { Code2, Cpu } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import FadeIn from "../ui/FadeIn";
import { EXPERIENCE } from "../data";
import VariableProximity from "../ui/VariableProximity";

gsap.registerPlugin(ScrollTrigger);

const ICONS: Record<string, typeof Code2> = {
  "💻": Code2,
  "🤖": Cpu,
};

export default function ExperienceSection() {
  const experienceSectionRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animatedLineRef = useRef<HTMLDivElement>(null);
  const trackerDotRef = useRef<HTMLDivElement>(null);
  
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    const container = containerRef.current;
    const line = animatedLineRef.current;
    const dot = trackerDotRef.current;

    if (!container || !line || !dot) return;

    // 1. Core scroll timeline keeping line height and tracking dot attached perfectly
    const mainTl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: "top 55%",
        end: "bottom 55%",
        scrub: 0.5,
        invalidateOnRefresh: true,
      }
    });

    mainTl.to(line, { height: "100%", ease: "none" }, 0)
          .to(dot, { top: "100%", ease: "none" }, 0);

    // Smoothly reveal tracking dot only when layout tracking is active
    gsap.fromTo(dot, 
      { opacity: 0 },
      {
        opacity: 1,
        scrollTrigger: {
          trigger: container,
          start: "top 54%",
          end: "bottom 56%",
          toggleActions: "play reverse play reverse"
        }
      }
    );

    // 2. Loop cards to update color changes and pop card animations on scroll contact
    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const exp = EXPERIENCE[i];
      const targetColor = exp?.color ?? "#8B5CF6";

      // Scale card outward smoothly when reached
      gsap.fromTo(card,
        { scale: 1 },
        {
          scale: 1.03,
          duration: 0.35,
          ease: "back.out(2)",
          overwrite: "auto",
          scrollTrigger: {
            trigger: card,
            start: "top 55%", 
            toggleActions: "play reverse play reverse",
          }
        }
      );

      // Transition tracking asset background colors
      gsap.to([line, dot], {
        backgroundColor: targetColor,
        duration: 0.05,
        scrollTrigger: {
          trigger: card,
          start: "top 55%",
          toggleActions: "play pascal play reverse",
        }
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section
      id="experience"
      ref={experienceSectionRef}
      className="px-6 md:px-16 py-20 relative"
    >
      <FadeIn>
        <span className="inline-flex items-center gap-2 font-outfit text-xs font-bold tracking-widest uppercase text-accent mb-3">
          <span className="block w-6 h-0.5 bg-accent rounded" />
          Experience
        </span>
        <h2
          className="leading-tight tracking-tight mb-2"
          style={{ fontSize: "clamp(32px, 4vw, 52px)" }}
        >
          <VariableProximity
            label="Where I've Worked"
            containerRef={experienceSectionRef}
            radius={120}
            falloff="linear"
            fromFontVariationSettings="'wght' 500, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
          />
        </h2>
        <p className="text-muted-fg text-base mb-12">
          Building real systems under real deadlines.
        </p>
      </FadeIn>

      <div ref={containerRef} className="relative max-w-2xl">
        {/* 1. Faint background track line (z-0) */}
        <div className="absolute left-5 top-2 bottom-6 w-[2px] bg-border opacity-30 -translate-x-1/2 z-0" />

        {/* 2. Progressive colored active track line (z-10 - behind checkpoints) */}
        <div
          ref={animatedLineRef}
          className="absolute left-5 top-2 w-[2px] origin-top -translate-x-1/2 h-0 z-1"
          style={{
            backgroundColor: EXPERIENCE[0]?.color ?? "#8B5CF6",
          }}
        />

        {/* 4. Traveling Tracker Dot (z-30 - on the absolute top of everything) */}
        <div
          ref={trackerDotRef}
          className="absolute left-5 w-3 h-3 rounded-full -translate-x-1/2 -translate-y-1/2 z-2 top-0 opacity-0"
          style={{
            backgroundColor: EXPERIENCE[0]?.color ?? "#8B5CF6",
          }}
        />

        {EXPERIENCE.map((exp, i) => {
          const Icon = ICONS[exp.emoji] ?? Code2;
          return (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="flex items-start relative mb-12 group">
                
                {/* 3. Static Checkpoint Dot Container (z-20 - clearly above the tracking lines) */}
                <div
                  className="w-10 h-10 rounded-full border-[3px] border-foreground flex items-center justify-center flex-shrink-0 z-30 shadow-pop"
                  style={{
                    background: exp.color,
                  }}
                >
                  <Icon size={17} strokeWidth={2.5} color="#1E293B" />
                </div>

                {/* Experience Detail Card component */}
                <div
                  ref={(el) => { if (el) cardsRef.current[i] = el; }}
                  className="flex-1 bg-white border-2 border-foreground rounded-2xl px-6 py-5 shadow-pop ml-6 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover"
                  style={{
                    transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
                    willChange: "transform",
                  }}
                >
                  <p className="font-outfit text-[11px] font-bold tracking-widest uppercase text-muted-fg mb-1">
                    {exp.date}
                  </p>
                  <h3 className="font-outfit font-extrabold text-lg mb-1">
                    {exp.role}
                  </h3>
                  <p className="text-accent font-semibold text-sm mb-3">
                    {exp.company}
                  </p>
                  <ul className="flex flex-col gap-2">
                    {exp.points.map((pt, j) => (
                      <li
                        key={j}
                        className="flex gap-2 items-start text-sm text-muted-fg leading-relaxed"
                      >
                        <span className="text-accent text-xs mt-1 flex-shrink-0">
                          →
                        </span>
                        {pt}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}