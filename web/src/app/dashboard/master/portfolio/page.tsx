import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { PortfolioManager } from "./portfolio-manager"
import { requireMasterSetup } from "../setup-guard"

export default async function PortfolioPage() {
  const { profile } = await requireRole(["master", "admin"])
  requireMasterSetup(profile)

  const supabase = await createClient()
  const { data } = await supabase
    .from("portfolio_images")
    .select("id, image_url")
    .eq("master_id", profile.id)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Fotos Ihrer Arbeiten werden auf Ihrer öffentlichen Betriebsseite angezeigt.
      </p>
      <PortfolioManager images={data ?? []} />
    </div>
  )
}