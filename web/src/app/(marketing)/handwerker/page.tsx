import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
import { filterWithinRegion } from "@/lib/master-filter"
import { dict, isLang } from "@/lib/i18n"
import { getLang } from "@/lib/i18n-server"
import { MasterList } from "./components/master-list"

async function getMasters(gewerk: string | null) {
  const supabase = await createClient()
  let query = supabase
    .from("profiles")
    .select("id, full_name, trade, city, plz, bio, latitude, longitude")
    .eq("role", "master")
    .eq("master_status", "active")
    .not("trade", "is", null)
    .order("created_at", { ascending: false })

  if (gewerk) {
    query = query.eq("trade", gewerk)
  }

  const [{ data }, { data: centers }] = await Promise.all([
    query,
    supabase.from("region_centers").select("name, latitude, longitude, max_radius_km"),
  ])

  return filterWithinRegion(data ?? [], centers ?? [])
}

export default async function Handwerker({
  searchParams,
}: {
  searchParams: Promise<{ gewerk?: string; lang?: string }>
}) {
  const { gewerk, lang: langParam } = await searchParams
  const activeGewerk = gewerk && TRADES.includes(gewerk as never) ? gewerk : null
  const lang = isLang(langParam) ? langParam : await getLang()
  const t = dict[lang].catalog
  const masters = await getMasters(activeGewerk)

  return (
    <div className="flex-1">
      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {t.title}
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {activeGewerk ? t.inGewerk(activeGewerk) : t.all}
          </p>

          <div className="mt-8 flex flex-wrap gap-2">
            <Link
              href="/handwerker"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                !activeGewerk
                  ? "bg-[#1c1c1c] text-[#fafaff]"
                  : "bg-[#fafaff] text-foreground shadow-[0_1px_3px_rgba(28,28,28,0.08)] hover:bg-white"
              }`}
            >
              {t.alle}
            </Link>
            {TRADES.slice(0, 12).map((trade) => (
              <Link
                key={trade}
                href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  activeGewerk === trade
                    ? "bg-[#1c1c1c] text-[#fafaff]"
                    : "bg-[#fafaff] text-foreground shadow-[0_1px_3px_rgba(28,28,28,0.08)] hover:bg-white"
                }`}
              >
                {trade}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-background">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <p className="text-sm text-muted-foreground">
            {t.count(masters.length)}
          </p>
          <MasterList masters={masters} activeGewerk={activeGewerk} />
        </div>
      </section>
    </div>
  )
}