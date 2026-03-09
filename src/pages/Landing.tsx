import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const Landing = () => {
  return (
    <>
      <SiteNav />
      <main className="min-h-screen flex flex-col">
        <div className="container max-w-3xl flex-1 flex flex-col justify-center py-20 md:py-0">
          <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr] gap-10 md:gap-14 items-end">
            {/* Image */}
            <div className="aspect-[3/4] bg-muted max-h-[50vh] md:max-h-[55vh] w-full" />

            {/* Text block */}
            <div className="flex flex-col justify-end pb-2">
              <h1 className="font-serif text-4xl md:text-[3.25rem] md:leading-[1.1] leading-[1.15] tracking-[-0.02em] mb-5">
                Dynamic problems require dynamic problem&nbsp;solvers.
              </h1>
              <p className="text-base md:text-lg text-muted-foreground mb-8 leading-relaxed">
                Good thing we're a little bit of everything.
              </p>
              <div className="flex items-center justify-between">
                <Link
                  to="/work"
                  className="inline-block text-xs tracking-[0.15em] uppercase border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
                >
                  View Work
                </Link>
                <span className="text-[11px] tracking-[0.08em] text-muted-foreground/60 uppercase">
                  Full site coming soon
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Landing;
