import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { api, getErrorMessage } from "@/lib/api"
import type { ListParams, Paginated } from "@/types"

// One set of TanStack Query hooks per REST resource (list, create, update, delete)
export function createCrudHooks<T, TInput>(resource: string, label: string) {
  const keys = {
    all: [resource] as const,
    list: (params: ListParams) => [resource, "list", params] as const,
  }

  function useList(params: ListParams) {
    return useQuery({
      queryKey: keys.list(params),
      queryFn: async () => {
        const { data } = await api.get<Paginated<T>>(`/${resource}`, {
          params: { page: params.page, limit: params.limit, name: params.name || undefined },
        })
        return data
      },
      placeholderData: keepPreviousData,
    })
  }

  function useInvalidate() {
    const queryClient = useQueryClient()
    // Members embed department names, so a department change refreshes every list
    return () => queryClient.invalidateQueries({ queryKey: resource === "departments" ? [] : keys.all })
  }

  function useCreate() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: async (input: TInput) => (await api.post<T>(`/${resource}`, input)).data,
      onSuccess: () => {
        toast.success(`${label} created`)
        return invalidate()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  function useUpdate() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: async ({ id, input }: { id: number; input: Partial<TInput> }) =>
        (await api.put<T>(`/${resource}/${id}`, input)).data,
      onSuccess: () => {
        toast.success(`${label} updated`)
        return invalidate()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  function useDelete() {
    const invalidate = useInvalidate()
    return useMutation({
      mutationFn: async (id: number) => {
        await api.delete(`/${resource}/${id}`)
      },
      onSuccess: () => {
        toast.success(`${label} deleted`)
        return invalidate()
      },
      onError: (error) => toast.error(getErrorMessage(error)),
    })
  }

  return { keys, useList, useCreate, useUpdate, useDelete }
}
