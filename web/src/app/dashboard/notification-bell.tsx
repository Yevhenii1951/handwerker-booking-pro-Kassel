"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"

interface NotificationItem {
  id: string
  title: string
  body: string | null
  link: string | null
  read: boolean
  created_at: string
}

export function NotificationBell() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const unread = items.filter((n) => !n.read).length

  useEffect(() => {
    let cancelled = false
    fetch("/dashboard/notifications/api")
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return
        setItems((data?.items ?? []) as NotificationItem[])
        setLoaded(true)
      })
      .catch(() => {
        if (!cancelled) setLoaded(true)
      })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", onClickOutside)
    return () => document.removeEventListener("mousedown", onClickOutside)
  }, [])

  async function openPanel() {
    const next = !open
    setOpen(next)
    if (next && unread > 0) {
      const optimistic = items.map((n) => ({ ...n, read: true }))
      setItems(optimistic)
      await fetch("/dashboard/notifications/api", { method: "POST" }).catch(() => {})
    }
  }

  // Auto-open the panel once if there are unread notifications on first load,
  // and mark them read (viewing counts as reading, so the toast disappears).
  useEffect(() => {
    if (!loaded || open || unread === 0) return
    const timer = setTimeout(() => {
      setOpen(true)
      const optimistic = items.map((n) => ({ ...n, read: true }))
      setItems(optimistic)
      fetch("/dashboard/notifications/api", { method: "POST" }).catch(() => {})
    }, 600)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, open, unread])

  function formatTime(value: string): string {
    return new Intl.DateTimeFormat("de-DE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value))
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={openPanel}
        aria-label="Benachrichtigungen"
        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-accent-foreground">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-xl border border-border bg-card shadow-lg motion-safe:animate-in motion-safe:fade-in-0 motion-safe:zoom-in-95 motion-safe:duration-150 motion-reduce:animate-none">
          <div className="border-b border-border px-4 py-3">
            <p className="text-sm font-semibold text-foreground">Benachrichtigungen</p>
          </div>
          <ul className="max-h-72 divide-y divide-border overflow-y-auto">
            {items.length === 0 && (
              <li className="px-4 py-6 text-center text-sm text-muted-foreground">
                Keine Benachrichtigungen.
              </li>
            )}
            {items.map((n) => (
              <li key={n.id}>
                {n.link ? (
                  <Link
                    href={n.link}
                    onClick={() => setOpen(false)}
                    className="block px-4 py-3 transition-colors hover:bg-muted"
                  >
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {n.body && (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      {formatTime(n.created_at)}
                    </p>
                  </Link>
                ) : (
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-foreground">{n.title}</p>
                    {n.body && (
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {n.body}
                      </p>
                    )}
                    <p className="mt-1 text-[11px] text-muted-foreground/80">
                      {formatTime(n.created_at)}
                    </p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
