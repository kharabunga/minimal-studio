import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ImagePlaceholder from "./ImagePlaceholder";

interface SectionCarouselProps {
  images: string[];
  onImageClick?: (index: number) => void;
}

const SectionCarousel = ({ images, onImageClick }: SectionCarouselProps) => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

  if (images.length === 0) return null;

  return (
    <div className="relative w-[90%] mx-auto">
      <ImagePlaceholder
        filename={images[current]}
        onClick={() => onImageClick?.(current)}
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8" />
          </button>
          <div className="mt-3 text-sm text-muted-foreground font-sans text-center">
            {current + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
};

export default SectionCarousel;
