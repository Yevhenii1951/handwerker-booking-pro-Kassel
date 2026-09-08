import { requireRole } from "@/lib/auth"
import { createClient } from "@/lib/supabase/server"
import { WorkingHoursForm } from "./working-hours-form"
import { requireMasterSetup } from "../setup-guard"
import type { WorkingHours } from "@/types/database"

export default async function SchedulePage() {
  const { profile } = await requireRole(["master", "admin"])
  requireMasterSetup(profile)

  const supabase = await createClient()
  const { data } = await supabase
    .from("working_hours")
    .select("*")
    .eq("master_id", profile.id)
    .order("day_of_week", { ascending: true })

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">Arbeitszeiten</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Bestimmen Sie Ihre festen wöchentlichen Arbeitszeiten. Aus diesen
        werden automatisch buchbare Zeitslots generiert.
      </p>
      <div className="mt-6">
        <WorkingHoursForm workingHours={(data as WorkingHours[]) ?? []} />
      </div>
    </div>
  )
}