/**
 * Decorative desk collage — the "mess" already on the table.
 * Pure CSS/SVG paper objects; no images to load.
 */

const GoldPaperclip = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 28 60" className={className}>
    <path
      d="M9 52 V14 a5 5 0 0 1 10 0 v32 a9 9 0 0 1 -18 0 V16"
      fill="none"
      stroke="url(#clip-gold)"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <defs>
      <linearGradient id="clip-gold" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#E4C36A" />
        <stop offset="0.5" stopColor="#B98F3E" />
        <stop offset="1" stopColor="#8F6B27" />
      </linearGradient>
    </defs>
  </svg>
);

const BinderClip = ({ className = "" }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 64 44" className={className}>
    <path d="M22 20 q1 -9 10 -9 q9 0 10 9" fill="none" stroke="#B98F3E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M14 20 q2 -13 18 -13 q16 0 18 13" fill="none" stroke="#B98F3E" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M10 20 h44 l-6 18 h-32 z" fill="url(#binder-gold)" />
    <defs>
      <linearGradient id="binder-gold" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#D9B75E" />
        <stop offset="1" stopColor="#9A7530" />
      </linearGradient>
    </defs>
  </svg>
);

const FloorPlan = ({ faint = false }: { faint?: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 240 180"
    className={`h-auto w-full ${faint ? "opacity-30" : "opacity-80"}`}
  >
    <g stroke="#3A3835" strokeWidth="1.2" fill="none">
      <rect x="18" y="30" width="204" height="120" />
      <path d="M18 96 h58 M96 96 h30" />
      <rect x="132" y="52" width="66" height="44" />
      <rect x="34" y="112" width="18" height="18" />
      <rect x="60" y="112" width="18" height="18" />
      <rect x="86" y="112" width="18" height="18" />
      <path d="M160 150 v14 M160 164 h-30" strokeDasharray="3 3" />
      <path d="M74 30 v-12 M104 30 v-12 M74 22 h30" strokeWidth="0.8" />
    </g>
    <g fill="#3A3835" fontSize="9" fontFamily="'IBM Plex Mono', monospace">
      <text x="140" y="76">open kitchen</text>
      <text x="36" y="106">seating</text>
      <text x="176" y="140">counter</text>
      <text x="26" y="164">entry</text>
      <text x="78" y="14">window</text>
      <text x="184" y="44">storage</text>
    </g>
  </svg>
);

const DeskArtifacts = () => {
  return (
    <div aria-hidden className="relative select-none">
      {/* full collage, large screens */}
      <div className="relative hidden h-[680px] lg:block">
        {/* polaroid */}
        <div className="absolute left-[2%] top-0 w-[210px] -rotate-[5deg] bg-paperwhite p-3 pb-10 shadow-[0_16px_32px_-12px_rgba(38,36,30,0.4)]">
          <div
            className="aspect-square w-full"
            style={{
              background: [
                "radial-gradient(85px 55px at 32% 36%, rgba(226,169,63,0.85), rgba(226,169,63,0.15) 60%, transparent 78%)",
                "radial-gradient(46px 40px at 70% 62%, rgba(205,128,48,0.55), transparent 72%)",
                "radial-gradient(28px 24px at 80% 26%, rgba(226,169,63,0.45), transparent 70%)",
                "repeating-linear-gradient(to bottom, transparent 0 42px, rgba(12,7,4,0.85) 42px 45px)",
                "linear-gradient(to bottom, #33241A 0%, #2A1D12 55%, #1C120B 100%)",
              ].join(", "),
            }}
          />
          <GoldPaperclip className="absolute -top-5 left-7 h-12 w-6 rotate-6" />
        </div>

        {/* vellum sheet with faint plan */}
        <div className="absolute left-[34%] top-[4%] w-[240px] rotate-[4deg] border border-white/70 bg-white/45 p-4 shadow-[0_10px_24px_-12px_rgba(38,36,30,0.3)] backdrop-blur-[1.5px]">
          <FloorPlan faint />
        </div>

        {/* sketch card */}
        <div className="absolute left-[8%] top-[31%] w-[300px] -rotate-2 bg-paperwhite p-5 shadow-[0_18px_36px_-14px_rgba(38,36,30,0.45)]">
          <FloorPlan />
        </div>

        {/* kraft note */}
        <div className="absolute right-[4%] top-[42%] w-[170px] rotate-[7deg] bg-kraft px-5 py-6 shadow-[0_14px_28px_-12px_rgba(38,36,30,0.4)]">
          <p className="text-center font-mono text-[10px] leading-6 tracking-[0.16em] text-graphite/75">
            INSPIRATION
            <br />
            NOTES.
            <br />
            IDEAS.
            <br />
            MAYBE LATER.
          </p>
        </div>

        {/* brand deck stack */}
        <div className="absolute bottom-0 left-[4%] w-[280px] -rotate-1">
          <div className="absolute -bottom-2 left-2 h-full w-full rotate-1 bg-[#E9E2D0] shadow-sm" />
          <div className="absolute -bottom-1 left-1 h-full w-full rotate-[0.5deg] bg-[#F1EADA] shadow-sm" />
          <div className="relative bg-paperwhite px-7 pb-8 pt-10 shadow-[0_20px_40px_-14px_rgba(38,36,30,0.45)]">
            <BinderClip className="absolute -top-4 left-8 h-9 w-14" />
            <p className="font-serif text-2xl text-graphite/90">brand deck.pdf</p>
            <p className="mt-2 font-mono text-[10px] tracking-[0.18em] text-graphite/50">12 MB&ensp;·&ensp;PDF</p>
            <div className="mt-5 h-px w-24 bg-signal/70" />
          </div>
        </div>
      </div>

      {/* compact cluster, small screens */}
      <div className="flex items-start gap-5 lg:hidden">
        <div className="relative min-w-0 flex-1 -rotate-1 bg-paperwhite px-5 pb-6 pt-7 shadow-[0_16px_32px_-14px_rgba(38,36,30,0.4)]">
          <BinderClip className="absolute -top-3 left-5 h-7 w-11" />
          <p className="font-serif text-xl text-graphite/90">brand deck.pdf</p>
          <p className="mt-1 font-mono text-[9px] tracking-[0.18em] text-graphite/50">12 MB&ensp;·&ensp;PDF</p>
        </div>
        <div className="w-[38%] shrink-0 rotate-2 bg-kraft px-4 py-5 shadow-[0_14px_28px_-12px_rgba(38,36,30,0.4)]">
          <p className="text-center font-mono text-[9px] leading-5 tracking-[0.14em] text-graphite/75">
            INSPIRATION
            <br />
            NOTES.
            <br />
            IDEAS.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DeskArtifacts;
