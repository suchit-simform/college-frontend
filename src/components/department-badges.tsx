import { Badge } from "@/components/ui/badge"
import type { Department } from "@/types"

export function DepartmentBadges({ departments }: { departments: Department[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {departments.map((d) => (
        <Badge key={d.id} variant="secondary">
          {d.name}
        </Badge>
      ))}
    </div>
  )
}
