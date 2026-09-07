export type Lang = "de" | "en"

export const LANGS: Lang[] = ["de", "en"]

export const dict = {
  de: {
    langName: "Deutsch",
    layout: {
      login: "Anmelden",
      register: "Als Handwerker registrieren",
      myArea: "Mein Bereich",
      footerTagline: "Handwerker vermitteln in Kassel & Göttingen, 50 km Umkreis.",
      impressum: "Impressum",
      datenschutz: "Datenschutz",
    },
    search: {
      placeholder: "Alle Gewerke",
      submit: "Handwerker finden",
      label: "Gewerk auswählen",
    },
    landing: {
      badge: "Kassel und Göttingen, 50 km Umkreis",
      title: "Der richtige Handwerker. Sofort buchbar.",
      subtitle:
        "Geprüfte Betriebe mit Preisen, Arbeitszeiten und freien Terminen — statt acht Nummern abzutelefonieren.",
      catsTitle: "Was brauchen Sie?",
      catsSubtitle:
        "Wählen Sie ein Gewerk und sehen Sie sofort passende Betriebe aus Ihrer Region.",
      allTrades: "Alle Gewerke",
      stepsTitle: "Buchung ohne Warteschleife",
      stepsSubtitle: "Vom Suchen bis zur Terminbestätigung in drei Schritten.",
      step1Title: "Betrieb finden",
      step1Text:
        "Nach Gewerk und Ort filtern, Preise vergleichen und das Profil mit Arbeitszeiten ansehen.",
      step2Title: "Termin wählen",
      step2Text:
        "Freie Slots sind online sichtbar, eine Leistung pro Wunsch festgelegt.",
      step3Title: "Buchung bestätigt",
      step3Text:
        "Der Betrieb bestätigt die Anfrage. Kein Warteschleifen, kein Telefon.",
      recentTitle: "Neueste Betriebe",
      recentSubtitle: "Frisch registrierte Handwerksbetriebe aus Ihrer Region.",
      ctaTitle: "Sie sind ein Handwerksbetrieb?",
      ctaText:
        "Öffnen Sie Ihr Profil, legen Sie Leistungen fest und lassen Sie Kunden online Termine bei Ihnen buchen.",
      ctaButton: "Jetzt registrieren",
      empty: "Noch keine Betriebe registriert.",
    },
    catalog: {
      title: "Handwerker in Ihrer Nähe",
      inGewerk: (gewerk: string) =>
        `Betriebe mit dem Gewerk "${gewerk}" in Kassel, Göttingen und 50 km Umkreis.`,
      all: "Alle aktiven Betriebe in Kassel, Göttingen und 50 km Umkreis.",
      alle: "Alle",
      count: (n: number) => `${n} ${n === 1 ? "Betrieb" : "Betriebe"} gefunden`,
    },
  },
  en: {
    langName: "English",
    layout: {
      login: "Log in",
      register: "Register as craftsman",
      myArea: "My account",
      footerTagline: "Local tradespeople in Kassel & Göttingen, 50 km radius.",
      impressum: "Imprint",
      datenschutz: "Privacy",
    },
    search: {
      placeholder: "All trades",
      submit: "Find a tradesperson",
      label: "Select a trade",
    },
    landing: {
      badge: "Kassel and Göttingen, 50 km radius",
      title: "The right tradesperson. Booked in minutes.",
      subtitle:
        "Verified businesses with prices, working hours and open slots — no more phone tag.",
      catsTitle: "What do you need?",
      catsSubtitle:
        "Pick a trade and instantly see matching businesses in your area.",
      allTrades: "All trades",
      stepsTitle: "Booking without hold music",
      stepsSubtitle: "From search to confirmation in three steps.",
      step1Title: "Find a business",
      step1Text:
        "Filter by trade and location, compare prices and browse profiles with working hours.",
      step2Title: "Pick a slot",
      step2Text:
        "Open slots are visible online, choose one service per request.",
      step3Title: "Booking confirmed",
      step3Text:
        "The business confirms your request. No phone queues.",
      recentTitle: "Newest businesses",
      recentSubtitle: "Recently registered tradespeople in your region.",
      ctaTitle: "Are you a tradesperson?",
      ctaText:
        "Set up your profile, list your services and let customers book online.",
      ctaButton: "Register now",
      empty: "No businesses registered yet.",
    },
    catalog: {
      title: "Tradespeople near you",
      inGewerk: (gewerk: string) =>
        `Businesses for "${gewerk}" in Kassel, Göttingen and a 50 km radius.`,
      all: "All active businesses in Kassel, Göttingen and a 50 km radius.",
      alle: "All",
      count: (n: number) => `${n} ${n === 1 ? "business" : "businesses"} found`,
    },
  },
} as const

export type Dict = (typeof dict)[Lang]

export function isLang(value: string | undefined): value is Lang {
  return value === "de" || value === "en"
}