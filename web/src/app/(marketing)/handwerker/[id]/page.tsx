import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

const WEEKDAYS = [
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
  "Sonntag",
]

async function getMaster(id: string) {
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, trade, city, plz, bio, phone")
    .eq("id", id)
    .eq("role", "master")
    .eq("master_status", "active")
    .single()

  if (!profile) return null

  const [{ data: services }, { data: workingHours }] = await Promise.all([
    supabase
      .from("services")
      .select("id, name, price, duration_minutes")
      .eq("master_id", id),
    supabase
      .from("working_hours")
      .select("day_of_week, start_time, end_time")
      .eq("master_id", id),
  ])

  return { profile, services: services ?? [], workingHours: workingHours ?? [] }
}

export default async function MasterPage(
  {
    params,
  }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params
  const master = await getMaster(id)
  if (!master) notFound()

  const { profile, services, workingHours } = master
  const trade = profile.trade ?? null
  const hourRows = workingHours
    .map((h) => ({
      day: WEEKDAYS[h.day_of_week],
      time: `${h.start_time.slice(0, 5)}–${h.end_time.slice(0, 5)}`,
    }))
    .sort((a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day))

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
      <header className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-semibold tracking-wide text-accent uppercase">
            {trade ?? "Handwerksbetrieb"}
          </p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground">
            {profile.full_name ?? "Handwerksbetrieb"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {profile.plz} {profile.city}
          </p>
          {profile.bio && (
            <p className="mt-3 max-w-xl text-foreground/80">{profile.bio}</p>
          )}
        </div>
        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="shrink-0 border border-border px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted"
          >
            {profile.phone}
          </a>
        )}
      </header>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr,340px]">
        <section>
          <h2 className="text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Leistungen & Preise
          </h2>
          {services.length === 0 ? (
            <p className="mt-4 border border-dashed border-border p-6 text-sm text-muted-foreground">
              Dieses Gewerk hat noch keine Leistungen eingetragen.
            </p>
          ) : (
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {services.map((s) => (
                <li
                  key={s.id}
                  className="flex items-center justify-between gap-4 py-4"
                >
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span className="shrink-0 text-sm text-muted-foreground">
                    {s.duration_minutes} Min. · {formatPrice(s.price)}
                  </span>
                </li>
              ))}
            </ul>
          )}

          <h2 className="mt-10 text-sm font-semibold tracking-wide text-muted-foreground uppercase">
            Öffnungszeiten
          </h2>
          {hourRows.length === 0 ? (
            <p className="mt-4 border border-dashed border-border p-6 text-sm text-muted-foreground">
              Noch keine Arbeitszeiten eingetragen.
            </p>
          ) : (
            <dl className="mt-4 divide-y divide-border border-y border-border">
              {hourRows.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between py-2 text-sm"
                >
                  <dt className="text-muted-foreground">{row.day}</dt>
                  <dd className="font-medium text-foreground tabular-nums">
                    {row.time} Uhr
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </section>

        <aside className="self-start border border-border bg-card p-6 lg:sticky lg:top-8">
          <h2 className="font-bold text-foreground">Termin anfragen</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Wählen Sie eine Leistung und einen freien Slot, dann bestätigt der
            Betrieb Ihre Anfrage.
          </p>
          <Link
            href="/register"
            className="mt-4 flex h-11 items-center justify-center bg-accent uppercase font-semibold text-accent-foreground hover:bg-accent/90"
          >
            Jetzt anfragen
          </Link>
        </aside>
      </div>
    </div>
  )
}