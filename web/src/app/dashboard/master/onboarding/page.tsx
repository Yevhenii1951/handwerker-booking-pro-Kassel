import { requireRole } from "@/lib/auth"
import { OnboardingForm } from "./onboarding-form"

export default async function MasterOnboardingPage() {
  const { profile } = await requireRole(["master", "admin"])

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profilvervollständigung</h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        Bitte vervollständigen Sie Ihr Profil. Danach wird Ihre Registrierung von
        unserem Team geprüft, bevor Sie sichtbar werden.
      </p>
      <OnboardingForm profile={profile} />
    </div>
  )
}