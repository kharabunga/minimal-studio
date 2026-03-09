import PageLayout from "@/components/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <h1 className="font-serif text-4xl md:text-5xl mb-12">About</h1>

      <div className="aspect-[3/4] bg-muted mb-12 max-w-sm" />

      <div className="space-y-6 text-base leading-relaxed text-muted-foreground max-w-xl">
        <p>
          Khara Fernando is a multidisciplinary artist, strategist, and builder
          working across design, fabrication, and storytelling.
        </p>
        <p>
          Kharabunga Studios is the creative practice behind the work — a space
          where ideas move from concept to reality through hands-on making,
          digital craft, and thoughtful collaboration.
        </p>
      </div>
    </PageLayout>
  );
};

export default About;
