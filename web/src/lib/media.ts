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

const G = (name: string) => `/images/gallery/${name}.webp`

export const TRADE_GALLERY: Record<string, string[]> = {
  Elektriker: [
    G("elektriker-1"),
    G("elektriker-2"),
    G("elektriker-3"),
    G("elektriker-4"),
    G("elektriker-5"),
  ],
  "Klempner / Installateur (Sanitär, Heizung)": [
    G("sanitaer-1"),
    G("sanitaer-2"),
    G("heizung-1"),
    G("heizung-2"),
    G("heizung-3"),
  ],
  "Maler / Lackierer": [G("maler-1"), G("maler-2"), G("maler-3")],
  "Tischler / Schreiner": [G("schreiner-1"), G("schreiner-2")],
  Dachdecker: [G("dachdecker-1"), G("dachdecker-2"), G("dachdecker-3")],
  Fliesenleger: [G("fliesen-1"), G("fliesen-2"), G("fliesen-3")],
  Maurer: [G("maurer-1"), G("maurer-2"), G("maurer-3")],
  Zimmermann: [G("schreiner-1"), G("schreiner-2")],
  "Garten- und Landschaftsbau": [G("garten-1"), G("garten-2")],
  "Fenster und Türen": [G("fenster-tuer-1"), G("fenster-tuer-2")],
  "Bodenbelag / Parkett": [G("boden-1"), G("boden-2"), G("boden-3")],
  "Heizung und Klima": [
    G("klima-1"),
    G("klima-2"),
    G("klima-3"),
    G("heizung-1"),
    G("heizung-2"),
    G("heizung-3"),
  ],
}

export function tradeGallery(trade: string | null): string[] {
  if (!trade) return []
  return TRADE_GALLERY[trade] ?? []
}

function hashSeed(value: string): number {
  let hash = 0
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0
  }
  return hash
}

export function tradeCover(trade: string | null, seed = ""): string | null {
  const gallery = tradeGallery(trade)
  if (gallery.length > 1 && seed) {
    return gallery[hashSeed(seed) % gallery.length]
  }
  return gallery[0] ?? tradeImage(trade)
}

export function tradeImage(trade: string | null): string | null {
  if (!trade) return null
  return TRADE_IMAGES[trade] ?? null
}