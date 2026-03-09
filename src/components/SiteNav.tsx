import { Link, useLocation } from "react-router-dom";

const links = [
  { to: "/work", label: "Work" },
  { to: "/process", label: "Process" },
  { to: "/observations", label: "Observations" },
  { to: "/about", label: "About" },
  { to: "/work-with-me", label: "Work With Me" },
];

const SiteNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm">
      <div className="container flex items-center justify-between py-6">
        <Link to="/" className="font-serif text-lg tracking-tight">
          Kharabunga Studios
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm tracking-wide transition-colors hover:text-foreground ${
                location.pathname === link.to
                  ? "text-foreground"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>
        <MobileMenu />
      </div>
    </nav>
  );
};

const MobileMenu = () => {
  const [open, setOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm text-muted-foreground"
      >
        {open ? "Close" : "Menu"}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-background border-b border-border py-6">
          <div className="container flex flex-col gap-4">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-sm tracking-wide ${
                  location.pathname === link.to
                    ? "text-foreground"
                    : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

import React from "react";

export default SiteNav;
