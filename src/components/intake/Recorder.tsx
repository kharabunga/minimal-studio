import { useCallback, useEffect, useRef, useState } from "react";

interface SpeechAlternativeLike {
  transcript: string;
}
interface SpeechResultLike {
  isFinal: boolean;
  0: SpeechAlternativeLike;
}
interface SpeechEventLike {
  resultIndex: number;
  results: { length: number; [index: number]: SpeechResultLike };
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((e: SpeechEventLike) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
}
type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

const getSpeechRecognition = (): SpeechRecognitionCtor | null => {
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
};

const BAR_COUNT = 48;
const BAR_INK = "#3A3831";

// deterministic idle waveform so the resting instrument reads as a printed
// object rather than random noise on every load
const IDLE_BARS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const envelope = Math.sin((i / (BAR_COUNT - 1)) * Math.PI) ** 0.6;
  const n = Math.abs(Math.sin(i * 12.9898) * 43758.5453);
  const jitter = 0.3 + 0.7 * (n - Math.floor(n));
  return Math.max(0.08, envelope * jitter);
});

const formatClock = (totalSeconds: number) => {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
};

type RecorderStatus = "ready" | "recording" | "denied";

interface RecorderProps {
  /** increment to toggle recording from outside (the "Record" mode button) */
  recordSignal: number;
  onFinalSpeech: (text: string) => void;
  onInterimSpeech: (text: string) => void;
  onRecordingChange: (recording: boolean) => void;
  onMemoComplete: (seconds: number) => void;
}

