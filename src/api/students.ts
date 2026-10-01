import { createCrudHooks } from "@/api/crud"
import type { Student, StudentInput } from "@/types"

export const studentApi = createCrudHooks<Student, StudentInput>("students", "Student")
