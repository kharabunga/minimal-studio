import { useState } from "react";
import SiteNav from "@/components/SiteNav";
import SectionCarousel from "@/components/SectionCarousel";
import Lightbox from "@/components/Lightbox";
import ImagePlaceholder from "@/components/ImagePlaceholder";
import VideoPlaceholder from "@/components/VideoPlaceholder";

const selectedWork = [
  "physical_star_cabinet.jpg", "physical_chevron_bed.jpg", "physical_patchwork_panel.jpg",
  "digital_mirrors_poster.jpg", "digital_purple_portrait.jpg", "digital_scrub_cap_ifd.jpg",
  "obs_crane_between_towers.jpg", "towhom_pool_hustler.jpg",
];

const physicalWork = [
  "physical_chevron_bed.jpg", "physical_star_cabinet.jpg", "physical_horizontal_headboard.jpg",
  "physical_mirror_frame.jpg", "physical_slatted_coffee_table.jpg", "physical_black_shelf.jpg",
  "physical_floating_shelves.jpg", "physical_patchwork_panel.jpg",
];

const digitalWork = [
  "digital_mirrors_poster.jpg", "digital_beds_illustration.jpg", "digital_scrub_cap_ifd.jpg",
  "digital_mouth_artwork.jpg", "digital_jordan_style_guide.jpg", "digital_x_circle_graphics.jpg",
  "digital_nun_meme.jpg", "digital_tipper_gore_gif.jpg", "digital_anna_velha.jpg",
  "digital_rehab_cat_fortune.jpg", "digital_rehab_cat_card.jpg", "digital_purple_portrait.jpg",
  "digital_tutto_passa.jpg", "digital_not_trash_dumpster.jpg", "digital_beds_figure_pair.jpg",
];

const toWhomImages = [
  "towhom_pool_hustler.jpg", "towhom_magicians_assistant.jpg",
  "towhom_job_application.jpg", "towhom_character_portrait.jpg",
];

const processPillars = [
  {
    file: "process_measuring_cut.jpg",
    heading: "Strategy",
    text: "Most projects start with someone having a big idea and no plan for making it real. That's fine. That's what this part is for \u2014 figuring out what the thing actually is and what it's going to take.",
    fullscreenTitle: "A jack of all trades",
  },
  {
    file: "process_problem_solving.jpg",
    heading: "Design",
    text: "This is where it starts looking like something. Visual, spatial, digital \u2014 the medium changes but the job is the same: make it clear, make it hold together, make it worth a second look.",
    fullscreenTitle: "is a master of none, but\u2014",
  },
  {
    file: "process_finishing_pass.jpg",
    heading: "Fabrication",
    text: "Some things need to exist in the world before you know if they work. Building brings surprises. Usually good ones. The idea almost always gets better once your hands are on it.",
    fullscreenTitle: "oftentimes better",
  },
  {
    file: "process_collaboration_highfive.jpg",
    heading: "Collaboration",
    text: "The best version of anything usually involves more than one brain. Half of this work is translating between people who want different things and finding the version everyone can actually live with.",
    fullscreenTitle: "than a master of one.",
  },
];

const observationImages = [
  "obs_crane_between_towers.jpg", "obs_pool_hustler_portrait.jpg", "obs_metro_cowboy.jpg",
  "obs_target_practice.jpg", "obs_heart_cloud.jpg", "obs_red_window_heart.jpg",
  "obs_red_blue_lounge.jpg", "obs_fish_on_wire.jpg",
];

function useLightbox() {
  const [state, setState] = useState<{ images: string[]; index: number; titles?: Record<string, string> } | null>(null);
  const open = (images: string[], index: number, titles?: Record<string, string>) => setState({ images, index, titles });
  const close = () => setState(null);
  return { state, open, close };
}

