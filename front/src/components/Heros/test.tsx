"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image, { StaticImageData } from "next/image";
import Link from "next/link";

// Images (4:3)
import lvbdeLg from "@/public/Images/carrousel/lvde43.jpg";
import CerisaieLg from "@/public/Images/carrousel/traiteur43.jpg";
import MinaoLg from "@/public/Images/carrousel/minao43.jpg";
import CorseLg from "@/public/Images/carrousel/corse43.jpg";
import EcommerceLg from "@/public/Images/carrousel/ecommerce43.jpg";

type Project = {
  title: string;
  description: string;
  label: string;
  image: StaticImageData;
  alt: string;
};

const baseProjects: Project[] = [
  {
    title: "Le Traiteur",
    alt: "interface qui permet de rentrer dans l'application web",
    description: "Plateforme de gestion d’événements – Java / Angular / MySQL",
    label: "Application web",
    image: CerisaieLg,
  },
  {
    title: "Minao Asian Food",
    alt: "section des menus qui permet de choisir son plat",
    description:
      "Restaurant avec commandes en ligne & paiement Stripe – Next.js",
    label: "E-commerce",
    image: MinaoLg,
  },
  {
    title: "Corsica-Corse",
    alt: "page d'accueil avec une video de la Corse",
    description: " WordPress / Elementor / SEO local",
    label: "Site vitrine",
    image: CorseLg,
  },
  {
    title: "Boutique du bien-être",
    alt: "Menu général des produits bien-être qui sont a vendre",
    description: "Vente de produit en ligne – Next.js / API",
    label: "E-commerce",
    image: EcommerceLg,
  },
  {
    title: "La voie du bien-être",
    alt: "Hero d'un site de massages",
    description: "Site internet d'un salon de massage – Next.js / API",
    label: "Site internet",
    image: lvbdeLg,
  },
];

const CLONES = 2; // 2 => 2e existe aussi en 7e, 3e en 8e, etc.
const EASE = (t: number) => 0.5 - 0.5 * Math.cos(Math.PI * t); // easeInOutSine = ultra doux