const Recorder = ({
  recordSignal,
  onFinalSpeech,
  onInterimSpeech,
  onRecordingChange,
  onMemoComplete,
}: RecorderProps) => {
  const [status, setStatus] = useState<RecorderStatus>("ready");
  const [elapsed, setElapsed] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const hoverRef = useRef(false);
  const statusRef = useRef<RecorderStatus>("ready");
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const levelsRef = useRef<number[]>([...IDLE_BARS]);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const startedAtRef = useRef(0);

  statusRef.current = status;

  const draw = useCallback((heights: number[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvas.getBoundingClientRect();
    if (canvas.width !== width * dpr || canvas.height !== height * dpr) {
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    const gap = width / BAR_COUNT;
    const barWidth = Math.max(1.5, gap * 0.4);
    const mid = height / 2;
    ctx.fillStyle = BAR_INK;
    for (let i = 0; i < BAR_COUNT; i++) {
      const h = Math.max(2, heights[i] * (height * 0.9));
      const x = i * gap + (gap - barWidth) / 2;
      ctx.fillRect(x, mid - h / 2, barWidth, h);
    }
  }, []);

  // waveform loop: live while recording, gently awake on hover, still otherwise
  const loop = useCallback(
    (t: number) => {
      const recording = statusRef.current === "recording";
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      if (recording && analyserRef.current) {
        const analyser = analyserRef.current;
        const buf = new Uint8Array(analyser.fftSize);
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const v = (buf[i] - 128) / 128;
          sum += v * v;
        }
        const rms = Math.sqrt(sum / buf.length);
        const level = Math.max(0.06, Math.min(1, rms * 3.2));
        levelsRef.current = [...levelsRef.current.slice(1), level];
        draw(levelsRef.current);
      } else if (hoverRef.current && !reduceMotion) {
        draw(
          IDLE_BARS.map(
            (h, i) => h * (0.82 + 0.18 * Math.sin(t / 420 + i * 0.42)),
          ),
        );
      } else {
        draw(IDLE_BARS);
        return; // settle back to the printed state, stop the loop
      }
      rafRef.current = requestAnimationFrame(loop);
    },
    [draw],
  );

  const wake = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(loop);
  }, [loop]);

  useEffect(() => {
    draw(IDLE_BARS);
    const onResize = () => draw(levelsRef.current);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [draw]);

  useEffect(() => {
    if (status !== "recording") return;
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 250);
    return () => window.clearInterval(id);
  }, [status]);

  const stopRecording = useCallback(() => {
    const recognition = recognitionRef.current;
    if (recognition) {
      recognition.onend = null;
      recognition.onresult = null;
      try {
        recognition.stop();
      } catch {
        /* already stopped */
      }
      recognitionRef.current = null;
    }
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    audioCtxRef.current?.close().catch(() => undefined);
    audioCtxRef.current = null;
    analyserRef.current = null;

    const seconds = Math.max(1, Math.round((Date.now() - startedAtRef.current) / 1000));
    levelsRef.current = [...IDLE_BARS];
    statusRef.current = "ready";
    setStatus("ready");
    setElapsed(0);
    onInterimSpeech("");
    onRecordingChange(false);
    onMemoComplete(seconds);
  }, [onInterimSpeech, onMemoComplete, onRecordingChange]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const audioCtx = new AudioContext();
      audioCtxRef.current = audioCtx;
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      audioCtx.createMediaStreamSource(stream).connect(analyser);
      analyserRef.current = analyser;

      levelsRef.current = new Array(BAR_COUNT).fill(0.06);
      startedAtRef.current = Date.now();
      setElapsed(0);
      // update the ref eagerly — the rAF loop may fire before React re-renders
      statusRef.current = "recording";
      setStatus("recording");
      onRecordingChange(true);
      wake();

      const Recognition = getSpeechRecognition();
      if (Recognition) {
        const recognition = new Recognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";
        recognition.onresult = (e) => {
          let interim = "";
          for (let i = e.resultIndex; i < e.results.length; i++) {
            const result = e.results[i];
            const text = result[0].transcript.trim();
            if (!text) continue;
            if (result.isFinal) {
              onFinalSpeech(text);
            } else {
              interim += ` ${text}`;
            }
          }
          onInterimSpeech(interim.trim());
        };
        // Chrome ends continuous sessions on silence; keep listening
        recognition.onend = () => {
          if (statusRef.current === "recording") {
            try {
              recognition.start();
            } catch {
              /* mid-restart, ignore */
            }
          }
        };
        recognition.onerror = () => undefined;
        recognition.start();
        recognitionRef.current = recognition;
      }
    } catch {
      setStatus("denied");
      window.setTimeout(() => {
        setStatus((s) => (s === "denied" ? "ready" : s));
      }, 3200);
    }
  }, [onFinalSpeech, onInterimSpeech, onRecordingChange, wake]);

  const toggle = useCallback(() => {
    if (statusRef.current === "recording") stopRecording();
    else if (statusRef.current === "ready") void startRecording();
  }, [startRecording, stopRecording]);

  const firstSignal = useRef(true);
  useEffect(() => {
    if (firstSignal.current) {
      firstSignal.current = false;
      return;
    }
    toggle();
  }, [recordSignal, toggle]);

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      audioCtxRef.current?.close().catch(() => undefined);
      recognitionRef.current?.stop();
    };
  }, []);

  const recording = status === "recording";
  const statusLabel = status === "denied" ? "MIC OFF" : recording ? "REC" : "READY";

  return (
    <div
      className="anim-breathe group relative mx-auto w-full max-w-[880px]"
      onMouseEnter={() => {
        hoverRef.current = true;
        wake();
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
      }}
    >
      {/* instrument bar */}
      <div
        className="relative flex items-stretch overflow-hidden rounded-[20px] border border-[#BCB5A4]
          bg-gradient-to-b from-[#F2EEE4] via-[#E7E2D4] to-[#D2CCBB]
          shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_-1px_0_rgba(38,36,30,0.12)_inset,0_44px_80px_-24px_rgba(38,36,30,0.5),0_14px_28px_-12px_rgba(38,36,30,0.3)]"
      >
        {/* moving amber sheen */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
          <div
            className="absolute -inset-y-8 -left-1/3 w-1/2 rotate-[18deg]
              bg-gradient-to-r from-transparent via-amberglow/[0.16] to-transparent
              transition-transform [transition-duration:1400ms] ease-out group-hover:translate-x-[80%]"
          />
        </div>

        {/* record cell */}
        <div className="flex items-center py-5 pl-5 pr-4 sm:py-8 sm:pl-9 sm:pr-8">
          <button
            type="button"
            onClick={toggle}
            aria-pressed={recording}
            aria-label={recording ? "Stop recording" : "Start recording a voice memo"}
            className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full
              bg-gradient-to-b from-[#F5F1E8] to-[#C8C1B0]
              shadow-[0_3px_7px_rgba(38,36,30,0.35),0_1px_0_rgba(255,255,255,0.85)_inset]
              transition-transform duration-150 active:scale-[0.97] sm:h-[76px] sm:w-[76px]"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-b from-[#DAD4C4] to-[#EFEBE0]
                shadow-[0_2px_5px_rgba(38,36,30,0.3)_inset] sm:h-14 sm:w-14"
            >
              <span
                className={`block rounded-full bg-signal transition-all duration-300
                  ${recording ? "h-4 w-4 rounded-[4px] shadow-[0_0_18px_rgba(199,67,31,0.85)] sm:h-5 sm:w-5" : "h-4 w-4 shadow-[0_1px_2px_rgba(120,30,10,0.6),0_0_0_1px_rgba(120,30,10,0.25)] sm:h-6 sm:w-6"}`}
              />
            </span>
          </button>
        </div>

        <div
          aria-hidden
          className="my-5 w-px shrink-0 bg-gradient-to-b from-transparent via-[#BDB6A4] to-transparent sm:my-7"
        />

        {/* voice cell */}
        <div className="flex min-w-0 flex-1 flex-col justify-center gap-3 px-4 sm:gap-4 sm:px-9">
          <canvas ref={canvasRef} className="h-9 w-full max-w-[360px] sm:h-12" />
          <span className="truncate font-mono text-[8px] tracking-[0.22em] text-graphite/55 sm:text-[10px] sm:tracking-[0.26em]">
            VOICE MEMO&ensp;·&ensp;NO TIME LIMIT. RANT AWAY.
          </span>
        </div>

        <div
          aria-hidden
          className="my-5 w-px shrink-0 bg-gradient-to-b from-transparent via-[#BDB6A4] to-transparent sm:my-7"
        />

        {/* readout cell */}
        <div className="flex shrink-0 flex-col items-start justify-center gap-1.5 py-4 pl-4 pr-5 sm:gap-2 sm:pl-8 sm:pr-10">
          <span className="font-mono text-base tabular-nums tracking-[0.1em] text-graphite/90 sm:text-2xl">
            {formatClock(elapsed)}
          </span>
          <span
            className={`flex items-center gap-1.5 font-mono text-[8px] tracking-[0.2em] sm:gap-2 sm:text-[10px]
              ${status === "denied" ? "text-graphite/50" : "text-signal"}`}
          >
            <span
              className={`h-[5px] w-[5px] rounded-full sm:h-[6px] sm:w-[6px]
                ${recording ? "anim-blink bg-signal" : status === "denied" ? "bg-graphite/40" : "bg-signal"}`}
            />
            {statusLabel}
          </span>
          <span aria-hidden className="mt-1 hidden grid-cols-8 gap-[4px] sm:grid">
            {Array.from({ length: 32 }, (_, i) => (
              <span key={i} className="h-[3px] w-[3px] rounded-full bg-graphite/30" />
            ))}
          </span>
        </div>
      </div>

      {/* desk contact shadow */}
      <div
        aria-hidden
        className="absolute -bottom-8 left-1/2 h-9 w-[88%] -translate-x-1/2 rounded-[50%] bg-graphite/30 blur-xl"
      />
    </div>
  );
};

export default Recorder;