const Index = () => {
  const lightbox = useLightbox();

  const processFullscreenTitles = Object.fromEntries(
    processPillars.map((p) => [p.file, p.fullscreenTitle])
  );

  return (
    <>
      <SiteNav />

      {/* HERO */}
      <section className="h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl">
          <h1 className="font-serif text-hero tracking-[-0.02em] mb-6">
            Dynamic problems require<br />dynamic problem&nbsp;solvers.
          </h1>
          <p className="text-subline text-muted-foreground mb-12 font-sans">
            Good thing we're a little bit of everything.
          </p>
          <div className="space-y-1 mb-8">
            <p className="text-body font-sans font-medium tracking-wide uppercase">Kharabunga Studios</p>
            <p className="text-body font-sans text-muted-foreground">Los Angeles</p>
          </div>
          <a
            href="mailto:yo@kharabunga.com"
            className="text-body font-sans text-accent hover:underline"
          >
            yo@kharabunga.com
          </a>
          <p className="text-sm text-muted-foreground/50 mt-6 font-sans tracking-wide uppercase">
            Full site coming soon.
          </p>
        </div>
      </section>

      {/* WORK */}
      <section id="work" className="pt-32 pb-24">
        <div className="container">
          <h2 className="font-serif text-title uppercase tracking-[0.04em] mb-20">Work</h2>

          <div className="mb-32">
            <SectionCarousel
              images={selectedWork}
              onImageClick={(i) => lightbox.open(selectedWork, i)}
            />
          </div>

          <div className="mb-32">
            <h3 className="font-serif text-3xl md:text-4xl mb-8">More where that came from.</h3>
            <div className="flex flex-col gap-2 font-sans text-body">
              <a href="#physical-work" className="text-accent hover:underline">Physical Work</a>
              <a href="#digital-work" className="text-accent hover:underline">Digital Work</a>
              <a href="#to-whom" className="text-accent hover:underline">To Whom It May Concern</a>
            </div>
          </div>

          <div id="physical-work" className="mb-32">
            <h3 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.04em] mb-12">Physical Work</h3>
            <SectionCarousel
              images={physicalWork}
              onImageClick={(i) => lightbox.open(physicalWork, i)}
            />
          </div>

          <div id="digital-work" className="mb-32">
            <h3 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.04em] mb-12">Digital Work</h3>
            <SectionCarousel
              images={digitalWork}
              onImageClick={(i) => lightbox.open(digitalWork, i)}
            />
          </div>

          <div id="to-whom">
            <h3 className="font-serif text-2xl md:text-3xl uppercase tracking-[0.04em] mb-12">To Whom It May Concern</h3>
            <div className="w-[90%] mx-auto mb-10">
              <ImagePlaceholder
                filename="towhom_job_application.jpg"
                onClick={() => lightbox.open(toWhomImages, 2)}
              />
            </div>
            <p className="text-body font-sans text-muted-foreground mb-4 max-w-2xl">
              A photo and writing series about applying to jobs you're not qualified for. Pool hustler. Magician's assistant. The usual.
            </p>
            <p className="text-body font-sans text-muted-foreground mb-12 max-w-2xl">
              Part performance, part documentation, part proof that the job market is already absurd — so you might as well commit to it.
            </p>
            <SectionCarousel
              images={toWhomImages}
              onImageClick={(i) => lightbox.open(toWhomImages, i)}
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="pt-32 pb-24">
        <div className="container">
          <h2 className="font-serif text-title uppercase tracking-[0.04em] mb-10">Process</h2>
          <p className="text-body font-sans text-muted-foreground max-w-2xl mb-6">
            The work doesn't really follow a formula.
          </p>
          <p className="text-body font-sans text-muted-foreground max-w-2xl mb-24">
            It starts with the problem, borrows from whatever discipline fits, and gets built by hand more often than you'd expect.
          </p>

          <div className="space-y-32">
            {processPillars.map((pillar, i) => (
              <div key={pillar.file}>
                <div className="w-[90%] mx-auto mb-8">
                  <ImagePlaceholder
                    filename={pillar.file}
                    onClick={() => lightbox.open(
                      processPillars.map((p) => p.file),
                      i,
                      processFullscreenTitles
                    )}
                  />
                </div>
                <h3 className="font-serif text-2xl md:text-3xl mb-4">{pillar.heading}</h3>
                <p className="text-body font-sans text-muted-foreground max-w-2xl">{pillar.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OBSERVATIONS */}
      <section id="observations" className="pt-32 pb-24">
        <div className="container">
          <h2 className="font-serif text-title uppercase tracking-[0.04em] mb-10">Observations</h2>
          <p className="text-body font-sans text-muted-foreground max-w-2xl mb-6">
            Things that caught my eye. Structures, textures, moments.
          </p>
          <p className="text-body font-sans text-muted-foreground max-w-2xl mb-24">
            Not everything has to be a project.
          </p>
          <SectionCarousel
            images={observationImages}
            onImageClick={(i) => lightbox.open(observationImages, i)}
          />
        </div>
      </section>

      {/* WORK WITH ME */}
      <section id="work-with-me" className="pt-32 pb-32">
        <div className="container">
          <h2 className="font-serif text-title uppercase tracking-[0.04em] mb-16">Work With Me</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <VideoPlaceholder filename="magic_serious_about_the_work.mp4" caption="Serious about the work." />
            <VideoPlaceholder filename="magic_not_too_serious.mp4" caption="Not too serious about ourselves." />
          </div>

          <div className="max-w-2xl space-y-6 mb-16">
            <p className="text-body font-sans text-muted-foreground">
              You've got a thing that needs to get made.<br />
              Maybe it's physical, maybe it's digital, maybe it's both and you haven't figured that out yet.
            </p>
            <p className="text-body font-sans text-muted-foreground">
              That's fine. We like the head scratchers.
            </p>
            <p className="text-body font-sans text-foreground font-medium">
              Tell us what you're working on.
            </p>
          </div>

          <a
            href="mailto:yo@kharabunga.com"
            className="text-subline font-sans text-accent hover:underline"
          >
            yo@kharabunga.com
          </a>
        </div>
      </section>

      {lightbox.state && (
        <Lightbox
          images={lightbox.state.images}
          initialIndex={lightbox.state.index}
          open={true}
          onClose={lightbox.close}
          fullscreenTitles={lightbox.state.titles}
        />
      )}
    </>
  );
};

export default Index;
