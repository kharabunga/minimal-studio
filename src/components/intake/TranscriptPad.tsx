import { useEffect, useRef } from "react";
import { Search } from "lucide-react";

export interface PadLine {
  id: string;
  text: string;
}

export interface PadBlock {
  id: string;
  time: string;
  lines: PadLine[];
}

interface EditableLineProps {
  text: string;
  onCommit: (text: string) => void;
}

/**
 * A single ruled line of ink. Uncontrolled while editing — state is committed
 * on blur so the caret never jumps mid-edit.
 */
const EditableLine = ({ text, onCommit }: EditableLineProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  return (
    <span
      ref={ref}
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      className="pad-line anim-inkline block cursor-text break-words pr-2 font-mono text-[13px] text-ink-soft
        caret-signal outline-none focus:bg-signal/[0.06] sm:text-sm"
      onBlur={() => onCommit(ref.current?.textContent?.trim() ?? "")}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === "Escape") {
          e.preventDefault();
          (e.currentTarget as HTMLElement).blur();
        }
      }}
    >
      {text}
    </span>
  );
};

interface TranscriptPadProps {
  blocks: PadBlock[];
  /** live not-yet-final speech, shown as fading ink */
  interim: string;
  /** increment to focus the writing line (the "Type" mode button) */
  typeSignal: number;
  onEditLine: (blockId: string, lineId: string, text: string) => void;
  onTypedLine: (text: string) => void;
}

const TranscriptPad = ({ blocks, interim, typeSignal, onEditLine, onTypedLine }: TranscriptPadProps) => {
  const composeRef = useRef<HTMLSpanElement>(null);

  const firstSignal = useRef(true);
  useEffect(() => {
    if (firstSignal.current) {
      firstSignal.current = false;
      return;
    }
    composeRef.current?.scrollIntoView({ block: "center", behavior: "smooth" });
    composeRef.current?.focus();
  }, [typeSignal]);

  const commitCompose = () => {
    const el = composeRef.current;
    const text = el?.textContent?.trim() ?? "";
    if (el) el.textContent = "";
    if (text) onTypedLine(text);
  };

  return (
    <div className="relative">
      {/* margin annotation */}
      <span
        aria-hidden
        className="absolute -left-9 top-[44%] hidden select-none text-2xl leading-none text-signal/80 lg:block"
      >
        ✳
      </span>

      <div
        className="relative overflow-hidden bg-pad
          shadow-[0_1px_0_rgba(255,255,255,0.6)_inset,0_24px_48px_-16px_rgba(38,36,30,0.35),0_6px_14px_-6px_rgba(38,36,30,0.25)]"
      >
        {/* binding edge */}
        <div aria-hidden className="h-2 w-full bg-signal/85" />

        {/* header strip, above the ruling */}
        <div className="flex items-center justify-between px-5 pb-2 pt-4 sm:px-7">
          <span className="font-mono text-[9px] tracking-[0.18em] text-ink/60 sm:text-[10px]">
            TRANSCRIPT&ensp;·&ensp;TAP A LINE TO FIX IT. OR DON&rsquo;T.
          </span>
          <Search aria-hidden className="h-3.5 w-3.5 text-ink/35" />
        </div>

        {/* ruled writing surface */}
        <div className="pad-ruling relative min-h-[480px] pb-14 sm:min-h-[540px]">
          {/* red margin rule */}
          <div aria-hidden className="absolute inset-y-0 left-[72px] w-px bg-[#C24429]/50 sm:left-[84px]" />

          {blocks.map((block) => (
            <div key={block.id} className="grid grid-cols-[72px_1fr] sm:grid-cols-[84px_1fr]">
              <span className="pad-line select-none pr-3 text-right font-mono text-[10px] tracking-[0.06em] text-ink/45 sm:text-[11px]">
                {block.time}
              </span>
              <div className="min-w-0 pl-4 sm:pl-5">
                {block.lines.map((line) => (
                  <EditableLine
                    key={line.id}
                    text={line.text}
                    onCommit={(text) => onEditLine(block.id, line.id, text)}
                  />
                ))}
              </div>
            </div>
          ))}

          {interim && (
            <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[84px_1fr]">
              <span aria-hidden />
              <span className="pad-line block break-words pl-4 pr-2 font-mono text-[13px] italic text-ink/35 sm:pl-5 sm:text-sm">
                {interim}
              </span>
            </div>
          )}

          {/* the writing line */}
          <div className="grid grid-cols-[72px_1fr] sm:grid-cols-[84px_1fr]">
            <span aria-hidden />
            <span
              ref={composeRef}
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              role="textbox"
              aria-label="Type your thoughts, press Enter after each line"
              data-placeholder="Start typing…"
              className="pad-line relative block min-w-0 cursor-text pl-4 pr-2 font-mono text-[13px] text-ink-soft
                caret-signal outline-none before:pointer-events-none before:absolute before:left-4 before:text-ink/30
                before:content-[attr(data-placeholder)] focus:before:content-none
                [&:not(:empty)]:before:content-none sm:pl-5 sm:text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  commitCompose();
                }
              }}
              onBlur={commitCompose}
            />
          </div>
        </div>
      </div>

      {/* pencil, laid across the pad's right edge */}
      <svg
        aria-hidden
        viewBox="0 0 24 300"
        className="absolute -right-8 bottom-6 hidden w-6 rotate-[24deg] drop-shadow-[6px_10px_8px_rgba(38,36,30,0.35)] xl:block"
      >
        <polygon points="12,0 7,26 17,26" fill="#C89B6B" />
        <polygon points="12,0 10,10 14,10" fill="#26241E" />
        <rect x="7" y="26" width="10" height="252" fill="#1F1E1A" />
        <rect x="9" y="26" width="2.5" height="252" fill="#3A382F" />
        <rect x="7" y="278" width="10" height="8" fill="#8E8E8E" />
        <rect x="7" y="286" width="10" height="14" rx="3" fill="#2B2A25" />
      </svg>
    </div>
  );
};

export default TranscriptPad;
