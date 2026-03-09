import PageLayout from "@/components/PageLayout";
import ImageCarousel from "@/components/ImageCarousel";

const observationImages = Array.from({ length: 5 }, (_, i) => ({
  src: `/placeholder.svg`,
  alt: `Observation ${i + 1}`,
}));

const Observations = () => {
  return (
    <PageLayout>
      <h1 className="font-serif text-4xl md:text-5xl mb-6">Observations</h1>
      <p className="text-lg text-muted-foreground mb-20">
        Things worth noticing.
      </p>

      <ImageCarousel images={observationImages} />
    </PageLayout>
  );
};

export default Observations;
