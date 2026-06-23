import { useEffect, useRef, useState } from 'react'

interface AnimatedTextProps {
  children: string
  className?: string
}

export default function AnimatedText({ children, className = '' }: AnimatedTextProps) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [opacities, setOpacities] = useState<number[]>(
    children.split('').map(() => 0.15)
  )

 useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      
      // Fixed progress calculation to ensure elements at the top of the viewport 
      // evaluate to a complete 1 instantly on load.
      const progress = Math.max(
        0,
        Math.min(1, (vh * 0.98 - r.top) / (r.height + vh * 0.1))
      )
      
      const total = children.length
      setOpacities(
        children.split('').map((_, i) => {
          const p = Math.max(0, Math.min(1, progress * 1.4 - i / total))
          return 0.15 + 0.85 * p
        })
      )
    }

    // Attach listeners
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    
    // Force two immediate calculation frames right on startup
    update()
    const backupTimeout = setTimeout(update, 50)

    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      clearTimeout(backupTimeout)
    }
  }, [children])
  return (
    <p ref={ref} className={className}>
      {children.split('').map((char, i) => (
        <span
          key={i}
          style={{
            opacity: opacities[i],
            transition: 'opacity 0.1s ease', // Smooth out the transition rate slightly
            display: char === '\n' ? 'block' : 'inline',
          }}
        >
          {char}
        </span>
      ))}
    </p>
  )
}