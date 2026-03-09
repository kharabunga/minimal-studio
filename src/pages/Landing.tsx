import { Link } from "react-router-dom";
import SiteNav from "@/components/SiteNav";

const Landing = () => {
  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-24">
        <div className="container max-w-3xl">
          <div className="aspect-[3/4] bg-muted mb-16" />

          <h1 className="font-serif text-4xl md:text-5xl leading-tight mb-6">
            Dynamic problems require dynamic problem solvers.
          </h1>
          <p className="text-lg text-muted-foreground mb-12">
            Good thing we're a little bit of everything.
          </p>

          <Link
            to="/work"
            className="inline-block text-sm tracking-wide border-b border-foreground pb-1 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
          >
            View Work
          </Link>
        </div>
      </main>
    </>
  );
};

export default Landing;
