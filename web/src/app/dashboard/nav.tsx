"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "cn"

export interface DashboardNavItem {
  href: string
  label: string
}

export function DashboardNav({ items }: { items: DashboardNavItem[] }) {
  const pathname = usePathname()

  return (
    <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-3">
      {items.map((item) => {
        const active = pathname === item.href
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "shrink-0 rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
              active
                ? "bg-[#1c1c1c] text-[#fafaff]"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}