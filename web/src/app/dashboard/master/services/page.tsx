import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { ServicesManager } from "./services-manager"
import type { Service } from "@/types/database"

export default async function ServicesPage() {
  const { profile } = await requireRole(["master", "admin"])

  const supabase = await createClient()
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("master_id", profile.id)
    .order("name", { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold">Leistungen</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Verwalten Sie Ihre Leistungen, Preise und Dauern.
      </p>
      <div className="mt-6">
        <ServicesManager services={(data as Service[]) ?? []} />
      </div>
    </div>
  )
}