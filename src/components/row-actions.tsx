import { PencilIcon, Trash2Icon } from "lucide-react"
import { Button } from "@/components/ui/button"

type RowActionsProps = {
  label: string
  onEdit: () => void
  onDelete: () => void
}

export function RowActions({ label, onEdit, onDelete }: RowActionsProps) {
  return (
    <div className="flex justify-end gap-1">
      <Button variant="ghost" size="icon-sm" onClick={onEdit} aria-label={`Edit ${label}`}>
        <PencilIcon />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        className="text-destructive hover:text-destructive"
        onClick={onDelete}
        aria-label={`Delete ${label}`}
      >
        <Trash2Icon />
      </Button>
    </div>
  )
}
