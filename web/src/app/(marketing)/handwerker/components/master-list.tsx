import Link from "next/link"

interface Master {
  id: string
  full_name: string | null
  trade: string | null
  city: string | null
  plz: string | null
  bio: string | null
}

export function MasterList({
  masters,
  activeGewerk,
}: {
  masters: Master[]
  activeGewerk: string | null
}) {
  if (masters.length === 0) {
    return (
      <div className="mt-10 border border-dashed border-border p-8 text-center">
        <p className="font-semibold text-foreground">Keine Betriebe gefunden</p>
        <p className="mt-1 text-sm text-muted-foreground">
          {activeGewerk
            ? `Noch kein Betrieb für "${activeGewerk}" registriert.`
            : "Noch keine Betriebe registriert."}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Sie sind selbst Handwerker?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Jetzt kostenlos registrieren
          </Link>
        </p>
      </div>
    )
  }

  return (
    <ul className="mt-6 divide-y divide-border border-y border-border">
      {masters.map((m) => (
        <li key={m.id}>
          <Link
            href={`/handwerker/${m.id}`}
            className="flex flex-col gap-1 py-5 hover:bg-muted sm:flex-row sm:items-start sm:justify-between"
          >
            <span>
              <span className="block font-bold text-foreground">
                {m.full_name ?? "Handwerksbetrieb"}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                {m.trade}
              </span>
              {m.bio && (
                <span className="mt-1 block text-sm text-muted-foreground line-clamp-2">
                  {m.bio}
                </span>
              )}
            </span>
            <span className="shrink-0 text-sm font-medium text-foreground">
              {m.plz} {m.city}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}