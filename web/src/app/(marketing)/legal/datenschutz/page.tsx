import Link from "next/link"
import type { Metadata } from "next"
import { isLang } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Datenschutzerklärung — HandwerkerPro",
}

type Props = { searchParams: Promise<{ lang?: string }> }

export default async function DatenschutzPage({ searchParams }: Props) {
  const { lang } = await searchParams
  const en = isLang(lang) && lang === "en"

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="animate-in rounded-2xl border border-border bg-card px-6 py-10 fade-in duration-500 ease-out motion-reduce:animate-none sm:px-12 sm:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {en ? "Privacy Policy" : "Datenschutzerklärung"}
          </h1>
          <Link
            href={en ? "/legal/datenschutz" : "/legal/datenschutz?lang=en"}
            className="rounded-lg border border-border bg-background px-3 py-1 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {en ? "Deutsch" : "English"}
          </Link>
        </div>
        <p className="mt-2 text-xs tracking-wide text-muted-foreground">
          {en ? "pursuant to the GDPR" : "gemäß DSGVO"}
        </p>

        {en ? (
          <section className="mt-8 space-y-5 border-t border-border pt-6 text-sm leading-7 text-muted-foreground">
            <div>
              <p className="font-bold text-foreground">1. Controller</p>
              <p className="mt-1">
                [Business name], [Street 1], 34117 Kassel, Germany.
                Contact: [contact@example.de]
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground">
                2. Collection and storage of personal data
              </p>
              <p className="mt-1">
                When you visit the website we collect technical access data (IP address,
                browser type, time of access) and, for bookings, the information you
                provide (name, contact details, appointment data). Processing is based on
                Art. 6 (1) lit. b and f GDPR.
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground">3. Disclosure to third parties</p>
              <p className="mt-1">
                Appointment and profile data are passed on exclusively to the respective
                trades business for the purpose of mediating the booking. No further
                disclosure takes place without your consent.
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground">4. Your rights</p>
              <p className="mt-1">
                You have the right to request access, rectification, erasure, restriction
                of processing, data portability and to object (Art. 15–21 GDPR). Contact
                the controller named above. You also have the right to lodge a complaint
                with the competent supervisory authority.
              </p>
            </div>
            <div>
              <p className="font-bold text-foreground">5. Retention period</p>
              <p className="mt-1">
                Personal data is deleted or anonymised as soon as the purpose of storage
                no longer applies, at the latest after the applicable statutory retention
                periods.
              </p>
            </div>
          </section>
        ) : (
          <section className="mt-8 space-y-5 border-t border-border pt-6 text-sm leading-7 text-muted-foreground">
            <div>
              <p className="font-bold text-foreground">1. Verantwortliche Stelle</p>
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
              <p className="font-bold text-foreground">3. Weitergabe an Dritte</p>
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
        )}
      </div>
    </div>
  )
}