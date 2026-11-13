import { useCallback, useEffect, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryPhoto } from "@/data/about";

/**
 * Responsive photo grid with a lightbox. Each tile is a button; the lightbox
 * is a Radix dialog (focus trap, Esc to close), with ←/→ to move between
 * photos. On close, focus returns to the tile of the photo last shown.
 */
const PhotoGallery = ({ photos }: { photos: GalleryPhoto[] }) => {
  const [index, setIndex] = useState<number | null>(null);
  const tiles = useRef<(HTMLButtonElement | null)[]>([]);
  const lastIndex = useRef<number | null>(null);
  const open = index !== null;

  useEffect(() => {
    if (index !== null) lastIndex.current = index;
  }, [index]);
  const photo = open ? photos[index] : null;

  const step = useCallback(
    (delta: number) => setIndex((i) => (i === null ? i : (i + delta + photos.length) % photos.length)),
    [photos.length],
  );

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {photos.map((p, i) => (
          <li key={p.src} data-reveal data-reveal-delay={(i % 3) * 70}>
            <button
              ref={(el) => (tiles.current[i] = el)}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Open photo: ${p.caption}`}
              className="group relative block aspect-[4/5] w-full overflow-hidden rounded-2xl border border-border bg-muted text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <img
                src={p.src}
                alt={p.alt}
                width={p.width}
                height={p.height}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
              {/* Overlay caption from sm up; on phones it would cover the photo, so it sits below instead. */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 hidden bg-gradient-to-t from-black/80 via-black/45 to-transparent px-4 pb-4 pt-12 text-white sm:block"
              >
                <span className="line-clamp-3 block text-[0.95rem] font-medium leading-snug">{p.caption}</span>
                {p.date && <span className="mt-1 block text-xs text-white/75">{p.date}</span>}
              </span>
            </button>
            <p aria-hidden="true" className="mt-2 px-0.5 sm:hidden">
              <span className="line-clamp-2 block text-sm font-medium leading-snug">{p.caption}</span>
              {p.date && <span className="mt-0.5 block text-xs text-subtle">{p.date}</span>}
            </p>
          </li>
        ))}
      </ul>

      <DialogPrimitive.Root open={open} onOpenChange={(o) => !o && setIndex(null)}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/90 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content
            aria-describedby={undefined}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") {
                e.preventDefault();
                step(1);
              } else if (e.key === "ArrowLeft") {
                e.preventDefault();
                step(-1);
              }
            }}
            onCloseAutoFocus={(e) => {
              // Return focus to the photo last shown, not the one first clicked.
              const last = lastIndex.current;
              if (last !== null && tiles.current[last]) {
                e.preventDefault();
                tiles.current[last]?.focus();
              }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 p-4 outline-none sm:p-8"
          >
            {photo && index !== null && (
              <>
                <DialogPrimitive.Title className="sr-only">
                  Photo {index + 1} of {photos.length}: {photo.caption}
                </DialogPrimitive.Title>
                <img
                  key={photo.src}
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="max-h-[78vh] w-auto max-w-full rounded-xl object-contain shadow-2xl animate-in fade-in-0 duration-200"
                />
                <div className="max-w-2xl text-center text-white">
                  <p className="text-base font-medium leading-snug sm:text-lg">{photo.caption}</p>
                  <p className="mt-1 text-sm text-white/70">
                    {photo.date ? `${photo.date} · ` : ""}
                    {index + 1} / {photos.length}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:left-6 sm:p-3"
                >
                  <ChevronLeft aria-hidden="true" className="h-6 w-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:p-3"
                >
                  <ChevronRight aria-hidden="true" className="h-6 w-6" />
                </button>
                <DialogPrimitive.Close
                  aria-label="Close photo"
                  className="absolute right-3 top-3 rounded-full bg-white/10 p-2.5 text-white backdrop-blur transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white sm:right-6 sm:top-6"
                >
                  <X aria-hidden="true" className="h-5 w-5" />
                </DialogPrimitive.Close>
              </>
            )}
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </>
  );
};

export default PhotoGallery;
