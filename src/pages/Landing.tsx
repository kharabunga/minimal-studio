import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Paperclip } from "lucide-react";
import Recorder from "@/components/intake/Recorder";
import TranscriptPad, { PadBlock } from "@/components/intake/TranscriptPad";
import DeskArtifacts from "@/components/intake/DeskArtifacts";
import CaseFile, { CaseItem } from "@/components/intake/CaseFile";

let uid = 0;
const nextId = (prefix: string) => `${prefix}-${++uid}`;

const timeNow = () =>
  new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });

const splitSentences = (text: string) =>
  text
    .split(/(?<=[.?!])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(bytes >= 10 * 1024 * 1024 ? 0 : 1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
};

const formatDuration = (seconds: number) =>
  `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;

// the sample rant — shows the instrument in use, and it's all editable
const SAMPLE_BLOCKS: PadBlock[] = [
  {
    id: "sample-1",
    time: "7:42 PM",
    lines: [
      "So… I'm opening a bakery.",
      "But it's not just a bakery.",
      "It's also a community space.",
      "And maybe a wine bar?",
      "Kind of all over the place right now.",
      "I have a location.",
      "It's beautiful but complicated.",
      "Historic building. Small kitchen.",
      "Lots of rules.",
      "I need help bringing it all together.",
    ].map((text) => ({ id: nextId("l"), text })),
  },
  {
    id: "sample-2",
    time: "7:45 PM",
    lines: [
      "The vibe I want is warm,",
      "a little unexpected,",
      "very neighborhood, not precious.",
      "Also——how do we make it make sense",
      "financially?",
      "That's the part I keep avoiding.",
      "I know I need a plan.",
      "I just don't know where to start.",
      "That's why I'm here.",
    ].map((text) => ({ id: nextId("l"), text })),
  },
];

// what's already lying on the desk
const SEED_ITEMS: CaseItem[] = [
  { id: "seed-1", kind: "file", label: "site photos", meta: "3 × JPG", settled: false },
  { id: "seed-2", kind: "note", label: "floor plan sketch", meta: "PAPER", settled: false },
  { id: "seed-3", kind: "note", label: "inspiration notes", meta: "PAPER", settled: false },
  { id: "seed-4", kind: "file", label: "brand deck.pdf", meta: "12 MB · PDF", settled: false },
];

const Landing = () => {
  const [blocks, setBlocks] = useState<PadBlock[]>(SAMPLE_BLOCKS);
  const [interim, setInterim] = useState("");
  const [items, setItems] = useState<CaseItem[]>(SEED_ITEMS);
  const [isDragging, setIsDragging] = useState(false);
  const [recordSignal, setRecordSignal] = useState(0);
  const [typeSignal, setTypeSignal] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const speechBlockRef = useRef<string | null>(null);
  const typedBlockRef = useRef<{ id: string; at: number } | null>(null);

  /* ——— transcript ——— */

  const appendLines = useCallback((blockId: string | null, time: string, texts: string[]) => {
    if (texts.length === 0) return blockId;
    const newLines = texts.map((text) => ({ id: nextId("l"), text }));
    const freshId = nextId("b");
    setBlocks((prev) => {
      if (blockId && prev.some((b) => b.id === blockId)) {
        return prev.map((b) => (b.id === blockId ? { ...b, lines: [...b.lines, ...newLines] } : b));
      }
      return [...prev, { id: freshId, time, lines: newLines }];
    });
    return blockId ?? freshId;
  }, []);

  const handleFinalSpeech = useCallback(
    (text: string) => {
      speechBlockRef.current = appendLines(speechBlockRef.current, timeNow(), splitSentences(text));
    },
    [appendLines],
  );

  const handleTypedLine = useCallback(
    (text: string) => {
      // group typed lines under one timestamp unless a few minutes have passed
      const current = typedBlockRef.current;
      const stale = !current || Date.now() - current.at > 3 * 60 * 1000;
      const id = appendLines(stale ? null : current!.id, timeNow(), [text]);
      typedBlockRef.current = { id: id as string, at: Date.now() };
    },
    [appendLines],
  );

  const handleEditLine = useCallback((blockId: string, lineId: string, text: string) => {
    setBlocks((prev) =>
      prev
        .map((b) =>
          b.id === blockId
            ? {
                ...b,
                lines: text
                  ? b.lines.map((l) => (l.id === lineId ? { ...l, text } : l))
                  : b.lines.filter((l) => l.id !== lineId),
              }
            : b,
        )
        .filter((b) => b.lines.length > 0),
    );
  }, []);

  const handleRecordingChange = useCallback((recording: boolean) => {
    if (recording) speechBlockRef.current = null; // fresh timestamp per memo
  }, []);

  const handleMemoComplete = useCallback((seconds: number) => {
    setItems((prev) => [
      ...prev,
      {
        id: nextId("i"),
        kind: "audio",
        label: `voice memo ${String(prev.filter((i) => i.kind === "audio").length + 1).padStart(2, "0")}`,
        meta: `${formatDuration(seconds)} · AUDIO`,
      },
    ]);
  }, []);

  /* ——— desk items ——— */

  const addFiles = useCallback((files: File[]) => {
    if (files.length === 0) return;
    setItems((prev) => [
      ...prev,
      ...files.map((file) => ({
        id: nextId("i"),
        kind: "file" as const,
        label: file.name,
        meta: `${formatBytes(file.size)}${file.type ? ` · ${file.type.split("/")[1]?.toUpperCase() ?? ""}` : ""}`,
      })),
    ]);
  }, []);

  const addLink = useCallback((url: string) => {
    let label = url;
    try {
      label = new URL(url).hostname.replace(/^www\./, "");
    } catch {
      /* keep raw text */
    }
    setItems((prev) => [...prev, { id: nextId("i"), kind: "link", label, meta: "LINK" }]);
  }, []);

  // whole page is the desk: drag anything anywhere
  useEffect(() => {
    let depth = 0;
    const onDragEnter = (e: DragEvent) => {
      e.preventDefault();
      depth += 1;
      setIsDragging(true);
    };
    const onDragOver = (e: DragEvent) => e.preventDefault();
    const onDragLeave = () => {
      depth = Math.max(0, depth - 1);
      if (depth === 0) setIsDragging(false);
    };
    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      depth = 0;
      setIsDragging(false);
      const files = Array.from(e.dataTransfer?.files ?? []);
      if (files.length > 0) {
        addFiles(files);
        return;
      }
      const text = e.dataTransfer?.getData("text/uri-list") || e.dataTransfer?.getData("text/plain") || "";
      if (/^https?:\/\//.test(text.trim())) addLink(text.trim());
    };
    window.addEventListener("dragenter", onDragEnter);
    window.addEventListener("dragover", onDragOver);
    window.addEventListener("dragleave", onDragLeave);
    window.addEventListener("drop", onDrop);
    return () => {
      window.removeEventListener("dragenter", onDragEnter);
      window.removeEventListener("dragover", onDragOver);
      window.removeEventListener("dragleave", onDragLeave);
      window.removeEventListener("drop", onDrop);
    };
  }, [addFiles, addLink]);

  // pasted links land on the desk too (unless you're writing on the pad)
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement)
        return;
      const text = e.clipboardData?.getData("text/plain")?.trim() ?? "";
      if (/^https?:\/\/\S+$/.test(text)) addLink(text);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [addLink]);

  // the desk lamp shifts almost imperceptibly as you scroll
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (glowRef.current) glowRef.current.style.transform = `translateY(${window.scrollY * 0.05}px)`;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const mailtoHref = (() => {
    const transcript = blocks
      .map((b) => `[${b.time}]\n${b.lines.map((l) => l.text).join("\n")}`)
      .join("\n\n");
    const list = items.map((i) => `· ${i.label}${i.meta ? ` (${i.meta})` : ""}`).join("\n");
    const body = `Here's where my head is at:\n\n${transcript}\n\nOn the desk:\n${list}\n`.slice(0, 1600);
    return `mailto:yo@kharabunga.com?subject=${encodeURIComponent("What's up — untitled case")}&body=${encodeURIComponent(body)}`;
  })();

  return (
    <div className="intake relative min-h-screen overflow-x-clip bg-cream text-ink">
      {/* warm desk-lamp light */}
      <div ref={glowRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 will-change-transform">
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(900px 620px at 78% -8%, rgba(226,169,63,0.20), transparent 65%)",
              "radial-gradient(700px 520px at -12% 32%, rgba(226,169,63,0.10), transparent 60%)",
              "radial-gradient(1100px 800px at 50% 118%, rgba(38,36,30,0.14), transparent 62%)",
            ].join(", "),
          }}
        />
      </div>
      {/* paper grain */}
      <div aria-hidden className="desk-grain pointer-events-none fixed inset-0 z-0 opacity-[0.05] mix-blend-multiply" />

      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        aria-hidden
        tabIndex={-1}
        onChange={(e) => {
          addFiles(Array.from(e.target.files ?? []));
          e.target.value = "";
        }}
      />

      <div className="relative z-10 mx-auto max-w-[1140px] px-6 sm:px-10">
        {/* masthead */}
        <header className="flex items-start justify-between pt-9">
          <Link to="/" className="font-serif text-[13px] font-medium leading-snug tracking-[0.22em] text-ink">
            KHARABUNGA
            <br />
            STUDIOS
          </Link>
          <nav className="flex items-center gap-7 pt-1 sm:gap-9">
            <Link
              to="/work"
              className="font-mono text-[11px] tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
            >
              WORK
            </Link>
            <Link
              to="/about"
              className="font-mono text-[11px] tracking-[0.2em] text-ink/60 transition-colors hover:text-ink"
            >
              ABOUT
            </Link>
            <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-ink" />
          </nav>
        </header>

        {/* hero */}
        <section className="pt-16 text-center sm:pt-20">
          <h1 className="font-serif text-[clamp(4rem,13vw,9.5rem)] font-medium leading-[0.95] tracking-[-0.02em] text-ink">
            What&rsquo;s up?
          </h1>
          <p className="mt-8 inline-flex flex-col items-center">
            <span className="font-mono text-sm tracking-[0.08em] text-ink/85">Start anywhere.</span>
            <svg aria-hidden viewBox="0 0 140 7" className="mt-1.5 h-[7px] w-[140px] text-signal">
              <path
                d="M3 4.5 C 32 2, 66 6, 100 3.5 S 130 4.5, 137 3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </p>
        </section>

        {/* the instrument */}
        <section className="mt-16 sm:mt-20">
          <Recorder
            recordSignal={recordSignal}
            onFinalSpeech={handleFinalSpeech}
            onInterimSpeech={setInterim}
            onRecordingChange={handleRecordingChange}
            onMemoComplete={handleMemoComplete}
          />

          {/* ways in */}
          <div className="mt-16 flex items-center justify-center gap-5 sm:mt-20 sm:gap-8">
            <button
              type="button"
              onClick={() => setRecordSignal((n) => n + 1)}
              className="group flex items-center gap-2.5 font-mono text-[13px] text-ink/80 transition-colors hover:text-ink"
            >
              <span className="grid h-5 w-5 place-items-center rounded-full border border-signal/70">
                <span className="h-2 w-2 rounded-full bg-signal transition-transform group-hover:scale-110" />
              </span>
              Record
            </button>
            <span aria-hidden className="h-5 w-px bg-ink/25" />
            <button
              type="button"
              onClick={() => setTypeSignal((n) => n + 1)}
              className="group flex items-center gap-2.5 font-mono text-[13px] text-ink/80 transition-colors hover:text-ink"
            >
              <span className="font-serif text-lg leading-none text-ink transition-transform group-hover:scale-110">
                T
              </span>
              Type
            </button>
            <span aria-hidden className="h-5 w-px bg-ink/25" />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-2.5 font-mono text-[13px] text-ink/80 transition-colors hover:text-ink"
            >
              <Paperclip aria-hidden className="h-4 w-4 text-ink/70 transition-transform group-hover:-rotate-12" />
              Drop things
            </button>
          </div>
          <p className="mt-5 text-center font-mono text-[11px] tracking-[0.06em] text-ink/50">
            Use one. Use all. Whatever helps you explain.
          </p>
        </section>

        {/* the desk */}
        <section className="mt-24 grid gap-16 sm:mt-28 lg:grid-cols-[0.92fr_1.08fr] lg:gap-12">
          <DeskArtifacts />
          <TranscriptPad
            blocks={blocks}
            interim={interim}
            typeSignal={typeSignal}
            onEditLine={handleEditLine}
            onTypedLine={handleTypedLine}
          />
        </section>

        {/* the case file */}
        <section className="mt-24 sm:mt-28">
          <CaseFile
            items={items}
            isDragging={isDragging}
            onBrowse={() => fileInputRef.current?.click()}
            mailtoHref={mailtoHref}
          />
        </section>

        {/* the point */}
        <section className="mx-auto max-w-[640px] py-32 text-center sm:py-40">
          <p className="font-serif text-2xl leading-[1.5] text-ink sm:text-[2rem]">
            Maybe it&rsquo;s brand strategy.
            <br />
            Maybe it&rsquo;s lighting an event.
            <br />
            Maybe it&rsquo;s building something from scratch.
            <br />
            <em>Or maybe it&rsquo;s Maybelline.</em>
          </p>
          <p className="mt-10 font-serif text-2xl text-ink sm:text-[2rem]">
            Either way,{" "}
            <a
              href={mailtoHref}
              className="underline decoration-signal decoration-2 underline-offset-[6px] transition-colors hover:text-ink-soft"
            >
              tell me about it
            </a>
            .
          </p>
        </section>

        {/* colophon */}
        <footer className="border-t border-ink/15 pb-12 pt-10">
          <p className="font-serif text-lg italic text-ink/85 sm:text-xl">
            Make dope, beautiful things w/ dope, beautiful people.
          </p>
          <div className="mt-8 flex flex-col gap-4 font-mono text-[10px] tracking-[0.18em] text-ink/50 sm:flex-row sm:items-center sm:justify-between">
            <span>KHARABUNGA STUDIOS · LOS ANGELES</span>
            <span className="flex items-center gap-6">
              <Link to="/work" className="transition-colors hover:text-ink">
                WORK
              </Link>
              <Link to="/about" className="transition-colors hover:text-ink">
                ABOUT
              </Link>
              <a href="mailto:yo@kharabunga.com" className="transition-colors hover:text-ink">
                YO@KHARABUNGA.COM
              </a>
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Landing;
