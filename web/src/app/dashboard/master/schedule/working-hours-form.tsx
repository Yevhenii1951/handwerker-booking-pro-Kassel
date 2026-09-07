"use client"

import { useState } from "react"
import { upsertWorkingHour, deleteWorkingHour } from "./actions"
import { WEEKDAY_LABELS } from "@/lib/weekdays"
import type { WorkingHours } from "@/types/database"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
  CardContent,
} from "@/components/ui/card"

interface WorkingHoursFormProps {
  workingHours: WorkingHours[]
}

export function WorkingHoursForm({ workingHours }: WorkingHoursFormProps) {
  const [errors, setErrors] = useState<Record<string, string> | null>(null)
  const [savingDay, setSavingDay] = useState<number | null>(null)

  const byDay = new Map(
    workingHours.map((wh) => [wh.day_of_week, wh])
  )

  async function handleSave(
    dayOfWeek: number,
    formData: FormData
  ) {
    setSavingDay(dayOfWeek)
    setErrors(null)

    const result = await upsertWorkingHour(formData)

    setSavingDay(null)
    if (!result.ok) {
      setErrors({ [String(dayOfWeek)]: result.error })
    }
  }

  async function handleDelete(
    dayOfWeek: number,
    id: string
  ) {
    setErrors(null)
    await deleteWorkingHour(id)
  }

  return (
    <div className="space-y-3">
      {WEEKDAY_LABELS.map((label, dayIndex) => {
        const wh = byDay.get(dayIndex)

        return (
          <Card key={dayIndex} size="sm">
            <CardHeader>
              <CardTitle>{label}</CardTitle>
              <CardAction>
                {wh && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(dayIndex, wh.id)}
                  >
                    Entfernen
                  </Button>
                )}
              </CardAction>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-wrap items-end gap-3"
                action={async (formData: FormData) => {
                  formData.set("dayOfWeek", String(dayIndex))
                  await handleSave(dayIndex, formData)
                }}
              >
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    htmlFor={`start-${dayIndex}`}
                  >
                    Von
                  </label>
                  <Input
                    id={`start-${dayIndex}`}
                    name="startTime"
                    type="time"
                    defaultValue={wh?.start_time ?? "09:00"}
                    required
                  />
                </div>
                <div>
                  <label
                    className="mb-1.5 block text-xs font-medium"
                    htmlFor={`end-${dayIndex}`}
                  >
                    Bis
                  </label>
                  <Input
                    id={`end-${dayIndex}`}
                    name="endTime"
                    type="time"
                    defaultValue={wh?.end_time ?? "17:00"}
                    required
                  />
                </div>
                <Button
                  type="submit"
                  variant={wh ? "secondary" : "default"}
                  size="sm"
                  disabled={savingDay === dayIndex}
                >
                  {wh
                    ? savingDay === dayIndex
                      ? "Speichert…"
                      : "Zeiten speichern"
                    : savingDay === dayIndex
                      ? "Speichert…"
                      : "Arbeitszeit festlegen"}
                </Button>
                {errors?.[String(dayIndex)] && (
                  <p className="w-full text-sm text-destructive">
                    {errors[String(dayIndex)]}
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}