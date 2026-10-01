import { useCallback, useState } from "react"

// Tracks which record a create/update dialog is editing (null = create). The record is kept
// after closing so the content doesn't change during the close animation, and `key`
// remounts the form so each opening starts from fresh values.
export function useFormDialog<T>() {
  const [state, setState] = useState<{ open: boolean; item: T | null; key: number }>({
    open: false,
    item: null,
    key: 0,
  })

  const openCreate = useCallback(() => setState((s) => ({ open: true, item: null, key: s.key + 1 })), [])
  const openEdit = useCallback((item: T) => setState((s) => ({ open: true, item, key: s.key + 1 })), [])
  const setOpen = useCallback((open: boolean) => setState((s) => ({ ...s, open })), [])

  return { ...state, openCreate, openEdit, setOpen }
}
