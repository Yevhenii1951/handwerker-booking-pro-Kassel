import Image from "next/image"
import Link from "next/link"
import { tradeCover } from "@/lib/media"

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
      <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
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
    <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
      {masters.map((m) => {
        const image = tradeCover(m.trade, m.id)
        return (
          <li key={m.id}>
            <Link
              href={`/handwerker/${m.id}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-[0_1px_3px_rgba(28,28,28,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(28,28,28,0.14)]"
            >
              {image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={image}
                    alt={m.trade ?? ""}
                    fill
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}
              <span className="flex flex-1 flex-col gap-3 p-5">
                <span className="font-bold text-foreground group-hover:text-accent">
                  {m.full_name ?? "Handwerksbetrieb"}
                </span>
                <span className="flex flex-wrap gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground/70">{m.trade}</span>
                  <span>
                    {m.plz} {m.city}
                  </span>
                </span>
                {m.bio && (
                  <span className="mt-auto line-clamp-2 text-sm text-muted-foreground">
                    {m.bio}
                  </span>
                )}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}