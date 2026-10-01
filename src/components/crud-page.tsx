import type { ReactNode } from "react"
import { PlusIcon, SearchIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"

type CrudPageProps = {
  title: string
  description: string
  addLabel: string
  onAdd: () => void
  search: string
  onSearchChange: (value: string) => void
  searchPlaceholder: string
  children: ReactNode
}

// Page header, search box and "Add" action shared by the three CRUD screens
export function CrudPage({
  title,
  description,
  addLabel,
  onAdd,
  search,
  onSearchChange,
  searchPlaceholder,
  children,
}: CrudPageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <InputGroup className="sm:max-w-xs">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </InputGroup>
        <Button onClick={onAdd}>
          <PlusIcon data-icon="inline-start" />
          {addLabel}
        </Button>
      </div>
      {children}
    </div>
  )
}
