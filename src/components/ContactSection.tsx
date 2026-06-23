import { CONTACT_LINKS } from "../data";

const EMAIL = "parjapatsunny12@gmail.com";

export default function ContactSection() {
  return (
    <section id="contact" className="px-6 md:px-16 pb-20">
      <div
        className="relative bg-accent border-[3px] border-foreground rounded-[32px]
          px-8 md:px-16 py-16 text-center overflow-hidden"
        style={{ boxShadow: "8px 8px 0px #1E293B" }}
      >
        <div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-52 h-52 rounded-full pointer-events-none"
          style={{ background: "rgba(251,191,36,0.25)" }}
        />
        <div
          className="absolute top-6 left-10 w-10 h-10 rounded-full border-2 float-1 pointer-events-none"
          style={{ background: "#FBBF24", borderColor: "#1E293B" }}
        />
        <div
          className="absolute bottom-8 right-12 w-8 h-8 rounded-lg border-2 float-2 pointer-events-none"
          style={{ background: "#F472B6", borderColor: "#1E293B" }}
        />

        <div className="relative z-10">
          <h2
            className="font-outfit font-black text-white mb-3 tracking-tight"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            Let&apos;s Build Something
            <br />
            Amazing with AI{" "}
            <span className="inline-block select-none ml-2">🚀</span>
          </h2>
          <p className="text-white/80 text-base mb-10">
            Open to internships, collaborations, and research in ML/AI.
          </p>
          <div className="flex justify-center flex-wrap gap-3">
            {/* Email Me — opens Gmail compose directly */}
            <a
              href={`https://mail.google.com/mail/?view=cm&to=${EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-white text-foreground font-outfit
                font-bold text-sm px-5 py-3 rounded-full border-2 border-foreground
                shadow-pop transition-all duration-200
                hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover hover:bg-tertiary"
              style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
            >
              📧 Email Me
            </a>

            {CONTACT_LINKS.filter((l) => !l.href.startsWith("mailto")).map((l) => {
              const isExternal = l.href.startsWith("http");
              const linkObj = l as { label: string; href: string; download?: string };
              return (
                <a
                  key={l.label}
                  href={l.href}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  download={linkObj.download ?? undefined}
                  className="inline-flex items-center gap-2 bg-white text-foreground font-outfit
                    font-bold text-sm px-5 py-3 rounded-full border-2 border-foreground
                    shadow-pop transition-all duration-200
                    hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop-hover hover:bg-tertiary"
                  style={{ transitionTimingFunction: "cubic-bezier(0.34,1.56,0.64,1)" }}
                >
                  {l.label}
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}