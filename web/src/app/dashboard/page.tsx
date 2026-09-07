import { redirect } from "next/navigation"
import { requireProfile } from "@/lib/auth"

// Route to dashboard-specific page based on the user's role.
export default async function DashboardRouter() {
  const { profile } = await requireProfile()

  if (profile.role === "master") {
    redirect("/dashboard/master")
  }
  redirect("/dashboard/customer")
}