import PageLayout from "@/components/PageLayout";
import ImageCarousel from "@/components/ImageCarousel";

const studioImages = Array.from({ length: 3 }, (_, i) => ({
  src: `/placeholder.svg`,
  alt: `Studio ${i + 1}`,
}));

const Process = () => {
  return (
    <PageLayout>
      <h1 className="font-serif text-4xl md:text-5xl mb-6">Process</h1>
      <p className="text-lg text-muted-foreground mb-20">
        Ideas are easy. Making them real is the interesting part.
      </p>

      <ImageCarousel images={studioImages} />
    </PageLayout>
  );
};

export default Process;
