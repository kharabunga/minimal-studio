import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { href: "#work", label: "WORK" },
  { href: "#process", label: "PROCESS" },
  { href: "#observations", label: "OBSERVATIONS" },
  { href: "#work-with-me", label: "WORK WITH ME" },
];

const SiteNav = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-5">
        <a href="#" className="font-serif text-xl tracking-[-0.01em]">
          Kharabunga Studios
        </a>
        <div className="hidden md:flex items-center gap-10">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-nav uppercase tracking-[0.06em] text-foreground hover:text-accent"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden text-foreground"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden bg-background border-b border-border py-8">
          <div className="container flex flex-col gap-6">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-nav uppercase tracking-[0.06em] text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default SiteNav;
