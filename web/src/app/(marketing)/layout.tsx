import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { MarketingChrome } from "./components/marketing-chrome"

export default async function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-14 border-b border-border" />}>
        <MarketingChrome isLoggedIn={Boolean(user)} />
      </Suspense>
      <main className="flex-1">{children}</main>
    </div>
  )
}