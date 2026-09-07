import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum — HandwerkerPro",
}

export default function ImpressumPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="border border-[#daddb8] bg-[#ecebe4] px-6 py-10 sm:px-12 sm:py-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
          Impressum
        </h1>
        <p className="mt-2 text-xs tracking-wide text-[#b6b8b1]">
          Angaben gemäß § 5 TMG
        </p>

        <section className="mt-8 space-y-5 border-t border-[#daddb8] pt-6 text-sm leading-7 text-[#4a4c47]">
          <div>
            <p className="font-bold text-foreground">Betreiber</p>
            <p className="mt-1">
              [Mustername]<br />
              [Musterstraße 1]<br />
              34117 Kassel<br />
              Deutschland
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">Kontakt</p>
            <p className="mt-1">
              Telefon: +49 0000 000000<br />
              E-Mail: [kontakt@example.de]
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">Umsatzsteuer-ID</p>
            <p className="mt-1">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz:
              [DE 000 000 000]
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              Verantwortlich für den Inhalt
            </p>
            <p className="mt-1">
              § 55 Abs. 2 RStV — [Vorname Nachname], [Musterstraße 1], 34117
              Kassel
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              Haftung für Inhalte & Links
            </p>
            <p className="mt-1">
              Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten
              nach § 7 Abs. 1 TMG verantwortlich. Für fremde Inhalte auf
              verlinkten Seiten übernehmen wir keine Gewähr.
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}