import Image from "next/image"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
import { TRADE_IMAGES, tradeCover, HERO_POSTER, HERO_VIDEO } from "@/lib/media"
import { filterWithinRegion } from "@/lib/master-filter"
import { dict, isLang } from "@/lib/i18n"
import { getLang } from "@/lib/i18n-server"
import { SearchBar } from "./components/search-bar"
import { Reveal } from "@/components/reveal"

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
  const masterCounts = masters.reduce<Record<string, number>>(
    (acc, m) => {
      if (m.trade) acc[m.trade] = (acc[m.trade] ?? 0) + 1
      return acc
    },
    {}
  )

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden bg-[#1c1c1c] text-[#eef0f2]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={HERO_POSTER}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
          aria-hidden="true"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-[#1c1c1c]/70 via-[#1c1c1c]/40 to-[#1c1c1c]" />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-8 h-72 w-72 animate-float rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute -right-28 top-1/3 h-80 w-80 animate-float-slow rounded-full bg-teal-500/10 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-float rounded-full bg-[#fafaff]/5 blur-3xl" />
        </div>
        <div className="relative mx-auto w-full max-w-6xl px-4 py-24 sm:py-32">
          <Reveal delay={0}>
            <p className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#dadde8]">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
              {t.badge}
            </p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-6xl sm:leading-[1.05]">
              {t.title}
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-6 max-w-xl text-lg text-[#dadde8]">
              {t.subtitle}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-12">
              <SearchBar lang={lang} />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <Reveal>
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
          </Reveal>
          <ul className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {TRADES.slice(0, 8).map((trade, index) => {
              const image = TRADE_IMAGES[trade]
              const count = masterCounts[trade] ?? 0
              return (
                <li key={trade}>
                  <Reveal className="h-full" delay={index * 60}>
                    <Link
                      href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
                      className="group relative block h-full overflow-hidden rounded-2xl bg-[#1c1c1c] shadow-[0_1px_3px_rgba(28,28,28,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,28,28,0.14)]"
                    >
                      {image && (
                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                          <Image
                            src={image}
                            alt={trade}
                            fill
                            sizes="(max-width: 640px) 50vw, 25vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1c1c1c]/90 via-[#1c1c1c]/25 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4">
                        <span className="font-bold leading-tight text-[1.15rem] text-[#fafaff] sm:text-xl">
                          {trade}
                        </span>
                        {count > 0 && (
                          <span className="shrink-0 rounded-full bg-[#fafaff]/15 px-2.5 py-0.5 text-xs font-semibold text-[#fafaff] backdrop-blur-sm">
                            {count} {count === 1 ? "Betrieb" : "Betriebe"}
                          </span>
                        )}
                      </div>
                    </Link>
                  </Reveal>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {t.stepsTitle}
              </h2>
              <p className="mt-3 text-muted-foreground">
                {t.stepsSubtitle}
              </p>
            </div>
          </Reveal>
          <ol className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              { title: t.step1Title, text: t.step1Text },
              { title: t.step2Title, text: t.step2Text },
              { title: t.step3Title, text: t.step3Text },
            ].map((step, index) => (
              <li key={step.title}>
                <Reveal className="h-full" delay={index * 100}>
                  <div className="flex h-full flex-col rounded-2xl border border-border bg-card p-8 transition-colors hover:border-accent/40">
                    <span className="text-3xl font-extrabold tracking-tight text-accent">
                      0{index + 1}
                    </span>
                    <h3 className="mt-4 text-lg font-bold text-foreground">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-muted-foreground">
                      {step.text}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-20">
          <Reveal>
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
          </Reveal>
          {masters.length === 0 ? (
            <p className="mt-10 rounded-2xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              {t.empty}
            </p>
          ) : (
            <ul className="mt-10 grid gap-4 sm:grid-cols-3">
              {masters.map((m, index) => {
                const image = tradeCover(m.trade, m.id)
                return (
                  <li key={m.id}>
                    <Reveal className="h-full" delay={index * 100}>
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
                    </Reveal>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </section>

      <section className="bg-[#1c1c1c] text-[#eef0f2]">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-20 sm:flex-row sm:items-center sm:justify-between">
          <Reveal>
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                {t.ctaTitle}
              </h2>
              <p className="mt-3 max-w-lg text-[#dadde8]">
                {t.ctaText}
              </p>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Link
              href="/register"
              className="inline-flex h-12 shrink-0 items-center rounded-lg bg-accent px-8 text-base font-bold text-accent-foreground transition-all hover:bg-accent/90 active:translate-y-px"
            >
              {t.ctaButton}
            </Link>
          </Reveal>
        </div>
      </section>
    </div>
  )
}