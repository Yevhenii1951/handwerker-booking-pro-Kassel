"use client"

import { useState } from "react"
import { deleteService } from "./actions"
import { ServiceForm } from "./service-form"
import type { Service } from "@/types/database"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
} from "@/components/ui/card"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"

function formatPrice(price: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(price)
}

interface ServicesManagerProps {
  services: Service[]
}

export function ServicesManager({ services }: ServicesManagerProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)

  if (services.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-600 dark:text-zinc-400">
          Sie haben noch keine Leistungen angelegt.
        </p>
        <CreateServiceDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        {services.map((service) => (
          <Card key={service.id} size="sm">
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>
                {formatPrice(service.price)} · {service.duration_minutes} Min.
              </CardDescription>
              {service.description && (
                <CardDescription>{service.description}</CardDescription>
              )}
              <CardAction>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditing(service)}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      if (confirm("Leistung wirklich löschen?")) {
                        void deleteService(service.id)
                      }
                    }}
                  >
                    Löschen
                  </Button>
                </div>
              </CardAction>
            </CardHeader>
          </Card>
        ))}
      </div>

      <CreateServiceDialog open={createOpen} onOpenChange={setCreateOpen} />

      <Dialog
        open={editing !== null}
        onOpenChange={(open) => {
          if (!open) setEditing(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leistung bearbeiten</DialogTitle>
            <DialogDescription>
              Ändern Sie den Namen, Preis oder die Dauer.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <ServiceForm
              mode="edit"
              service={editing}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

interface CreateServiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreateServiceDialog({ open, onOpenChange }: CreateServiceDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button>Leistung hinzufügen</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Neue Leistung</DialogTitle>
          <DialogDescription>
            Legen Sie eine Leistung mit Preis und Dauer an.
          </DialogDescription>
        </DialogHeader>
        <ServiceForm
          mode="create"
          onDone={() => {
            onOpenChange(false)
          }}
        />
      </DialogContent>
    </Dialog>
  )
}