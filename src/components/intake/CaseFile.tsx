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
  <svg aria-hidden viewBox="0 0 96 96" className="h-20 w-20 -rotate-[10deg] text-signal/70 mix-blend-multiply">
    <circle cx="48" cy="48" r="44" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <circle cx="48" cy="48" r="29" fill="none" stroke="currentColor" strokeWidth="1.2" />
    <defs>
      <path id="stamp-arc" d="M48 12 a36 36 0 1 1 -0.01 0" fill="none" />
    </defs>
    <text fill="currentColor" fontSize="8.5" fontFamily="'IBM Plex Mono', monospace" letterSpacing="2.5">
      <textPath href="#stamp-arc">KHARABUNGA · INTAKE ·</textPath>
    </text>
    <text
      x="48"
      y="56"
      textAnchor="middle"
      fill="currentColor"
      fontSize="20"
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
    <div className="grid gap-14 md:grid-cols-2 md:gap-10">
      {/* drop pocket */}
      <button
        type="button"
        onClick={onBrowse}
        aria-label="Add files to the project"
        className={`group flex min-h-[220px] flex-col items-start justify-between border border-dashed p-7 text-left
          transition-colors duration-300 sm:p-9
          ${isDragging ? "border-signal bg-signal/[0.05]" : "border-ink/30 bg-paperwhite/40 hover:border-ink/60"}`}
      >
        <div>
          <p className="font-mono text-[11px] tracking-[0.2em] text-ink/80">
            {isDragging ? "LAY IT ON THE DESK" : "DROP MORE HERE"}
          </p>
          <p className="mt-4 max-w-[36ch] font-mono text-[11px] leading-5 text-ink/50">
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
        <div className={`relative w-full transition-transform duration-300 ${isDragging ? "-translate-y-1" : ""}`}>
          {/* folder tab */}
          <div aria-hidden className="absolute -top-12 left-[38%] z-0 h-14 w-32 rounded-t-lg bg-ink shadow-sm" />

          {/* sheets peeking out */}
          <div aria-hidden className="absolute -top-9 left-4 right-4 z-10 h-12">
            {peeking.map((item, i) => {
              const rotate = rotationFor(item.id);
              return (
                <div
                  key={item.id}
                  className={`absolute top-0 h-16 w-32 border border-ink/10 bg-paperwhite px-3 pt-1.5
                    shadow-[0_-4px_10px_-6px_rgba(38,36,30,0.35)] sm:w-44 ${item.settled === false ? "" : "anim-settle"}`}
                  style={{
                    left: `${i * 18}%`,
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
            className="relative z-20 border border-ink/10 bg-[#EFE8D7] px-7 pb-7 pt-6
              shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_22px_44px_-16px_rgba(38,36,30,0.4)] sm:px-9"
          >
            <p className="font-mono text-[10px] tracking-[0.2em] text-ink/50">CURRENT PROJECT</p>
            <p className="mt-3 font-serif text-3xl text-ink">untitled case</p>
            <p className="mt-6 font-mono text-[11px] tracking-[0.12em] text-signal">
              {items.length} {items.length === 1 ? "item" : "items"}
            </p>
            <div className="absolute bottom-4 right-5">
              <Stamp />
            </div>
          </div>
        </div>

        <a
          href={mailtoHref}
          className="group mt-6 inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.16em]
            text-ink/70 underline decoration-signal/60 underline-offset-4 transition-colors hover:text-ink"
        >
          SEND THE CASE FILE
          <ArrowUpRight aria-hidden className="h-3.5 w-3.5 text-signal transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </div>
    </div>
  );
};

export default CaseFile;
