import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface FullscreenModalProps {
  images: { src: string; alt: string }[];
  currentIndex: number;
  open: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const FullscreenModal = ({
  images,
  currentIndex,
  open,
  onClose,
  onNavigate,
}: FullscreenModalProps) => {
  const prev = useCallback(
    () => onNavigate(currentIndex === 0 ? images.length - 1 : currentIndex - 1),
    [currentIndex, images.length, onNavigate]
  );
  const next = useCallback(
    () => onNavigate(currentIndex === images.length - 1 ? 0 : currentIndex + 1),
    [currentIndex, images.length, onNavigate]
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

  return (
    <div
      className="fixed inset-0 z-[100] bg-foreground/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-primary-foreground/70 hover:text-primary-foreground"
      >
        <X className="w-6 h-6" />
      </button>

      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); prev(); }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); next(); }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-primary-foreground/70 hover:text-primary-foreground"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        </>
      )}

      <img
        src={images[currentIndex].src}
        alt={images[currentIndex].alt}
        className="max-w-[90vw] max-h-[85vh] object-contain"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
};

export default FullscreenModal;
