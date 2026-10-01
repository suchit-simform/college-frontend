export type Paginated<T> = {
  data: T[]
  meta: { page: number; limit: number; total: number; totalPages: number }
}

export type ListParams = {
  page: number
  limit: number
  name?: string
}

export type Department = {
  id: number
  name: string
}

export type DepartmentInput = {
  name: string
}

type Member = {
  id: number
  userId: number
  user: { id: number; firstName: string; lastName: string; userType: "student" | "teacher" }
  departments: Department[]
}

export type Student = Member & {
  enrollmentNumber: string
}

export type StudentInput = {
  firstName: string
  lastName: string
  enrollmentNumber: string
  departmentIds: number[]
}

export type Teacher = Member & {
  designation: string
  expertise: string
}

export type TeacherInput = {
  firstName: string
  lastName: string
  designation: string
  expertise: string
  departmentIds: number[]
}
