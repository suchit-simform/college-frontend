import { useState } from "react"
import type { PaginationState } from "@tanstack/react-table"
import { useDebouncedValue } from "@/hooks/use-debounced-value"

// Pagination and search state for a server-paginated grid
export function useListState() {
  const [pagination, setPagination] = useState<PaginationState>({ pageIndex: 0, pageSize: 10 })
  const [search, setSearchValue] = useState("")
  const name = useDebouncedValue(search.trim())

  const setSearch = (value: string) => {
    setSearchValue(value)
    setPagination((p) => ({ ...p, pageIndex: 0 }))
  }

  return {
    pagination,
    setPagination,
    search,
    setSearch,
    params: { page: pagination.pageIndex + 1, limit: pagination.pageSize, name },
  }
}
