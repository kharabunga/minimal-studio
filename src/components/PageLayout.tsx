import SiteNav from "./SiteNav";

interface PageLayoutProps {
  children: React.ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <>
      <SiteNav />
      <main className="pt-24 pb-24">
        <div className="container max-w-3xl">{children}</div>
      </main>
    </>
  );
};

export default PageLayout;
