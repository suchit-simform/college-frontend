import { createCrudHooks } from "@/api/crud"
import type { Teacher, TeacherInput } from "@/types"

export const teacherApi = createCrudHooks<Teacher, TeacherInput>("teachers", "Teacher")
