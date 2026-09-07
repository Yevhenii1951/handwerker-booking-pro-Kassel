import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impressum — HandwerkerPro",
}

export default function ImpressumPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Impressum
      </h1>

      <section className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <p className="text-xs text-muted-foreground">
          Angaben gemäß § 5 TMG
        </p>
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
          <p className="font-bold text-foreground">Verantwortlich für den Inhalt</p>
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
  )
}