const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-900 dark:bg-amber-400/15 dark:text-amber-300",
  confirmed:
    "bg-teal-100 text-teal-900 dark:bg-teal-400/15 dark:text-teal-300",
  declined: "bg-red-100 text-red-900 dark:bg-red-400/15 dark:text-red-300",
  cancelled:
    "bg-muted text-muted-foreground dark:bg-foreground/10 dark:text-muted-foreground",
}

const STATUS_LABELS: Record<string, string> = {
  pending: "Offen",
  confirmed: "Bestätigt",
  declined: "Abgelehnt",
  cancelled: "Storniert",
}

export function StatusBadge({
  status,
  label,
}: {
  status: string
  label?: string
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        STATUS_STYLES[status] ?? STATUS_STYLES.cancelled
      }`}
    >
      {label ?? STATUS_LABELS[status] ?? status}
    </span>
  )
}