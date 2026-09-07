import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
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
      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:py-28">
          <p className="mb-4 text-sm font-semibold tracking-wide text-muted-foreground">
            Kassel · Göttingen · 50 km Umkreis
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Geprüfte Handwerker. Termin online buchen.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Echte Meisterbetriebe aus Ihrer Region — mit Preisen, Arbeitszeiten
            und freien Terminen auf einen Blick.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Gewerke
          </h2>
          <ul className="mt-4 grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-4">
            {TRADES.slice(0, 8).map((trade) => (
              <li key={trade} className="bg-background">
                <Link
                  href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
                  className="flex h-full items-center justify-between px-4 py-3 text-sm font-medium hover:bg-muted"
                >
                  {trade}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            So funktioniert es
          </h2>
          <ol className="mt-4 grid gap-px border border-border bg-border sm:grid-cols-3">
            <li className="flex flex-col bg-background p-6">
              <span className="text-sm font-semibold text-accent">01</span>
              <h3 className="mt-2 font-bold text-foreground">
                Passenden Handwerker finden
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Nach Gewerk und Region filtern und Profile mit Preisen
                vergleichen.
              </p>
            </li>
            <li className="flex flex-col bg-background p-6">
              <span className="text-sm font-semibold text-accent">02</span>
              <h3 className="mt-2 font-bold text-foreground">
                Freien Termin wählen
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Arbeitszeiten der Betriebe und ihre freien Slots direkt
                einsehen.
              </p>
            </li>
            <li className="flex flex-col bg-background p-6">
              <span className="text-sm font-semibold text-accent">03</span>
              <h3 className="mt-2 font-bold text-foreground">
                Online buchen
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Anfrage senden — der Betrieb bestätigt. Kein Telefonieren, kein
                Warten.
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="border-b border-border">
        <div className="mx-auto w-full max-w-6xl px-4 py-12">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
              Neue Betriebe
            </h2>
            <Link
              href="/handwerker"
              className="text-sm font-semibold text-primary hover:underline"
            >
              Alle ansehen
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-border border-y border-border">
            {masters.length === 0 && (
              <li className="py-8 text-sm text-muted-foreground">
                Noch keine Betriebe registriert.
              </li>
            )}
            {masters.map((m) => (
              <li key={m.id}>
                <Link
                  href={`/handwerker/${m.id}`}
                  className="flex flex-col gap-1 py-4 hover:bg-muted sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="font-semibold text-foreground">
                    {m.full_name ?? "Handwerksbetrieb"}
                  </span>
                  <span className="flex gap-3 text-sm text-muted-foreground">
                    <span>{m.trade}</span>
                    <span>
                      {m.plz} {m.city}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section>
        <div className="mx-auto w-full max-w-6xl px-4 py-16 text-center">
          <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Sie sind Handwerksbetrieb?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-muted-foreground">
            Melden Sie sich kostenlos an, legen Sie Ihre Leistungen fest und
            lassen Sie Kunden online Termine bei Ihnen buchen.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-flex h-11 items-center bg-primary px-6 font-semibold text-primary-foreground hover:bg-primary/80"
          >
            Betrieb registrieren
          </Link>
        </div>
      </section>
    </div>
  )
}