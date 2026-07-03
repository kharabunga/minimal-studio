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

// the standing invitation — what's worth saying out loud, in any order
const PROMPTS = [
  { numeral: "i.", text: "Who you are, and what your organization actually does." },
  { numeral: "ii.", text: "What’s tangled. Describe it like you would to a friend, not a vendor." },
  { numeral: "iii.", text: "What happens if this works. What happens if it doesn’t." },
  { numeral: "iv.", text: "Timing, budget reality, and anything you’re afraid to say out loud." },
];

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
    <div className="relative -rotate-[0.4deg]">
      {/* sheet beneath — the pad is a stack, not a rectangle */}
      <div aria-hidden className="absolute inset-x-1 -bottom-1.5 top-2 rotate-[0.5deg] bg-[#EFE5B4] shadow-sm" />

      <div
        className="relative overflow-hidden bg-pad
          shadow-[0_1px_0_rgba(255,255,255,0.55)_inset,0_34px_60px_-20px_rgba(38,36,30,0.42),0_8px_18px_-8px_rgba(38,36,30,0.28)]"
      >
        {/* paper grain */}
        <div aria-hidden className="desk-grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-multiply" />

        {/* header strip, above the ruling */}
        <div className="relative flex items-center justify-between px-6 pb-3 pt-6 sm:px-8">
          <span className="font-mono text-[9px] tracking-[0.2em] text-ink/60 sm:text-[10px]">
            WORTH SAYING OUT LOUD&ensp;·&ensp;IN ANY ORDER
          </span>
          <Search aria-hidden className="h-3.5 w-3.5 text-ink/35" />
        </div>

        {/* ruled writing surface */}
        <div className="pad-ruling relative min-h-[500px] pb-16 sm:min-h-[560px]">
          {/* red margin rule */}
          <div aria-hidden className="absolute inset-y-0 left-[76px] w-px bg-[#C24429]/50 sm:left-[96px]" />

          {/* the prompts */}
          {PROMPTS.map((prompt) => (
            <div key={prompt.numeral} className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr]">
              <span className="pad-line select-none pr-4 text-right font-mono text-[11px] tracking-[0.08em] text-ink/50 sm:pr-5 sm:text-xs">
                {prompt.numeral}
              </span>
              <div className="min-w-0 pl-4 sm:pl-6">
                <p className="pad-line max-w-[44ch] break-words pr-3 font-mono text-[13px] text-ink-soft sm:text-sm">
                  {prompt.text}
                </p>
                <div aria-hidden className="pad-line" />
              </div>
            </div>
          ))}

          {/* what's been said — timestamped, editable ink */}
          {blocks.map((block) => (
            <div key={block.id} className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr]">
              <span className="pad-line select-none pr-4 text-right font-mono text-[10px] tracking-[0.06em] text-ink/45 sm:pr-5 sm:text-[11px]">
                {block.time}
              </span>
              <div className="min-w-0 pl-4 sm:pl-6">
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
            <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr]">
              <span aria-hidden />
              <span className="pad-line block break-words pl-4 pr-2 font-mono text-[13px] italic text-ink/35 sm:pl-6 sm:text-sm">
                {interim}
              </span>
            </div>
          )}

          {/* the writing line */}
          <div className="grid grid-cols-[76px_1fr] sm:grid-cols-[96px_1fr]">
            <span aria-hidden />
            <span
              ref={composeRef}
              contentEditable
              suppressContentEditableWarning
              spellCheck={false}
              role="textbox"
              aria-label="Type your thoughts, press Enter after each line"
              data-placeholder="Start anywhere…"
              className="pad-line relative block min-w-0 cursor-text break-words pl-4 pr-2 font-mono text-[13px] text-ink-soft
                caret-signal outline-none before:pointer-events-none before:absolute before:left-4 before:text-ink/30
                before:content-[attr(data-placeholder)] focus:before:content-none
                [&:not(:empty)]:before:content-none sm:pl-6 sm:text-sm"
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
    </div>
  );
};

export default TranscriptPad;
