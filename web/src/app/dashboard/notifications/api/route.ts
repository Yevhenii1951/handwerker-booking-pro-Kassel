import { createClient } from "@/lib/supabase/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET() {
  const user = await getCurrentUser()
  if (!user) return Response.json({ items: [] })

  const supabase = await createClient()
  const { data } = await supabase
    .from("notifications")
    .select("id, title, body, link, read, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(10)

  return Response.json({ items: data ?? [] })
}

export async function POST() {
  const user = await getCurrentUser()
  if (!user) return Response.json({ ok: false })

  const supabase = await createClient()
  await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", user.id)
    .eq("read", false)

  return Response.json({ ok: true })
}
