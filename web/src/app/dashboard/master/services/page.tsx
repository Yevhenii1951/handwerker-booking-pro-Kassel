import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ServicesManager } from "./services-manager"
import { requireMasterSetup } from "../setup-guard"
import type { Service } from "@/types/database"

export default async function ServicesPage() {
  const { profile } = await requireRole(["master", "admin"])
  requireMasterSetup(profile)

  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("master_id", profile.id)
    .order("name", { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Leistungen</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Verwalten Sie Ihre Leistungen, Preise und Dauern.
      </p>
      <div className="mt-6">
        <ServicesManager services={(data as Service[]) ?? []} />
      </div>
    </div>
  )
}