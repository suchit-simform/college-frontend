import { useState } from "react"
import { studentApi } from "@/api/students"
import { DepartmentPicker } from "@/components/department-picker"
import { FormDialog } from "@/components/form-dialog"
import { FormField } from "@/components/form-field"
import { Input } from "@/components/ui/input"
import type { Student, StudentInput } from "@/types"

type StudentFormDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  student: Student | null
}

type Errors = Partial<Record<keyof StudentInput, string>>

function validate(input: StudentInput): Errors {
  const errors: Errors = {}
  if (!input.firstName) errors.firstName = "First name is required"
  if (!input.lastName) errors.lastName = "Last name is required"
  if (!input.enrollmentNumber) errors.enrollmentNumber = "Enrollment number is required"
  if (!input.departmentIds.length) errors.departmentIds = "Select at least one department"
  return errors
}

export function StudentFormDialog({ open, onOpenChange, student }: StudentFormDialogProps) {
  const [values, setValues] = useState<StudentInput>({
    firstName: student?.user.firstName ?? "",
    lastName: student?.user.lastName ?? "",
    enrollmentNumber: student?.enrollmentNumber ?? "",
    departmentIds: student?.departments.map((d) => d.id) ?? [],
  })
  const [errors, setErrors] = useState<Errors>({})
  const create = studentApi.useCreate()
  const update = studentApi.useUpdate()
  const isEdit = student !== null

  const set = <K extends keyof StudentInput>(key: K, value: StudentInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }))
    setErrors((e) => ({ ...e, [key]: undefined }))
  }

  const handleSubmit = () => {
    const input = {
      ...values,
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      enrollmentNumber: values.enrollmentNumber.trim(),
    }
    const nextErrors = validate(input)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return

    const onSuccess = () => onOpenChange(false)
    if (isEdit) update.mutate({ id: student.id, input }, { onSuccess })
    else create.mutate(input, { onSuccess })
  }

  return (
    <FormDialog
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? "Update student" : "Add student"}
      description={isEdit ? "Change the student's details." : "Enroll a new student."}
      submitLabel={isEdit ? "Save changes" : "Create"}
      isPending={create.isPending || update.isPending}
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField id="student-first-name" label="First name" error={errors.firstName}>
          <Input
            id="student-first-name"
            value={values.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            aria-invalid={!!errors.firstName}
            autoFocus
          />
        </FormField>
        <FormField id="student-last-name" label="Last name" error={errors.lastName}>
          <Input
            id="student-last-name"
            value={values.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            aria-invalid={!!errors.lastName}
          />
        </FormField>
      </div>
      <FormField id="student-enrollment" label="Enrollment number" error={errors.enrollmentNumber}>
        <Input
          id="student-enrollment"
          value={values.enrollmentNumber}
          onChange={(e) => set("enrollmentNumber", e.target.value)}
          aria-invalid={!!errors.enrollmentNumber}
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
