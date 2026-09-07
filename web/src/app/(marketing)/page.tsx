import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
import { TRADE_IMAGES, HERO_POSTER, HERO_VIDEO } from "@/lib/media"
import { SearchBar } from "./components/search-bar"

async function getActiveMasters() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, trade, city, plz")
    .eq("role", "master")
    .eq("master_status", "active")
    .not("trade", "is", null)
    .order("created_at", { ascending: false })
    .limit(3)

  return data ?? []
}

export default async function Home() {
  const masters = await getActiveMasters()

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-[#1c1c1c] text-[#eef0f2]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          className="absolute inset-0 h-full w-full object-cover opacity-40"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c]/70 via-[#1c1c1c]/40 to-[#1c1c1c]" />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-[#dadde8]">
            <span className="h-2.5 w-2.5 bg-accent" aria-hidden="true" />
            Kassel und Göttingen, 50 km Umkreis
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.05]">
            Der richtige Handwerker. Sofort buchbar.
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#dadde8]">
            Geprüfte Betriebe mit Preisen, Arbeitszeiten und freien Terminen —
            statt acht Nummern abzutelefonieren.
          </p>
          <div className="mt-10">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b6d68]">
              Beliebte Gewerke
            </h2>
            <Link
              href="/handwerker"
              className="border-b border-[#6b6d68] pb-0.5 text-sm font-semibold text-foreground hover:border-foreground"
            >
              Alle ansehen
            </Link>
          </div>
          <ul className="mt-8 grid grid-cols-2 gap-px bg-[#dadde8] sm:grid-cols-4">
            {TRADES.slice(0, 8).map((trade) => {
              const image = TRADE_IMAGES[trade]
              return (
                <li key={trade} className="bg-[#ecebe4]">
                  <Link
                    href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
                    className="group flex h-full flex-col justify-between"
                  >
                    {image && (
                      <div className="relative aspect-[16/10] overflow-hidden">
                        <Image
                          src={image}
                          alt={trade}
                          fill
                          sizes="(max-width: 640px) 50vw, 25vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-[#1c1c1c]/10" />
                      </div>
                    )}
                    <span className="flex flex-1 items-end justify-between gap-4 px-5 py-4">
                      <span className="text-sm font-semibold leading-snug text-foreground">
                        {trade}
                      </span>
                      <span className="text-xs font-semibold text-accent">
                        Termin buchen
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="border-t border-[#dadde8] bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b6d68]">
            So funktioniert es
          </h2>
          <ol className="mt-8 grid gap-x-12 gap-y-10 sm:grid-cols-3">
            <li className="border-t-2 border-foreground pt-5">
              <span className="text-2xl font-extrabold text-accent">01</span>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                Betrieb finden
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Nach Gewerk und Ort filtern, Preise vergleichen, Profil mit
                Arbeitszeiten ansehen.
              </p>
            </li>
            <li className="border-t-2 border-foreground pt-5">
              <span className="text-2xl font-extrabold text-accent">02</span>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                Termin wählen
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Freie Slots sind online sichtbar, eine Leistung pro Wunsch
                festgelegt.
              </p>
            </li>
            <li className="border-t-2 border-foreground pt-5">
              <span className="text-2xl font-extrabold text-accent">03</span>
              <h3 className="mt-2 text-lg font-bold text-foreground">
                Buchung bestätigt
              </h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Der Betrieb bestätigt die Anfrage. Kein Warteschleifen, kein
                Telefon.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="border-t border-[#dadde8] bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <div className="flex items-baseline justify-between">
            <h2 className="text-xs font-bold uppercase tracking-[0.14em] text-[#6b6d68]">
              Neueste Betriebe
            </h2>
          </div>
          {masters.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">
              Noch keine Betriebe registriert.
            </p>
          ) : (
            <ul className="mt-8 divide-y divide-[#b6b8b1]">
              {masters.map((m) => (
                <li key={m.id}>
                  <Link
                    href={`/handwerker/${m.id}`}
                    className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span className="font-bold text-foreground group-hover:text-accent">
                      {m.full_name ?? "Handwerksbetrieb"}
                    </span>
                    <span className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground/70">
                        {m.trade}
                      </span>
                      <span>
                        {m.plz} {m.city}
                      </span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#1c1c1c] text-[#eef0f2]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Sie sind ein Handwerksbetrieb?
            </h2>
            <p className="mt-3 max-w-lg text-[#dadde8]">
              Öffnen Sie Ihr Profil, legen Sie Leistungen fest und lassen Sie
              Kunden online Termine bei Ihnen buchen.
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex h-12 shrink-0 items-center bg-accent px-8 text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Jetzt registrieren
          </Link>
        </div>
      </section>
    </div>
  )
}