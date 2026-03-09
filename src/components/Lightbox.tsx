import { useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface LightboxProps {
  images: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
  /** Optional fullscreen overlay titles per image (by filename) */
  fullscreenTitles?: Record<string, string>;
}

const Lightbox = ({ images, initialIndex, open, onClose, fullscreenTitles }: LightboxProps) => {
  const [current, setCurrent] = useState(initialIndex);

  useEffect(() => {
    if (open) setCurrent(initialIndex);
  }, [open, initialIndex]);

  const prev = useCallback(
    () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1)),
    [images.length]
  );
  const next = useCallback(
    () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1)),
    [images.length]
  );

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose, prev, next]);

  if (!open) return null;

  const currentFile = images[current];
  const overlayTitle = fullscreenTitles?.[currentFile];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.85)" }}
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-primary-foreground/70 hover:text-primary-foreground z-10"
      >
        <X className="w-7 h-7" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ChevronLeft className="w-10 h-10" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ChevronRight className="w-10 h-10" />
          </button>
        </>
      )}

      <div
        className="relative max-w-[85vw] max-h-[80vh] aspect-video bg-muted flex items-center justify-center w-full"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: "1200px" }}
      >
        <span className="text-sm text-muted-foreground font-sans">{currentFile}</span>
        {overlayTitle && (
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              className="font-serif text-primary-foreground text-center px-8"
              style={{
                fontSize: "clamp(2rem, 5vw, 5rem)",
                textShadow: "0 2px 20px rgba(0,0,0,0.5)",
              }}
            >
              {overlayTitle}
            </h2>
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-primary-foreground/60 text-sm font-sans">
          {current + 1} / {images.length}
        </div>
      )}
    </div>
  );
};

export default Lightbox;
