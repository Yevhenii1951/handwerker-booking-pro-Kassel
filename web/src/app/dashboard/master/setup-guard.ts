import { redirect } from "next/navigation"
import type { Profile } from "@/types/database"

export function requireMasterSetup(profile: Profile) {
  if (!profile.trade || profile.latitude === null || profile.longitude === null) {
    redirect("/dashboard/master/onboarding")
  }
}