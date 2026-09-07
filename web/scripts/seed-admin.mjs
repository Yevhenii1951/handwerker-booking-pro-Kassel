// Seeds one admin account. Idempotent: re-running finds the existing user.
// Usage: cd web && set -a && . ./.env.local && set +a && node scripts/seed-admin.mjs
import { createClient } from "@supabase/supabase-js"

const ADMIN_EMAIL = "admin@handwerkerpro.de"
const ADMIN_PASSWORD = "Admin-2024!X"
const ADMIN_NAME = "Verwaltung"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
)

async function ensureAdmin() {
  const { data: existing, error: listError } = await supabase.auth.admin.listUsers()

  if (!existing) {
    console.error("listUsers failed:", listError?.message)
    process.exit(1)
  }

  const found = existing.users.find((u) => u.email?.toLowerCase() === ADMIN_EMAIL)

  if (found) {
    const { error: profileError } = await supabase
      .from("profiles")
      .update({ role: "admin", full_name: ADMIN_NAME, master_status: null })
      .eq("id", found.id)
    if (profileError) {
      console.error("profile update failed:", profileError.message)
      process.exit(1)
    }
    console.log(`Admin already exists, role ensured -> ${ADMIN_EMAIL}`)
    return
  }

  const { data: created, error } = await supabase.auth.admin.createUser({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: ADMIN_NAME, role: "admin" },
  })

  if (error) {
    console.error("createUser failed:", error.message)
    process.exit(1)
  }

  const adminId = created.user.id
  const { error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin", full_name: ADMIN_NAME })
    .eq("id", adminId)

  if (profileError) {
    console.error("profile update failed:", profileError.message)
    process.exit(1)
  }

  console.log(`Admin seeded -> ${ADMIN_EMAIL} (password: ${ADMIN_PASSWORD})`)
}

ensureAdmin()