import { Link, useLocation } from "react-router-dom";
import React, { useState } from "react";

const links = [
  { to: "/work", label: "WORK" },
  { to: "/process", label: "PROCESS" },
  { to: "/observations", label: "OBSERVATIONS" },
  { to: "/about", label: "ABOUT" },
  { to: "/work-with-me", label: "WORK WITH ME" },
];

const SiteNav = () => {
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm">
      <div className="container max-w-5xl flex items-center justify-between py-5 px-6">
        <Link
          to="/"
          className="font-serif text-lg md:text-xl tracking-[-0.01em] text-black"
        >
          Kharabunga Studios
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`text-sm md:text-base font-semibold tracking-[0.08em] uppercase transition-colors hover:text-black ${
                location.pathname === link.to
                  ? "text-black"
                  : "text-neutral-400"
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
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="text-sm font-semibold tracking-[0.08em] uppercase text-neutral-400"
      >
        {open ? "CLOSE" : "MENU"}
      </button>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-neutral-200 py-8">
          <div className="container max-w-5xl flex flex-col gap-5 px-6">
            {links.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setOpen(false)}
                className={`text-base font-semibold tracking-[0.08em] uppercase ${
                  location.pathname === link.to
                    ? "text-black"
                    : "text-neutral-400"
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

export default SiteNav;
