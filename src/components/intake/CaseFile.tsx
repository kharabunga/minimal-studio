import { ArrowDown, ArrowUpRight } from "lucide-react";

export interface CaseItem {
  id: string;
  kind: "file" | "link" | "audio" | "note";
  label: string;
  meta?: string;
  /** false for the seeded desk items so they don't play the settle animation */
  settled?: boolean;
}

/** stable pseudo-random rotation per item, so the stack doesn't reshuffle on re-render */
const rotationFor = (id: string) => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(hash) % 9) - 4) * 0.9;
};

const Stamp = () => (
  <svg
    aria-hidden
    viewBox="0 0 104 104"
    className="h-[5.5rem] w-[5.5rem] -rotate-[12deg] text-signal/75 mix-blend-multiply"
  >
    <circle cx="52" cy="52" r="47" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="52" cy="52" r="33" fill="none" stroke="currentColor" strokeWidth="1" />
    <defs>
      <path id="stamp-top" d="M15 52 a37 37 0 0 1 74 0" fill="none" />
      <path id="stamp-bottom" d="M9 52 a43 43 0 0 0 86 0" fill="none" />
    </defs>
    <text fill="currentColor" fontSize="10" fontFamily="'IBM Plex Mono', monospace" letterSpacing="2.5">
      <textPath href="#stamp-top" startOffset="50%" textAnchor="middle">
        IN PROGRESS
      </textPath>
    </text>
    <text fill="currentColor" fontSize="10" fontFamily="'IBM Plex Mono', monospace" letterSpacing="2.5">
      <textPath href="#stamp-bottom" startOffset="50%" textAnchor="middle">
        KB STUDIOS
      </textPath>
    </text>
    <text
      x="52"
      y="59"
      textAnchor="middle"
      fill="currentColor"
      fontSize="21"
      fontFamily="'IBM Plex Mono', monospace"
      fontWeight="500"
    >
      01
    </text>
  </svg>
);

interface CaseFileProps {
  items: CaseItem[];
  isDragging: boolean;
  onBrowse: () => void;
  mailtoHref: string;
}

const CaseFile = ({ items, isDragging, onBrowse, mailtoHref }: CaseFileProps) => {
  const peeking = items.slice(-4);

  return (
    <div className="grid items-start gap-16 md:grid-cols-[1.15fr_0.85fr] md:gap-12">
      {/* drop pocket */}
      <button
        type="button"
        onClick={onBrowse}
        aria-label="Add files to the project"
        className={`group flex min-h-[230px] rotate-[0.3deg] flex-col items-start justify-between border border-dashed p-8 text-left
          transition-all duration-300 sm:p-10
          ${
            isDragging
              ? "border-signal bg-signal/[0.05] shadow-[0_18px_36px_-18px_rgba(199,67,31,0.35)]"
              : "border-ink/30 bg-paperwhite/40 shadow-[0_14px_30px_-18px_rgba(38,36,30,0.3)] hover:border-ink/60"
          }`}
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.22em] text-ink/80">
            {isDragging ? "LAY IT ON THE DESK" : "DROP MORE HERE"}
          </p>
          <p className="mt-5 max-w-[38ch] font-mono text-[11px] leading-6 text-ink/50">
            PDFs, screenshots, photos, links, notes, sketches, voice memos, anything.
          </p>
        </div>
        <ArrowDown
          aria-hidden
          className={`anim-drift mt-8 h-4 w-4 ${isDragging ? "text-signal" : "text-ink/50"}`}
        />
      </button>

      {/* dossier */}
      <div className="flex flex-col items-start">
        <div
          className={`relative w-full -rotate-[0.5deg] transition-transform duration-300 ${isDragging ? "-translate-y-1.5" : ""}`}
        >
          {/* folder tab */}
          <div aria-hidden className="absolute -top-11 right-8 z-0 h-14 w-28 rounded-t-md bg-ink shadow-sm" />

          {/* sheets peeking out */}
          <div aria-hidden className="absolute -top-9 left-4 right-4 z-10 h-12">
            {peeking.map((item, i) => {
              const rotate = rotationFor(item.id);
              return (
                <div
                  key={item.id}
                  className={`absolute top-0 h-16 w-32 border border-ink/10 bg-paperwhite px-3 pt-1.5
                    shadow-[0_-4px_10px_-6px_rgba(38,36,30,0.35)] sm:w-40 ${item.settled === false ? "" : "anim-settle"}`}
                  style={{
                    left: `${i * 17}%`,
                    ["--settle-rotate" as string]: `${rotate}deg`,
                    transform: `rotate(${rotate}deg)`,
                  }}
                >
                  <p className="truncate font-mono text-[9px] tracking-[0.06em] text-ink/60">{item.label}</p>
                  {item.meta && (
                    <p className="truncate font-mono text-[8px] tracking-[0.08em] text-ink/35">{item.meta}</p>
                  )}
                </div>
              );
            })}
          </div>

          {/* folder front */}
          <div
            className="relative z-20 overflow-hidden border border-ink/10 bg-[#F0E9D8] px-7 pb-8 pt-6
              shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_28px_52px_-18px_rgba(38,36,30,0.42)] sm:px-9"
          >
            <div aria-hidden className="desk-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply" />
            <p className="font-mono text-[10px] tracking-[0.22em] text-ink/50">CURRENT PROJECT</p>
            <p className="mt-3 font-serif text-3xl text-ink">untitled case</p>
            <p className="mt-7 font-mono text-[11px] tracking-[0.14em] text-signal">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <div className="absolute bottom-3 right-4">
              <Stamp />
            </div>
          </div>
        </div>

        <a
          href={mailtoHref}
          className="group mt-7 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.18em]
            text-ink/70 underline decoration-signal/60 underline-offset-4 transition-colors hover:text-ink"
        >
          SEND THE CASE FILE
          <ArrowUpRight
            aria-hidden
            className="h-3.5 w-3.5 text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </a>
      </div>
    </div>
  );
};

export default CaseFile;
