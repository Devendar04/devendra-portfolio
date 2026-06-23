import { useRef, useState, useEffect } from 'react'
import { SKILLS } from '../data'
import FadeIn from '../ui/FadeIn'
import VariableProximity from '../ui/VariableProximity'

class ScratchAudioEngine {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private filterNode: BiquadFilterNode | null = null
  private whiteNoise: AudioBufferSourceNode | null = null
  private isGeneratingBuffer = false

  init() {
    if (!this.ctx) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContextClass) return;
        this.ctx = new AudioContextClass();
      } catch (e) {
        console.warn("AudioContext initialization failed:", e);
        return;
      }
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    if (this.gainNode || this.isGeneratingBuffer) return;
    this.isGeneratingBuffer = true;

    setTimeout(() => {
      if (!this.ctx) return;

      this.gainNode = this.ctx.createGain();
      this.filterNode = this.ctx.createBiquadFilter();

      this.filterNode.type = 'bandpass';
      this.filterNode.frequency.value = 850;
      this.filterNode.Q.value = 4.5;

      const bufferSize = Math.floor(0.4 * this.ctx.sampleRate);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      this.whiteNoise = this.ctx.createBufferSource();
      this.whiteNoise.buffer = noiseBuffer;
      this.whiteNoise.loop = true;

      this.gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
      
      this.whiteNoise.connect(this.filterNode);
      this.filterNode.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);
      
      this.whiteNoise.start();
      this.isGeneratingBuffer = false;
    }, 0);
  }

  setIntensity(speed: number) {
    if (!this.ctx || !this.gainNode || !this.filterNode) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const targetVolume = speed > 0.2 
      ? Math.min(0.4, 0.05 + speed * 0.012) 
      : 0;

    const targetFreq = Math.min(2000, 750 + speed * 4);
    
    this.gainNode.gain.setTargetAtTime(targetVolume, this.ctx.currentTime, 0.01);
    this.filterNode.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.015);
  }

  stop() {
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setTargetAtTime(0, this.ctx.currentTime, 0.03);
    }
  }
}

const audioEngine = new ScratchAudioEngine();

