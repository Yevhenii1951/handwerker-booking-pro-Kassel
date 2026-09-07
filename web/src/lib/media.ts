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
    G("electrician-in-hard-hat-standing-by-open-electrical-panel"),
    G("electrician-repairing-circuit-breaker-panel-with-screwdriver"),
    G("electrician-tools-and-multimeter-on-wooden-workbench"),
    G("professional-electrician-tools-and-wiring-equipment-flat-lay"),
  ],
  "Klempner / Installateur (Sanitär, Heizung)": [
    G("close-up-of-chrome-faucet-with-plumbing-tools-on-white-sink"),
    G("organized-copper-and-plastic-plumbing-pipes-on-concrete-wall"),
    G("plumbing-tools-and-wrenches-on-tiled-floor"),
    G("close-up-of-danfoss-radiator-thermostat-valve-setting"),
  ],
  "Maler / Lackierer": [
    G("painter-applying-gray-paint-to-interior-wall-with-roller"),
    G("hand-painting-white-door-with-small-roller"),
    G("painting-tools-and-supplies-on-plastic-drop-cloth"),
    G("white-paint-can-and-brushes-on-newspaper-background"),
  ],
  "Tischler / Schreiner": [
    G("carpenter-measuring-wood-with-calipers-in-workshop"),
    G("carpenter-planing-wood-with-hand-plane-in-workshop"),
    G("vintage-woodworking-tools-on-wooden-chest-against-brick-wall"),
    G("woodworking-tools-on-wooden-workbench-with-sawdust"),
  ],
  Dachdecker: [
    G("roofer-climbing-ladder-on-red-tiled-roof"),
    G("two-construction-workers-in-safety-gear-on-a-building-roof"),
  ],
  Fliesenleger: [
    G("close-up-of-worker-using-angle-grinder-to-cut-floor-tile"),
    G("construction-worker-installing-ceramic-floor-tiles-in-renovation"),
  ],
  Maurer: [
    G("construction-worker-laying-bricks-against-blue-sky"),
    G("construction-worker-laying-bricks-outdoors-in-sunny-field"),
  ],
  Zimmermann: [
    G("construction-worker-laying-bricks-outdoors-in-sunny-field"),
    G("carpenter-planing-wood-with-hand-plane-in-workshop"),
    G("carpenter-measuring-wood-with-calipers-in-workshop"),
  ],
  "Garten- und Landschaftsbau": [
    G("gray-granite-stepping-stones-pathway-set-in-natural-river-pebbles"),
  ],
  "Fenster und Türen": [
    G("two-workers-carrying-large-glass-window-panels-from-truck"),
  ],
  "Bodenbelag / Parkett": [
    G("carpenter-measuring-laminate-flooring-with-pencil-and-hammer_Parket"),
  ],
  "Heizung und Klima": [
    G("row-of-white-fujitsu-air-conditioning-units-on-concrete-wall"),
    G("close-up-of-danfoss-radiator-thermostat-valve-setting"),
    G("close-up-of-white-radiator-thermostat-control-knob"),
  ],
}

export function tradeGallery(trade: string | null): string[] {
  if (!trade) return []
  return TRADE_GALLERY[trade] ?? []
}

export function tradeImage(trade: string | null): string | null {
  if (!trade) return null
  return TRADE_IMAGES[trade] ?? null
}