import { createCrudHooks } from "@/api/crud"
import type { Department, DepartmentInput } from "@/types"

export const departmentApi = createCrudHooks<Department, DepartmentInput>("departments", "Department")

// The backend caps limit at 100, plenty for the department pickers in the member forms
export const useDepartmentOptions = () => departmentApi.useList({ page: 1, limit: 100 })
