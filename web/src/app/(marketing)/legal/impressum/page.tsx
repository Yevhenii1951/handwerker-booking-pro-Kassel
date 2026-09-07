import Link from "next/link"
import type { Metadata } from "next"
import { isLang } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Impressum — HandwerkerPro",
}

type Props = { searchParams: Promise<{ lang?: string }> }

export default async function ImpressumPage({ searchParams }: Props) {
  const { lang } = await searchParams
  const en = isLang(lang) && lang === "en"

  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
      <div className="border border-[#daddb8] bg-[#ecebe4] px-6 py-10 sm:px-12 sm:py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            {en ? "Imprint" : "Impressum"}
          </h1>
          <Link
            href={en ? "/legal/impressum" : "/legal/impressum?lang=en"}
            className="rounded-md border border-[#daddb8] bg-[#fafaff] px-3 py-1 text-xs font-semibold text-foreground hover:bg-white"
          >
            {en ? "Deutsch" : "English"}
          </Link>
        </div>
        <p className="mt-2 text-xs tracking-wide text-[#b6b8b1]">
          {en ? "Information in accordance with § 5 TMG" : "Angaben gemäß § 5 TMG"}
        </p>

        <section className="mt-8 space-y-5 border-t border-[#daddb8] pt-6 text-sm leading-7 text-[#4a4c47]">
          <div>
            <p className="font-bold text-foreground">
              {en ? "Operator" : "Betreiber"}
            </p>
            <p className="mt-1">
              [Mustername]<br />
              [Musterstraße 1]<br />
              34117 Kassel<br />
              Deutschland
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              {en ? "Contact" : "Kontakt"}
            </p>
            <p className="mt-1">
              {en ? "Phone: " : "Telefon: "}+49 0000 000000<br />
              E-Mail: [kontakt@example.de]
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              {en ? "VAT ID" : "Umsatzsteuer-ID"}
            </p>
            <p className="mt-1">
              {en
                ? "VAT identification number pursuant to § 27a UStG: [DE 000 000 000]"
                : "Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: [DE 000 000 000]"}
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              {en ? "Responsible for content" : "Verantwortlich für den Inhalt"}
            </p>
            <p className="mt-1">
              {en ? "Pursuant to § 55 para. 2 RStV — " : "§ 55 Abs. 2 RStV — "}
              [Vorname Nachname], [Musterstraße 1], 34117 Kassel
            </p>
          </div>
          <div>
            <p className="font-bold text-foreground">
              {en ? "Liability for content & links" : "Haftung für Inhalte & Links"}
            </p>
            <p className="mt-1">
              {en
                ? "As a service provider we are responsible for our own content on these pages pursuant to § 7 (1) TMG. We accept no liability for external content on linked pages."
                : "Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach § 7 Abs. 1 TMG verantwortlich. Für fremde Inhalte auf verlinkten Seiten übernehmen wir keine Gewähr."}
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}