import { useState } from "react"
import { teacherApi } from "@/api/teachers"
import { DepartmentPicker } from "@/components/department-picker"
import { FormDialog } from "@/components/form-dialog"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"
import type { Teacher, TeacherInput } from "@/types"

type TeacherFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  teacher: Teacher | null
}

type Errors = Partial<Record<keyof TeacherInput, string>>

function validate(input: TeacherInput): Errors {
  const errors: Errors = {}
  if (!input.firstName) errors.firstName = "First name is required"
  if (!input.lastName) errors.lastName = "Last name is required"
  if (!input.designation) errors.designation = "Designation is required"
  if (!input.expertise) errors.expertise = "Expertise is required"
  if (!input.departmentIds.length) errors.departmentIds = "Select at least one department"
  return errors
}

export function TeacherFormDialog({ open, onOpenChange, teacher }: TeacherFormDialogProps) {
  const [values, setValues] = useState<TeacherInput>({
    firstName: teacher?.user.firstName ?? "",
    lastName: teacher?.user.lastName ?? "",
    designation: teacher?.designation ?? "",
    expertise: teacher?.expertise ?? "",
    departmentIds: teacher?.departments.map((d) => d.id) ?? [],
  })
  const [errors, setErrors] = useState<Errors>({})
  const create = teacherApi.useCreate()
  const update = teacherApi.useUpdate()
  const isEdit = teacher !== null

  const set = <K extends keyof TeacherInput>(key: K, value: TeacherInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = () => {
    const input = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      designation: values.designation.trim(),
      expertise: values.expertise.trim(),
    }
    const nextErrors = validate(input)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const onSuccess = () => onOpenChange(false)
    if (isEdit) update.mutate({ id: teacher.id, input }, { onSuccess })
    else create.mutate(input, { onSuccess })
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Update teacher" : "Add teacher"}
      description={isEdit ? "Change the teacher's details." : "Add a new teacher to the faculty."}
      submitLabel={isEdit ? "Save changes" : "Create"}
      isPending={create.isPending || update.isPending}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="teacher-first-name" label="First name" error={errors.firstName}>
          <Input
            id="teacher-first-name"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            autoFocus
          />
        </FormField>
        <FormField id="teacher-last-name" label="Last name" error={errors.lastName}>
          <Input
            id="teacher-last-name"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
          />
        </FormField>
      </div>
      <FormField id="teacher-designation" label="Designation" error={errors.designation}>
        <Input
          id="teacher-designation"
          placeholder="e.g. Associate Professor"
          value={values.designation}
          onChange={(e) => set("designation", e.target.value)}
          aria-invalid={!!errors.designation}
        />
      </FormField>
      <FormField id="teacher-expertise" label="Expertise" error={errors.expertise}>
        <Input
          id="teacher-expertise"
          placeholder="e.g. Machine Learning"
          value={values.expertise}
          onChange={(e) => set("expertise", e.target.value)}
          aria-invalid={!!errors.expertise}
        />
      </FormField>
      <DepartmentPicker
        value={values.departmentIds}
        onChange={(ids) => set("departmentIds", ids)}
        error={errors.departmentIds}
      />
    </FormDialog>
  )
}
