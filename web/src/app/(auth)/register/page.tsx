import Link from "next/link"
import { RegisterForm } from "./register-form"

export default function RegisterPage() {
  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden bg-[#1c1c1c] px-4 py-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-accent/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-teal-500/15 blur-3xl"
      />

      <div className="relative w-full max-w-md animate-in rounded-2xl bg-[#fafaff] p-6 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.6)] slide-in-from-bottom-2 duration-500 ease-out motion-reduce:animate-none sm:p-7">
        <Link
          href="/"
          className="text-xl font-extrabold tracking-tight text-[#1c1c1c]"
        >
          handwerker<span className="text-accent">pro</span>
        </Link>
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#1c1c1c] sm:text-2xl">
          Konto erstellen
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registrieren Sie sich als Kunde oder Handwerker.
        </p>

        <RegisterForm />

        <p className="mt-5 text-center text-sm text-muted-foreground">
          Bereits ein Konto?{" "}
          <Link
            href="/login"
            className="font-semibold text-accent hover:underline"
          >
            Anmelden
          </Link>
        </p>
      </div>
    </div>
  )
}