import { useRef } from 'react'
import FadeIn from '../ui/FadeIn'
import { ACHIEVEMENTS } from '../data'
import VariableProximity from '../ui/VariableProximity'

export default function AchievementsSection() {
  const achievementsContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section ref={achievementsContainerRef} className="px-4 sm:px-6 md:px-16 py-12 md:py-20 relative overflow-hidden">
      <FadeIn>
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center justify-center gap-2 font-outfit text-xs
            font-bold tracking-widest uppercase text-accent mb-3">
            <span className="block w-6 h-0.5 bg-accent rounded" />
            Recognition
            <span className="block w-6 h-0.5 bg-accent rounded" />
          </span>
          <h2 className="leading-tight tracking-tight" style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}>
            <VariableProximity
              label="Achievements"
              containerRef={achievementsContainerRef}
              radius={100}
              falloff="linear"
              fromFontVariationSettings="'wght' 600, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
            />
          </h2>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto w-full">
        {ACHIEVEMENTS.map((ach, i) => (
          <FadeIn key={i} delay={i * 0.1}>
            <div
              className="bg-white border-2 border-foreground rounded-2xl p-5 sm:p-7 text-center
                transition-all duration-300 h-full cursor-default w-full flex flex-col items-center justify-center"
              style={{
                boxShadow: ach.winner ? '8px 8px 0px #FBBF24' : '4px 4px 0px #1E293B',
                borderColor: ach.winner ? '#FBBF24' : '#1E293B',
                transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
              }}
              onMouseEnter={(e) => {
                if (window.innerWidth > 640) {
                  e.currentTarget.style.transform = 'rotate(-1deg) scale(1.03)'
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = ''
              }}
            >
              {ach.winner && (
                <div
                  className="inline-block font-outfit font-extrabold text-[10px] sm:text-[11px] uppercase
                    tracking-widest bg-tertiary border-2 border-foreground rounded-full
                    px-3.5 py-0.5 mb-3 shadow-pop"
                  style={{ transform: 'rotate(-2deg)' }}
                >
                  ⭐ Winner!
                </div>
              )}
              <div className="text-3xl sm:text-4xl mb-3">{ach.trophy}</div>
              <h3 className="font-outfit font-extrabold text-sm sm:text-base mb-2 leading-snug">{ach.title}</h3>
              <p className="text-muted-fg text-xs sm:text-sm leading-relaxed max-w-xs">{ach.sub}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}