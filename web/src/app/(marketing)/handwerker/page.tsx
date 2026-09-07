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

export default async function Handwerker(
  {
    searchParams,
  }: {
    searchParams: Promise<{ gewerk?: string }>
  }
) {
  const { gewerk } = await searchParams
  const activeGewerk = gewerk && TRADES.includes(gewerk as never) ? gewerk : null
  const masters = await getMasters(activeGewerk)

  return (
    <div className="mx-auto w-full max-w-6xl flex-1 px-4 py-12">
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
        Handwerker in Ihrer Nähe
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        {activeGewerk
          ? `Betriebe mit dem Gewerk "${activeGewerk}" in Kassel, Göttingen und 50 km Umkreis.`
          : "Alle aktiven Betriebe in Kassel, Göttingen und 50 km Umkreis."}
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/handwerker"
          className={`px-3 py-1.5 text-sm font-medium border ${
            !activeGewerk
              ? "border-foreground bg-foreground text-background"
              : "border-border hover:bg-muted"
          }`}
        >
          Alle
        </Link>
        {TRADES.slice(0, 12).map((trade) => (
          <Link
            key={trade}
            href={`/handwerker?gewerk=${encodeURIComponent(trade)}`}
            className={`px-3 py-1.5 text-sm font-medium border ${
              activeGewerk === trade
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:bg-muted"
            }`}
          >
            {trade}
          </Link>
        ))}
      </div>

      <MasterList masters={masters} activeGewerk={activeGewerk} />
    </div>
  )
}