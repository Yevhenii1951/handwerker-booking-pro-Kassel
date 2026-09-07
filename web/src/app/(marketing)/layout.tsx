import { Suspense } from "react"
import { createClient } from "@/lib/supabase/server"
import { MarketingHeader } from "./components/marketing-header"
import { MarketingFooter } from "./components/marketing-footer"

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
        <MarketingHeader isLoggedIn={Boolean(user)} />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Suspense fallback={null}>
        <MarketingFooter />
      </Suspense>
    </div>
  )
}