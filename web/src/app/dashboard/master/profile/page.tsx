import { requireRole } from "@/lib/auth"
import { getCurrentProfile } from "@/lib/auth"
import { ProfileForm } from "./profile-form"

export default async function ProfilePage() {
  await requireRole(["master", "admin"])
  const profile = await getCurrentProfile()

  if (!profile) {
    return null
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="mt-1 text-sm text-zinc-500">
        Diese Angaben sind auf Ihrer öffentlichen Betriebsseite sichtbar.
      </p>
      <ProfileForm profile={profile} />
    </div>
  )
}