export default function Carrousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [iReal, setIReal] = useState(0);
  const [hover, setHover] = useState(false);
  const [animating, setAnimating] = useState(false);

  // items = [clones de fin] + [réels] + [clones de tête]
  const items = useMemo(() => {
    const n = baseProjects.length;
    const tail = baseProjects.slice(n - CLONES);
    const head = baseProjects.slice(0, CLONES);
    return [...tail, ...baseProjects, ...head];
  }, []);

  // Helper: slides visibles (dans l’ordre)
  const getSlides = () =>
    Array.from(
      trackRef.current?.querySelectorAll<HTMLElement>("[data-item]") ?? []
    );

  // Init: 1ère VRAIE collée à gauche (on saute les clones de tête)
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const slides = getSlides();
    const firstReal = slides[CLONES]; // index visuel de la 1ère réelle
    if (firstReal) el.scrollLeft = firstReal.offsetLeft;
    // Recalcule si on change de viewport (responsive)
    const ro = new ResizeObserver(() => {
      const s = getSlides();
      const fr = s[CLONES];
      if (fr)
        el.scrollLeft =
          fr.offsetLeft +
          (iReal === 0 ? 0 : s[CLONES + iReal].offsetLeft - fr.offsetLeft);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []); // init

  // Animation douce de scrollLeft → vers offsetLeft du slide visé
  const animateTo = (targetLeft: number, duration = 1400) => {
    const el = trackRef.current;
    if (!el) return;
    const start = el.scrollLeft;
    const delta = targetLeft - start;
    if (Math.abs(delta) < 1) {
      el.scrollLeft = targetLeft;
      return;
    }

    setAnimating(true); // => on mettra snap-none sur le TRACK
    let t0: number | null = null;

    const step = (ts: number) => {
      if (t0 === null) t0 = ts;
      const p = Math.min(1, (ts - t0) / duration);
      el.scrollLeft = start + delta * EASE(p);
      if (p < 1) requestAnimationFrame(step);
      else setAnimating(false); // réactive le snap dans le TRACK
    };
    requestAnimationFrame(step);
  };

  const [activeVisual, setActiveVisual] = useState(0);
  const rafRef = useRef<number | null>(null);

  const handleScroll = () => {
    const el = trackRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const slides = Array.from(
        el.querySelectorAll<HTMLElement>("[data-item]")
      );
      if (!slides.length) return;
      const centerX = el.scrollLeft + el.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      slides.forEach((s, idx) => {
        const mid = s.offsetLeft + s.clientWidth / 2;
        const d = Math.abs(mid - centerX);
        if (d < bestDist) {
          bestDist = d;
          best = idx;
        }
      });
      setActiveVisual(best);
    });
  };

  // Aller à un index réel (0..n-1) avec clones & wrap fluide
  const goToReal = (nextReal: number, duration = 1100) => {
    const el = trackRef.current;
    if (!el) return;
    const slides = getSlides();
    const n = baseProjects.length;
    const real = ((nextReal % n) + n) % n;
    setIReal(real);

    // index visuel correspondant dans [clones fin] + [réels] + [clones début]
    const visualIndex = real + CLONES;
    const targetSlide = slides[visualIndex];
    if (!targetSlide) return;

    animateTo(targetSlide.offsetLeft, duration);

    // Après l’anim, si on est tombé dans une zone clone, warp instantanément vers le vrai jumeau
    window.setTimeout(() => {
      const s = getSlides();
      if (!s.length) return;
      // Si on dépasse à gauche (rare via flèche -1 en boucle)
      if (visualIndex < CLONES) {
        const twin = s[visualIndex + n]; // même carte côté "réel"
        if (twin) el.scrollLeft = twin.offsetLeft;
      }
      // Si on dépasse à droite (5 -> +1 => clone du 1)
      if (visualIndex >= CLONES + n) {
        const twin = s[visualIndex - n];
        if (twin) el.scrollLeft = twin.offsetLeft;
      }
    }, duration + 20);
  };

  // Auto-play soyeux
  // Auto-play soyeux
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) return;
    const id = window.setInterval(() => {
      if (!hover && !animating) goToReal(iReal + 1, 1400); // ⟵ durée plus longue
    }, 6500); // ⟵ intervalle plus long
    return () => window.clearInterval(id);
  }, [iReal, hover, animating]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") goToReal(iReal + 1);
    if (e.key === "ArrowLeft") goToReal(iReal - 1);
  };

  return (
    <section id="work" className="bg-transparent py-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-white">
              Projets & Réalisations
            </h2>
            <p className="text-white/70">
              Quelques cas clients et démos sélectionnés.
            </p>
          </div>
          <Link
            href="/portfolio"
            className="hidden sm:inline-block rounded-full bg-indigo-500 px-6 py-2.5 text-white shadow hover:bg-indigo-400 transition-colors"
          >
            Voir tous les projets
          </Link>
        </header>

        <div
          className="relative"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {/* dégradés latéraux */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-[#0b1020] to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[#0b1020] to-transparent" />

          {/* TRACK — gap responsive & width 100% */}

          <div
            ref={trackRef}
            onScroll={handleScroll}
            tabIndex={0}
            onKeyDown={onKey}
            aria-roledescription="carousel"
            aria-label="Projets"
            className={`flex overflow-x-auto focus:outline-none
            gap-3 sm:gap-8
            px-0
            py-2
            ${animating ? "snap-none" : "snap-x snap-proximity"}`}
            style={{
              scrollbarWidth: "none",
              touchAction: "pan-x",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "auto", // pas de smooth CSS, on gère en JS
            }}
          >
            {items.map((p, visualIdx) => (
              <article
                key={`${p.title}-${visualIdx}`}
                data-item
                className={[
                  "group relative shrink-0 overflow-hidden rounded-2xl snap-start",
                  "ring-1 ring-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)]",
                  // transition douce entre états
                  "transition-[transform,box-shadow,opacity] duration-[700ms] ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform transform-gpu",
                  // largeur responsive (tes bases 1/2/3)
                  "basis-full sm:basis-[calc((100%-32px)/2)] lg:basis-[calc((100%-64px)/3)]",
                  // ✅ focus doux : carte active = scale-100 + shadow; sinon légère réduction + atténuation
                  activeVisual === visualIdx
                    ? "scale-100 opacity-100 shadow-[0_10px_36px_rgba(0,0,0,0.18)]"
                    : "scale-[0.985] opacity-[0.96]",
                ].join(" ")}
              >
                <div className="relative w-full aspect-[4/3]">
                  <Image
                    src={p.image}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.012] will-change-transform"
                    placeholder="blur"
                    priority={visualIdx === CLONES || visualIdx === CLONES + 1}
                  />
                </div>

                <div className="bg-white/95 px-4 sm:px-5 py-4 border-t border-black/5 text-black/80">
                  <span className="text-[11px] font-semibold tracking-wide text-indigo-600/90">
                    {p.label}
                  </span>
                  <h3 className="mt-1 text-lg sm:text-xl font-semibold text-black/85">
                    {p.title}
                  </h3>
                  <p className="mt-1 text-sm">{p.description}</p>
                </div>
              </article>
            ))}
          </div>

          {/* Flèches */}
          <button
            aria-label="Slide précédent"
            onClick={() => goToReal(iReal - 1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow transition-[background,transform] duration-300 hover:bg-white/20 hover:scale-[1.03]"
          >
            ←
          </button>
          <button
            aria-label="Slide suivant"
            onClick={() => goToReal(iReal + 1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-md shadow transition-[background,transform] duration-300 hover:bg-white/20 hover:scale-[1.03]"
          >
            →
          </button>

          {/* Bullets (index logique réel) */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2" />
            <div
              className="flex items-center gap-2"
              role="tablist"
              aria-label="Sélecteur de slide"
            >
              {baseProjects.map((_, k) => (
                <button
                  key={k}
                  role="tab"
                  aria-selected={iReal === k}
                  aria-label={`Aller au slide ${k + 1}`}
                  onClick={() => goToReal(k)}
                  className={[
                    "h-2.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
                    iReal === k
                      ? "w-6 bg-indigo-400"
                      : "w-2.5 bg-white/30 hover:bg-white/45",
                  ].join(" ")}
                />
              ))}
            </div>
          </div>

          {/* CTA mobile */}
          <div className="mt-8 text-center sm:hidden">
            <Link
              href="/portfolio"
              className="inline-block rounded-full bg-indigo-500 px-6 py-2.5 text-white shadow hover:bg-indigo-400 transition-colors"
            >
              Voir tous les projets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
