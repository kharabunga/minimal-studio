import PageLayout from "@/components/PageLayout";

const About = () => {
  return (
    <PageLayout>
      <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl mb-16 text-black">
        About
      </h1>

      {/* Portrait placeholder */}
      <div className="aspect-[3/4] bg-neutral-200 flex items-center justify-center mb-16 max-w-sm">
        <span className="text-sm text-neutral-400 font-mono">
          portrait.jpg
        </span>
      </div>

      <div className="max-w-2xl space-y-6 text-lg text-neutral-500 leading-relaxed">
        <p>
          Khara Fernando is the person behind{" "}
          <a
            href="https://kharabungastudios.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-black hover:text-neutral-500 transition-colors border-b border-neutral-300"
          >
            Kharabunga Studios
          </a>
          .
        </p>

        <p>
          The short version: I make things, figure things out, and help other
          people do both. The longer version involves theatre, woodworking,
          tech, sustainable small business, and a professional art practice
          that doesn't really fit in one box.
        </p>

        <p>
          Most recently I helped build the creative launch and brand for{" "}
          <span className="text-black">
            The Institute for Functional Dentistry
          </span>{" "}
          — translating a complicated idea into something people could
          actually understand and get behind. That's the work I like best:
          someone has a thing that matters to them, it's a bit of a head
          scratcher, and they need someone who can manage the project and
          make it look right at the same time.
        </p>

        <p>
          I'm based in Los Angeles. I'm probably building something right now.
        </p>
      </div>
    </PageLayout>
  );
};

export default About;
