import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { TRADES } from "@/lib/trades"
import { MasterList } from "./components/master-list"

async function getMasters(gewerk: string | null) {
  const supabase = await createClient()
  let query = supabase
    .from("profiles")
    .select("id, full_name, trade, city, plz, bio")
    .eq("role", "master")
    .eq("master_status", "active")
    .not("trade", "is", null)
    .order("created_at", { ascending: false })

  if (gewerk) {
    query = query.eq("trade", gewerk)
  }

  const { data } = await query
  return data ?? []
}

export default async function Handwerker({
  searchParams,
}: {
  searchParams: Promise<{ gewerk?: string }>
}) {
  const { gewerk } = await searchParams
  const activeGewerk = gewerk && TRADES.includes(gewerk as never) ? gewerk : null
  const masters = await getMasters(activeGewerk)

  return (
    <div className="flex-1">
      <section className="bg-[#ecebe4]">
        <div className="mx-auto w-full max-w-6xl px-4 py-16">
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Handwerker in Ihrer Nähe
          </h1>
          <p className="mt-3 max-w-xl text-muted-foreground">
            {activeGewerk
              ? `Betriebe mit dem Gewerk "${activeGewerk}" in Kassel, Göttingen und 50 km Umkreis.`
              : "Alle aktiven Betriebe in Kassel, Göttingen und 50 km Umkreis."}
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
              Alle
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
            {masters.length} {masters.length === 1 ? "Betrieb" : "Betriebe"} gefunden
          </p>
          <MasterList masters={masters} activeGewerk={activeGewerk} />
        </div>
      </section>
    </div>
  )
}