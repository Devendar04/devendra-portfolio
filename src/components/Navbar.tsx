import { useState, useEffect } from "react";

const links = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Unified scroll handler that accounts for your 72px fixed navbar offset
  const handleScroll = (targetId: string) => {
    const id = targetId.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;
    
    const top = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4 border-b-2 border-foreground"
      style={{
        background: scrolled ? "rgba(255,253,245,0.95)" : "rgba(255,253,245,0.8)",
        backdropFilter: "blur(10px)",
        transition: "background 0.3s",
      }}
    >
      {/* Logo */}
      <span className="font-outfit font-black text-xl text-foreground">
        dev<span className="text-accent">.</span>dp
      </span>

      {/* Links */}
      <div className="hidden md:flex items-center gap-2">
        {links.map((l) => (
          <button
            key={l.label}
            onClick={() => handleScroll(l.href)}
            className="font-outfit font-bold text-sm text-foreground px-4 py-1.5 rounded-full border-2 border-transparent
            hover:border-foreground hover:bg-tertiary transition-all duration-200"
            style={{
              transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            {l.label}
          </button>
        ))}
        <button
          onClick={() => handleScroll("#contact")}
          className="font-outfit font-bold text-sm text-white px-5 py-2 rounded-full border-2 border-foreground
            bg-accent shadow-pop transition-all duration-200
            hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover
            active:translate-x-0.5 active:translate-y-0.5 active:shadow-pop-active"
          style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
        >
          Hire Me ✨
        </button>
      </div>

      {/* Mobile CTA */}
      <button
        onClick={() => handleScroll("#contact")}
        className="md:hidden font-outfit font-bold text-sm text-white px-4 py-2 rounded-full
          border-2 border-foreground bg-accent shadow-pop"
      >
        Hire Me
      </button>
    </nav>
  );
}