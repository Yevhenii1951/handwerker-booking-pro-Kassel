import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Datenschutzerklärung — HandwerkerPro",
}

export default function DatenschutzPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Datenschutzerklärung
      </h1>

      <section className="mt-8 space-y-6 text-sm leading-7 text-foreground/80">
        <div>
          <p className="font-bold text-foreground">
            1. Verantwortliche Stelle
          </p>
          <p className="mt-1">
            [Mustername], [Musterstraße 1], 34117 Kassel, Deutschland.
            Kontakt: [kontakt@example.de]
          </p>
        </div>
        <div>
          <p className="font-bold text-foreground">
            2. Erhebung und Speicherung personenbezogener Daten
          </p>
          <p className="mt-1">
            Beim Besuch der Website erheben wir technische Zugriffsdaten
            (IP-Adresse, Browsertyp, Zeitpunkt des Zugriffs) sowie, bei
            vorgenommenen Buchungen, die von Ihnen angegebenen Daten
            (Name, Kontaktdaten, Termininformationen). Die Verarbeitung
            erfolgt auf Grundlage von Art. 6 Abs. 1 lit. b und f DSGVO.
          </p>
        </div>
        <div>
          <p className="font-bold text-foreground">
            3. Weitergabe an Dritte
          </p>
          <p className="mt-1">
            Termin- und Profildaten werden ausschließlich zur Vermittlung an
            den jeweiligen Handwerksbetrieb weitergegeben. Eine darüber
            hinausgehende Weitergabe erfolgt nicht ohne Ihre Einwilligung.
          </p>
        </div>
        <div>
          <p className="font-bold text-foreground">4. Ihre Rechte</p>
          <p className="mt-1">
            Sie haben das Recht auf Auskunft, Berichtigung, Löschung,
            Einschränkung der Verarbeitung, Datenübertragbarkeit und
            Widerspruch (Art. 15–21 DSGVO). Wenden Sie sich dazu an die oben
            genannte Stelle. Zudem besteht ein Beschwerderecht bei der
            zuständigen Datenschutz-Aufsichtsbehörde.
          </p>
        </div>
        <div>
          <p className="font-bold text-foreground">5. Speicherdauer</p>
          <p className="mt-1">
            Personenbezogene Daten werden gelöscht oder anonymisiert, sobald
            der Zweck der Speicherung entfällt, spätestens nach den geltenden
            gesetzlichen Aufbewahrungsfristen.
          </p>
        </div>
      </section>
    </div>
  )
}