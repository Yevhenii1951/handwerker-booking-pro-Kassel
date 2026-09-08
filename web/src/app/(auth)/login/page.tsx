import Link from "next/link"
import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-[#1c1c1c] px-4 py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl"
      />

      <div className="relative w-full max-w-md animate-in rounded-2xl bg-[#fafaff] p-8 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[#1c1c1c]"
        >
          handwerker<span className="text-accent">pro</span>
        </Link>
        <h1 className="mt-6 text-2xl font-semibold tracking-tight text-[#1c1c1c]">
          Anmelden
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Willkommen zurück.</p>

        <LoginForm next={next ?? "/dashboard"} />

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Noch kein Konto?{" "}
          <Link
            href="/register"
            className="font-semibold text-accent hover:underline"
          >
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}