import { Link } from "react-router"
import { BuildingIcon, GraduationCapIcon, UsersIcon, type LucideIcon } from "lucide-react"
import { departmentApi } from "@/api/departments"
import { studentApi } from "@/api/students"
import { teacherApi } from "@/api/teachers"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// limit=1 is enough: only meta.total is needed for the counts
const countParams = { page: 1, limit: 1 }

function StatCard({ to, title, icon: Icon, total }: { to: string; title: string; icon: LucideIcon; total?: number }) {
  return (
    <Link to={to} className="rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
      <Card className="transition-colors hover:bg-muted/50">
        <CardHeader>
          <CardDescription className="flex items-center gap-2">
            <Icon className="size-4" />
            {title}
          </CardDescription>
          <CardTitle className="text-3xl tabular-nums">
            {total === undefined ? <Skeleton className="h-9 w-16" /> : total}
          </CardTitle>
        </CardHeader>
      </Card>
    </Link>
  )
}

export function HomePage() {
  const departments = departmentApi.useList(countParams)
  const students = studentApi.useList(countParams)
  const teachers = teacherApi.useList(countParams)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome</h1>
        <p className="text-muted-foreground">Manage departments, students and teachers from one place.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard to="/department" title="Departments" icon={BuildingIcon} total={departments.data?.meta.total} />
        <StatCard to="/student" title="Students" icon={GraduationCapIcon} total={students.data?.meta.total} />
        <StatCard to="/teacher" title="Teachers" icon={UsersIcon} total={teachers.data?.meta.total} />
      </div>
    </div>
  )
}
