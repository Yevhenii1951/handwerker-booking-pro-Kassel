import Link from "next/link"
import { LoginForm } from "./login-form"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const { next } = await searchParams

  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold">Anmelden</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Willkommen zurück.
        </p>

        <LoginForm next={next ?? "/dashboard"} />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Noch kein Konto?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            Jetzt registrieren
          </Link>
        </p>
      </div>
    </div>
  )
}