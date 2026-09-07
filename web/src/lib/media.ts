export const TRADE_IMAGES: Record<string, string> = {
  Elektriker: "/images/categories/Elektriker.webp",
  "Klempner / Installateur (Sanitär, Heizung)":
    "/images/categories/heitzung3.webp",
  "Maler / Lackierer": "/images/categories/Maler.webp",
  "Tischler / Schreiner": "/images/categories/Tischler1.webp",
  Dachdecker: "/images/categories/Dachdecker.webp",
  Fliesenleger: "/images/categories/Fliesenleger.webp",
  Maurer: "/images/categories/mauer.webp",
  Zimmermann: "/images/categories/Tischler2.webp",
  "Garten- und Landschaftsbau": "/images/categories/Gärtner_.webp",
  "Fenster und Türen": "/images/categories/Fensterbauer.webp",
  "Bodenbelag / Parkett": "/images/categories/Parkettleger.webp",
  "Heizung und Klima": "/images/categories/Heizungstechniker1.webp",
}

export const HERO_POSTER = "/images/hero.webp"
export const HERO_VIDEO = "/videos/hero-bg.mp4"

export function tradeImage(trade: string | null): string | null {
  if (!trade) return null
  return TRADE_IMAGES[trade] ?? null
}