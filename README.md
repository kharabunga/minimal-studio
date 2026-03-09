[README.md](https://github.com/user-attachments/files/25835169/README.md)
# Kharabunga Studios — Rewritten Source Files

Drop these files into your existing minimal-studio repo, replacing the originals.

## File Map

```
src/
├── App.tsx                          ← replaces src/App.tsx
├── components/
│   ├── SiteNav.tsx                  ← replaces src/components/SiteNav.tsx
│   ├── PageLayout.tsx               ← replaces src/components/PageLayout.tsx
│   ├── ImageCarousel.tsx            ← replaces src/components/ImageCarousel.tsx
│   └── FullscreenModal.tsx          ← replaces src/components/FullscreenModal.tsx
└── pages/
    ├── Landing.tsx                  ← replaces src/pages/Landing.tsx
    ├── Work.tsx                     ← replaces src/pages/Work.tsx
    ├── Process.tsx                  ← replaces src/pages/Process.tsx
    ├── Observations.tsx             ← replaces src/pages/Observations.tsx
    ├── About.tsx                    ← replaces src/pages/About.tsx
    ├── WorkWithMe.tsx               ← replaces src/pages/WorkWithMe.tsx
    └── NotFound.tsx                 ← replaces src/pages/NotFound.tsx
```

## Files you can DELETE
- `src/pages/Index.tsx` — unused Lovable fallback
- `src/components/NavLink.tsx` — unused wrapper

## Adding images later
Every image placeholder shows its filename (e.g. "physical_star_cabinet.jpg").
When you're ready to add real images:
1. Put them in `public/images/` (or wherever you prefer)
2. In each page file, update the `img()` helper's `src` from `""` to the path, e.g. `"/images/physical_star_cabinet.jpg"`

## Adding videos later
Video placeholders in WorkWithMe.tsx show filenames.
Replace the placeholder divs with `<video>` elements:
```jsx
<video autoPlay muted loop playsInline className="w-full">
  <source src="/videos/magic_serious_about_the_work.mp4" type="video/mp4" />
</video>
```
