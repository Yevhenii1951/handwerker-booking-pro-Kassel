import Link from "next/link"
import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-black">
      <div className="w-full max-w-md rounded-xl border bg-white p-8 shadow-sm dark:bg-zinc-900 dark:border-zinc-800">
        <h1 className="text-2xl font-semibold">Konto erstellen</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Registrieren Sie sich als Kunde oder Handwerker.
        </p>

        <RegisterForm />

        <p className="mt-6 text-center text-sm text-zinc-500">
          Bereits ein Konto?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}