import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
import { TRADE_IMAGES, HERO_POSTER, HERO_VIDEO } from "@/lib/media"
import { filterWithinRegion } from "@/lib/master-filter"
import { dict, isLang } from "@/lib/i18n"
import { getLang } from "@/lib/i18n-server"
import { SearchBar } from "./components/search-bar"

async function getActiveMasters() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("profiles")
    .select("id, full_name, trade, city, plz, latitude, longitude")
    .eq("role", "master")
    .eq("master_status", "active")
    .not("trade", "is", null)
    .order("created_at", { ascending: false })
    .limit(10)

  const { data: centers } = await supabase
    .from("region_centers")
    .select("name, latitude, longitude, max_radius_km")

  return filterWithinRegion(data ?? [], centers ?? []).slice(0, 3)
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>
}) {
  const params = await searchParams
  const lang = isLang(params.lang) ? params.lang : await getLang()
  const t = dict[lang].landing

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
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
          <p className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#dadde8]">
            <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
            {t.badge}
          </p>
          <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.05]">
            {t.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg text-[#dadde8]">
            {t.subtitle}
          </p>
          <div className="mt-12">
            <SearchBar lang={lang} />
          </div>
        </div>
      </section>

      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t.catsTitle}
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                {t.catsSubtitle}
              </p>
            </div>
            <Link
              href="/handwerker"
              className="w-fit text-sm font-semibold text-foreground hover:text-accent"
            >
              {t.allTrades}
            </Link>
          </div>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {TRADES.slice(0, 8).map((trade) => {
              const image = TRADE_IMAGES[trade]
              return (
                <li key={trade}>
                  <Link
                    href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#fafaff] shadow-[0_1px_3px_rgba(28,28,28,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,28,28,0.14)]"
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
                      </div>
                    )}
                    <span className="px-5 py-4">
                      <span className="font-semibold leading-snug text-[1.3rem] text-[#008574]">
                        {trade}
                      </span>
                    </span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t.stepsTitle}
            </h2>
            <p className="mt-3 text-muted-foreground">
              {t.stepsSubtitle}
            </p>
          </div>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            <li className="rounded-2xl border border-border bg-card p-8">
              <span className="text-3xl font-extrabold tracking-tight text-accent">01</span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{t.step1Title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t.step1Text}
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-8">
              <span className="text-3xl font-extrabold tracking-tight text-accent">02</span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{t.step2Title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t.step2Text}
              </p>
            </li>
            <li className="rounded-2xl border border-border bg-card p-8">
              <span className="text-3xl font-extrabold tracking-tight text-accent">03</span>
              <h3 className="mt-4 text-lg font-bold text-foreground">{t.step3Title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {t.step3Text}
              </p>
            </li>
          </ol>
        </div>
      </section>

      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t.recentTitle}
              </h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                {t.recentSubtitle}
              </p>
            </div>
          </div>
          {masters.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t.empty}
            </p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {masters.map((m) => {
                const image = TRADE_IMAGES[m.trade ?? ""]
                return (
                  <li key={m.id}>
                    <Link
                      href={`/handwerker/${m.id}`}
                      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-[#fafaff] shadow-[0_1px_3px_rgba(28,28,28,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,28,28,0.14)]"
                    >
                      {image && (
                        <div className="relative aspect-[16/10] overflow-hidden">
                          <Image
                            src={image}
                            alt={m.trade ?? ""}
                            fill
                            sizes="(max-width: 640px) 100vw, 33vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                      )}
                      <span className="flex flex-1 flex-col justify-between gap-3 p-5">
                        <span className="font-bold text-foreground group-hover:text-accent">
                          {m.full_name ?? "Handwerksbetrieb"}
                        </span>
                        <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground/70">{m.trade}</span>
                          <span>
                            {m.plz} {m.city}
                          </span>
                        </span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#1c1c1c] text-[#eef0f2]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t.ctaTitle}
            </h2>
            <p className="mt-3 max-w-lg text-[#dadde8]">
              {t.ctaText}
            </p>
          </div>
          <Link
            href="/register"
            className="inline-flex h-12 shrink-0 items-center rounded-lg bg-accent px-8 text-base font-bold text-accent-foreground transition-colors hover:bg-accent/90"
          >
            {t.ctaButton}
          </Link>
        </div>
      </section>
    </div>
  )
}