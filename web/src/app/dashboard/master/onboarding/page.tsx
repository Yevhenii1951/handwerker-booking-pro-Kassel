import { requireRole } from "@/lib/auth"
import { OnboardingForm } from "./onboarding-form"

export default async function MasterOnboardingPage() {
  const { profile } = await requireRole(["master", "admin"])

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">
        Profilvervollständigung
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Bitte vervollständigen Sie Ihr Profil. Danach wird Ihre Registrierung von
        unserem Team geprüft, bevor Sie sichtbar werden.
      </p>
      <OnboardingForm profile={profile} />
    </div>
  )
}