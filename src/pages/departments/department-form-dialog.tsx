import { useState } from "react"
import { departmentApi } from "@/api/departments"
import { FormDialog } from "@/components/form-dialog"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"
import type { Department } from "@/types"

type DepartmentFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  department: Department | null
}

export function DepartmentFormDialog({ open, onOpenChange, department }: DepartmentFormDialogProps) {
  const [name, setName] = useState(department?.name ?? "")
  const [error, setError] = useState<string>()
  const create = departmentApi.useCreate()
  const update = departmentApi.useUpdate()
  const isEdit = department !== null

  const handleSubmit = () => {
    const input = { name: name.trim() }
    if (!input.name) return setError("Name is required")
    setError(undefined)

    const onSuccess = () => onOpenChange(false)
    if (isEdit) update.mutate({ id: department.id, input }, { onSuccess })
    else create.mutate(input, { onSuccess })
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Update department" : "Add department"}
      description={isEdit ? "Change the department's name." : "Create a new department."}
      submitLabel={isEdit ? "Save changes" : "Create"}
      isPending={create.isPending || update.isPending}
      onSubmit={handleSubmit}
    >
      <FormField id="department-name" label="Name" error={error}>
        <Input
          id="department-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value)
            setError(undefined)
          }}
          aria-invalid={!!error}
          autoFocus
        />
      </FormField>
    </FormDialog>
  )
}
