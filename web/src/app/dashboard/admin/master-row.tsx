"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"
import { setMasterStatus, type AdminActionResult } from "./actions"

const ACTIONS: Record<string, { status: string; label: string; primary: boolean }[]> = {
  pending: [
    { status: "active", label: "Freischalten", primary: true },
    { status: "rejected", label: "Ablehnen", primary: false },
  ],
  active: [{ status: "deactivated", label: "Deaktivieren", primary: false }],
  rejected: [{ status: "active", label: "Erneut freischalten", primary: true }],
  deactivated: [{ status: "active", label: "Reaktivieren", primary: true }],
}

export function MasterRow({
  master,
  inRegion,
}: {
  master: {
    id: string
    fullName: string
    trade: string | null
    city: string | null
    plz: string | null
    status: string
    createdAt: string
  }
  inRegion: boolean | null
}) {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function act(status: string) {
    setError(null)
    const result: AdminActionResult = await setMasterStatus(master.id, status)
    if (!result.ok) {
      setError(result.error)
      return
    }
    router.refresh()
  }

  const actions = ACTIONS[master.status] ?? []

  return (
    <li className="flex flex-col gap-3 border-b border-zinc-200 py-4 last:border-0 dark:border-zinc-800 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-zinc-900 dark:text-zinc-100">
          {master.fullName || "Unbenannter Betrieb"}
        </p>
        <p className="mt-0.5 text-sm text-zinc-500">
          {master.trade ?? "—"}
          {master.city ? ` · ${master.plz ? `${master.plz} ` : ""}${master.city}` : ""}
        </p>
        <p className="mt-0.5 text-sm text-zinc-500">
          Registriert am{" "}
          {new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeZone: "UTC",
          }).format(new Date(master.createdAt))}
          {inRegion === null ? (
            ""
          ) : inRegion ? (
            <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-950 dark:text-emerald-200">
              in Region
            </span>
          ) : (
            <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-950 dark:text-red-200">
              außerhalb der Region
            </span>
          )}
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        {actions.map((a) => (
          <button
            key={a.status}
            onClick={() => act(a.status)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              a.primary
                ? "bg-primary text-primary-foreground hover:bg-primary/80"
                : "border bg-background hover:bg-muted"
            }`}
          >
            {a.label}
          </button>
        ))}
      </div>
      {error && (
        <p className="w-full text-sm text-destructive">{error}</p>
      )}
    </li>
  )
}