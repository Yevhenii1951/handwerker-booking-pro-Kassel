import Image from "next/image"
import Link from "next/link"
import { tradeImage } from "@/lib/media"

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
      {masters.map((m) => {
        const image = tradeImage(m.trade)
        return (
          <li key={m.id}>
            <Link
              href={`/handwerker/${m.id}`}
              className="group flex flex-col gap-4 py-5 hover:bg-muted sm:flex-row sm:items-center"
            >
              {image ? (
                <div className="relative h-20 w-full shrink-0 overflow-hidden sm:w-32">
                  <Image
                    src={image}
                    alt={m.trade ?? ""}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="hidden h-20 w-full shrink-0 bg-muted sm:block sm:w-32" />
              )}
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-bold text-foreground group-hover:text-accent">
                  {m.full_name ?? "Handwerksbetrieb"}
                </span>
                <span className="text-sm text-muted-foreground">{m.trade}</span>
                {m.bio && (
                  <span className="text-sm text-muted-foreground line-clamp-2">
                    {m.bio}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-sm font-medium text-foreground">
                {m.plz} {m.city}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}