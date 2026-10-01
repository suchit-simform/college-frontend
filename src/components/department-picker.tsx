import { useDepartmentOptions } from "@/api/departments"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

type DepartmentPickerProps = {
  value: number[]
  onChange: (ids: number[]) => void
  error?: string
}

// Multi-select for departmentIds: students and teachers can belong to several departments
export function DepartmentPicker({ value, onChange, error }: DepartmentPickerProps) {
  const { data, isLoading } = useDepartmentOptions()

  const toggle = (id: number, checked: boolean) =>
    onChange(checked ? [...value, id] : value.filter((v) => v !== id))

  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">Departments</legend>
      <div className="grid max-h-40 gap-2 overflow-y-auto rounded-lg border p-3">
        {isLoading && <Skeleton className="h-5 w-full" />}
        {data?.data.map((department) => (
          <div key={department.id} className="flex items-center gap-2">
            <Checkbox
              id={`department-${department.id}`}
              checked={value.includes(department.id)}
              onCheckedChange={(checked) => toggle(department.id, checked === true)}
            />
            <Label htmlFor={`department-${department.id}`} className="font-normal">
              {department.name}
            </Label>
          </div>
        ))}
        {data && data.data.length === 0 && (
          <p className="text-sm text-muted-foreground">Create a department first.</p>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </fieldset>
  )
}
