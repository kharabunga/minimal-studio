import { useEffect, useState } from "react";

interface SplashIntroProps {
  onDone: () => void;
}

/**
 * A full-bleed title card — just the wordmark, centered — that holds for a
 * beat and then dissolves into the page. Not a loading spinner: it plays once
 * per session and skips entirely under prefers-reduced-motion.
 */
const SplashIntro = ({ onDone }: SplashIntroProps) => {
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      onDone();
      return;
    }
    const hold = window.setTimeout(() => setLeaving(true), 1500);
    const done = window.setTimeout(onDone, 2450);
    return () => {
      window.clearTimeout(hold);
      window.clearTimeout(done);
    };
  }, [onDone]);

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-cream transition-opacity duration-[900ms] ease-[cubic-bezier(0.4,0,0.2,1)] ${
        leaving ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      {/* faint warm light so the card reads as staged, not blank */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(680px 480px at 50% 42%, rgba(226,169,63,0.16), transparent 68%)",
        }}
      />
      <div className="anim-splash-in relative px-6 text-center">
        <p className="font-serif text-[clamp(1.5rem,4.4vw,2.75rem)] font-medium leading-[1.15] tracking-[0.42em] text-ink">
          KHARABUNGA
        </p>
        <p className="mt-3 font-serif text-[clamp(1.5rem,4.4vw,2.75rem)] font-medium leading-[1.15] tracking-[0.42em] text-ink">
          STUDIOS
        </p>
        <span
          aria-hidden
          className="anim-splash-rule mx-auto mt-7 block h-px w-16 origin-center bg-signal"
        />
      </div>
    </div>
  );
};

export default SplashIntro;
