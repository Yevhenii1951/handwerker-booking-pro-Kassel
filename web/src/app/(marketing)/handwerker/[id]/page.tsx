import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { tradeImage } from "@/lib/media"

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
  const bannerImage = tradeImage(trade)
  const hourRows = workingHours
    .map((h) => ({
      day: WEEKDAYS[h.day_of_week],
      time: `${h.start_time.slice(0, 5)}–${h.end_time.slice(0, 5)}`,
    }))
    .sort((a, b) => WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day))

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
      {bannerImage && (
        <div className="relative mb-10 aspect-[21/9] w-full overflow-hidden rounded-2xl">
          <Image
            src={bannerImage}
            alt={trade ?? ""}
            fill
            priority
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/50 to-transparent" />
        </div>
      )}
      <header className="flex flex-col gap-6 pb-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-bold text-accent">{trade ?? "Handwerksbetrieb"}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {profile.full_name ?? "Handwerksbetrieb"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {profile.plz} {profile.city}
          </p>
          {profile.bio && (
            <p className="mt-4 max-w-xl leading-6 text-foreground/80">{profile.bio}</p>
          )}
        </div>
        {profile.phone && (
          <a
            href={`tel:${profile.phone}`}
            className="shrink-0 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
          >
            {profile.phone}
          </a>
        )}
      </header>

      <div className="grid gap-8 lg:grid-cols-[1fr,340px]">
        <section className="space-y-8">
          <div className="rounded-2xl bg-[#ecebe4] p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Leistungen & Preise
            </h2>
            {services.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Dieses Gewerk hat noch keine Leistungen eingetragen.
              </p>
            ) : (
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li
                    key={s.id}
                    className="flex items-center justify-between gap-4 rounded-xl bg-card px-5 py-4 shadow-[0_1px_3px_rgba(28,28,28,0.08)]"
                  >
                    <span className="font-semibold text-foreground">{s.name}</span>
                    <span className="shrink-0 text-sm text-muted-foreground">
                      {s.duration_minutes} Min. ·{" "}
                      <span className="font-semibold text-foreground">
                        {formatPrice(s.price)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-2xl bg-[#ecebe4] p-6 sm:p-8">
            <h2 className="text-xl font-bold tracking-tight text-foreground">
              Öffnungszeiten
            </h2>
            {hourRows.length === 0 ? (
              <p className="mt-4 rounded-xl border border-dashed border-border bg-card p-6 text-sm text-muted-foreground">
                Noch keine Arbeitszeiten eingetragen.
              </p>
            ) : (
              <dl className="mt-5 space-y-2">
                {hourRows.map((row) => (
                  <div
                    key={row.day}
                    className="flex items-center justify-between rounded-lg bg-card px-4 py-3 text-sm shadow-[0_1px_3px_rgba(28,28,28,0.08)]"
                  >
                    <dt className="text-muted-foreground">{row.day}</dt>
                    <dd className="font-semibold text-foreground tabular-nums">
                      {row.time} Uhr
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>

        <aside className="self-start rounded-2xl bg-[#1c1c1c] p-6 text-[#eef0f2] lg:sticky lg:top-8">
          <h2 className="font-bold text-[#fafaff]">Termin anfragen</h2>
          <p className="mt-2 text-sm text-[#dadde8]">
            Wählen Sie eine Leistung und einen freien Slot, dann bestätigt der Betrieb Ihre
            Anfrage.
          </p>
          <Link
            href="/register"
            className="mt-5 flex h-12 items-center justify-center rounded-lg bg-accent font-bold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Jetzt anfragen
          </Link>
        </aside>
      </div>
    </div>
  )
}