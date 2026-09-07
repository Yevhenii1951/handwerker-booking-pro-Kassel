export const TRADES = [
  "Elektriker",
  "Klempner / Installateur (Sanitär, Heizung)",
  "Maler / Lackierer",
  "Tischler / Schreiner",
  "Dachdecker",
  "Fliesenleger",
  "Maurer",
  "Zimmermann",
  "Garten- und Landschaftsbau",
  "Fenster und Türen",
  "Bodenbelag / Parkett",
  "Heizung und Klima",
  "Sonstiges",
] as const

export type Trade = (typeof TRADES)[number]