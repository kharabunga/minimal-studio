import PageLayout from "@/components/PageLayout";
import ImageCarousel from "@/components/ImageCarousel";

const placeholder = (label: string, i: number) => ({
  src: `/placeholder.svg`,
  alt: `${label} ${i + 1}`,
});

const physicalWork = Array.from({ length: 4 }, (_, i) => placeholder("Physical work", i));
const digitalWork = Array.from({ length: 4 }, (_, i) => placeholder("Digital work", i));

const Work = () => {
  return (
    <PageLayout>
      <h1 className="font-serif text-4xl md:text-5xl mb-6">Work</h1>
      <p className="text-lg text-muted-foreground mb-20">
        Selected work across fabrication, digital design, and visual storytelling.
      </p>

      <section className="mb-20">
        <h2 className="font-serif text-2xl mb-8">Physical Work</h2>
        <ImageCarousel images={physicalWork} />
      </section>

      <section>
        <h2 className="font-serif text-2xl mb-8">Digital Work</h2>
        <ImageCarousel images={digitalWork} />
      </section>
    </PageLayout>
  );
};

export default Work;
