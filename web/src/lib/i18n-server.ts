import { cookies } from "next/headers"
import type { Lang } from "./i18n"

export async function getLang(): Promise<Lang> {
  const cookieStore = await cookies()
  const value = cookieStore.get("lang")?.value
  return value === "en" ? "en" : "de"
}