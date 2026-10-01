import { createContext, useCallback, useContext, useState, type ReactNode } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type ConfirmOptions = {
  title: string
  description: ReactNode
  actionLabel?: string
  // The dialog stays open with a pending state until this settles, and closes only on success
  onConfirm: () => Promise<unknown>
}

const ConfirmContext = createContext<((options: ConfirmOptions) => void) | null>(null)

// One shared delete-confirmation dialog for every page, opened through useConfirm()
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null)
  const [pending, setPending] = useState(false)

  const confirm = useCallback((next: ConfirmOptions) => setOptions(next), [])

  const handleConfirm = async (event: React.MouseEvent) => {
    event.preventDefault()
    if (!options) return
    setPending(true)
    try {
      await options.onConfirm()
      setOptions(null)
    } catch {
      // The mutation already shows the error as a toast
    } finally {
      setPending(false)
    }
  }

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <AlertDialog open={options !== null} onOpenChange={(open) => !open && !pending && setOptions(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{options?.title}</AlertDialogTitle>
            <AlertDialogDescription>{options?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" disabled={pending} onClick={handleConfirm}>
              {pending ? "Deleting..." : (options?.actionLabel ?? "Delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmContext.Provider>
  )
}

export function useConfirm() {
  const confirm = useContext(ConfirmContext)
  if (!confirm) throw new Error("useConfirm must be used inside ConfirmProvider")
  return confirm
}