function SkillCard({ skill }: { skill: (typeof SKILLS)[0] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardContainerRef = useRef<HTMLDivElement>(null)
  const lastPos = useRef<{ x: number; y: number; time: number } | null>(null)
  const isCheckingReveal = useRef(false)
  const [isFullyRevealed, setIsFullyRevealed] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = cardContainerRef.current
    if (!canvas || !container || isFullyRevealed) return

    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return

    const resizeCanvas = () => {
      if (isFullyRevealed) return
      canvas.width = container.offsetWidth
      canvas.height = container.offsetHeight

      ctx.fillStyle = skill.color
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)'
      for (let i = 0; i < canvas.width; i += 6) {
        for (let j = 0; j < canvas.height; j += 6) {
          if (Math.random() > 0.4) {
            ctx.fillRect(i, j, 3, 3)
          }
        }
      }

      ctx.fillStyle = '#ffffff'
      ctx.font = '900 13px Outfit, sans-serif'
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'center'
      ctx.fillText('🪙 SCRATCH REVEAL', canvas.width / 2, canvas.height / 2)
    }

    resizeCanvas()
    const resizeObserver = new ResizeObserver(() => resizeCanvas())
    resizeObserver.observe(container)

    return () => resizeObserver.disconnect()
  }, [skill.color, isFullyRevealed])

  const checkRevealPercentage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (isCheckingReveal.current) return
    isCheckingReveal.current = true

    requestAnimationFrame(() => {
      const stride = 32
      const imgData = ctx.getImageData(0, 0, width, height)
      const data = imgData.data
      let totalPixels = 0
      let clearedPixels = 0

      for (let i = 0; i < data.length; i += 4 * stride) {
        totalPixels++
        if (data[i + 3] === 0) clearedPixels++
      }

      if ((clearedPixels / totalPixels) * 100 >= 85) {
        setIsFullyRevealed(true)
        audioEngine.stop()
      }
      isCheckingReveal.current = false
    })
  }

  const handleScratch = (clientX: number, clientY: number) => {
    if (isFullyRevealed) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = clientX - rect.left
    const y = clientY - rect.top
    const now = performance.now()

    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineJoin = 'round'
    ctx.lineCap = 'round'
    ctx.lineWidth = 55 

    let speed = 0

    ctx.beginPath()
    if (lastPos.current) {
      ctx.moveTo(lastPos.current.x, lastPos.current.y)
      ctx.lineTo(x, y)
      ctx.stroke()

      const dx = x - lastPos.current.x
      const dy = y - lastPos.current.y
      const dt = Math.max(1, now - lastPos.current.time)
      speed = Math.sqrt(dx * dx + dy * dy) / dt * 12
    } else {
      ctx.arc(x, y, 27.5, 0, Math.PI * 2)
      ctx.fill()
    }
    
    audioEngine.setIntensity(speed)
    lastPos.current = { x, y, time: now }

    checkRevealPercentage(ctx, canvas.width, canvas.height)
  }

  const startScratching = (clientX: number, clientY: number) => {
    if (isFullyRevealed) return
    audioEngine.init()
    
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    lastPos.current = { x: clientX - rect.left, y: clientY - rect.top, time: performance.now() }
    
    handleScratch(clientX, clientY)

    const handleGlobalMove = (e: MouseEvent) => handleScratch(e.clientX, e.clientY)
    const handleGlobalTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        if (e.cancelable) e.preventDefault()
        handleScratch(e.touches[0].clientX, e.touches[0].clientY)
      }
    }

    const stopScratching = () => {
      window.removeEventListener('mousemove', handleGlobalMove)
      window.removeEventListener('mouseup', stopScratching)
      window.removeEventListener('touchmove', handleGlobalTouchMove)
      window.removeEventListener('touchend', stopScratching)
      lastPos.current = null
      audioEngine.stop()
    }

    window.addEventListener('mousemove', handleGlobalMove)
    window.addEventListener('mouseup', stopScratching)
    window.addEventListener('touchmove', handleGlobalTouchMove, { passive: false })
    window.addEventListener('touchend', stopScratching)
  }

  return (
    <div
      ref={cardContainerRef}
      className="bg-white border-2 border-foreground rounded-2xl p-5 sm:p-7 min-h-[12rem] h-auto sm:h-48
        transition-all duration-300 cursor-default relative overflow-hidden select-none w-full"
      style={{
        boxShadow: skill.shadow,
        transitionTimingFunction: 'cubic-bezier(0.34,1.56,0.64,1)',
        cursor: isFullyRevealed ? 'default' : `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='32' height='32' style='font-size:24px'><text y='24'>🪙</text></svg>") 12 12, pointer`
      }}
      onMouseEnter={(e) => {
        if (isFullyRevealed) {
          e.currentTarget.style.transform = 'rotate(-1deg) scale(1.02)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = ''
      }}
      onMouseDown={(e) => startScratching(e.clientX, e.clientY)}
      onTouchStart={(e) => startScratching(e.touches[0].clientX, e.touches[0].clientY)}
    >
      <div className="w-full h-full flex flex-col relative z-10 pointer-events-none">
        <div className="flex items-center gap-3 mb-4">
          <div
            className="w-11 h-11 rounded-full border-2 border-foreground
              flex items-center justify-center text-xl flex-shrink-0"
            style={{ background: `${skill.color}18` }}
          >
            {skill.icon}
          </div>
          <h3
            className="font-outfit font-extrabold text-base sm:text-lg"
            style={{ color: skill.color }}
          >
            {skill.label}
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5 sm:gap-2">
          {skill.tags.map((tag) => (
            <span
              key={tag}
              className={`text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                skill.highlight.includes(tag)
                  ? 'border-accent text-accent'
                  : 'border-[#CBD5E1] text-muted-fg'
              }`}
              style={
                skill.highlight.includes(tag)
                  ? { background: 'rgba(139,92,246,0.08)' }
                  : { background: '#F1F5F9' }
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full z-20 transition-opacity duration-500 ease-out"
        style={{
          opacity: isFullyRevealed ? 0 : 1,
          pointerEvents: isFullyRevealed ? 'none' : 'auto',
        }}
      />
    </div>
  )
}

export default function SkillsSection() {
  const skillsContainerRef = useRef<HTMLDivElement>(null)

  return (
    <section id="skills" ref={skillsContainerRef} className="px-4 sm:px-6 md:px-16 py-12 md:py-20 bg-muted relative">
      <FadeIn>
        <div className="text-center mb-8 md:mb-12">
          <span className="inline-flex items-center justify-center gap-2 font-outfit text-xs
            font-bold tracking-widest uppercase text-accent mb-3">
            <span className="block w-6 h-0.5 bg-accent rounded" />
            Expertise
            <span className="block w-6 h-0.5 bg-accent rounded" />
          </span>
          <h2 className="leading-tight tracking-tight"
            style={{ fontSize: 'clamp(30px, 4vw, 52px)' }}>
            <VariableProximity
              label="Technical Stack"
              containerRef={skillsContainerRef}
              radius={100}
              falloff="linear"
              fromFontVariationSettings="'wght' 600, 'opsz' 9"
              toFontVariationSettings="'wght' 1000, 'opsz' 40"
            />
          </h2>
          <p className="text-muted-fg text-sm sm:text-base mt-2">Full-spectrum AI/ML from research to production.</p>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto w-full">
        {SKILLS.map((skill, i) => (
          <FadeIn key={skill.label} delay={i * 0.08}>
            <SkillCard skill={skill} />
          </FadeIn>
        ))}
      </div>
    </section>
  )
}