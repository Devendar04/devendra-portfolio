import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number;
  decimals?: number; // Added to handle decimal precision
  triggerKey?: any;
}

export default function CountUp({ to, from = 0, duration = 1.5, decimals = 0, triggerKey }: CountUpProps) {
  const [count, setCount] = useState(from.toFixed(decimals));
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (triggerKey !== undefined) {
      hasAnimated.current = false;
    }

    const element = elementRef.current;
    if (!element) return;

    const startAnimation = () => {
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);

        // Ease out quad
        const easeProgress = progress * (2 - progress);
        const currentValue = startOriginal + (to - startOriginal) * easeProgress;

        setCount(currentValue.toFixed(decimals));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      const startOriginal = from;
      requestAnimationFrame(animate);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          startAnimation();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [to, from, duration, decimals, triggerKey]);

  return <span ref={elementRef}>{count}</span>;
}