import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import type { Profile } from "@/types/database"

export async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return user
}

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient()
  const user = await getCurrentUser()
  if (!user) return null

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return data
}

export async function requireUser() {
  const user = await getCurrentUser()
  if (!user) {
    redirect("/login")
  }
  return user
}

export async function requireProfile() {
  const user = await requireUser()
  const profile = await getCurrentProfile()
  if (!profile) {
    redirect("/login")
  }
  return { user, profile }
}

export async function requireRole(roles: string[]) {
  const { user, profile } = await requireProfile()
  if (!roles.includes(profile.role)) {
    redirect("/")
  }
  return { user, profile }
}