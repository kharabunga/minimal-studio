import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import FullscreenModal from "./FullscreenModal";

interface ImageCarouselProps {
  images: { src: string; alt: string }[];
}

const ImageCarousel = ({ images }: ImageCarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  if (images.length === 0) return null;

  return (
    <>
      <div className="relative group">
        <div
          className="aspect-[3/2] bg-muted cursor-pointer overflow-hidden"
          onClick={() => setModalOpen(true)}
        >
          <img
            src={images[current].src}
            alt={images[current].alt}
            className="w-full h-full object-cover"
          />
        </div>
        {images.length > 1 && (
          <>
            <button
              onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/70 hover:text-foreground"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/70 hover:text-foreground"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
            <div className="mt-3 text-sm text-muted-foreground">
              {current + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      <FullscreenModal
        images={images}
        currentIndex={current}
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onNavigate={setCurrent}
      />
    </>
  );
};

export default ImageCarousel;
