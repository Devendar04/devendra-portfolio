import { useRef, useState, useEffect, ReactNode } from 'react'

interface MagnetProps {
  children: ReactNode
  padding?: number
  strength?: number
}

export default function Magnet({ children, padding = 150, strength = 3 }: MagnetProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [active, setActive] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const threshold = Math.max(r.width, r.height) / 2 + padding

      if (dist < threshold) {
        setActive(true)
        setPos({ x: dx / strength, y: dy / strength })
      } else if (active) {
        setActive(false)
        setPos({ x: 0, y: 0 })
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [padding, strength, active])

  return (
    <div
      ref={ref}
      style={{
        display: 'inline-block',
        transform: `translate3d(${pos.x}px, ${pos.y}px, 0)`,
        transition: active
          ? 'transform 0.3s ease-out'
          : 'transform 0.6s ease-in-out',
        willChange: 'transform',
      }}
    >
      {children}
    </div>
  )
}
