import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { departmentApi } from "@/api/departments"
import { useConfirm } from "@/components/confirm-dialog"
import { CrudPage } from "@/components/crud-page"
import { DataTable } from "@/components/data-table"
import { RowActions } from "@/components/row-actions"
import { useFormDialog } from "@/hooks/use-form-dialog"
import { useListState } from "@/hooks/use-list-state"
import type { Department } from "@/types"
import { DepartmentFormDialog } from "./department-form-dialog"

export function DepartmentsPage() {
  const list = useListState()
  const { data, isLoading, isError } = departmentApi.useList(list.params)
  const { mutateAsync: remove } = departmentApi.useDelete()
  const dialog = useFormDialog<Department>()
  const { openEdit } = dialog
  const confirm = useConfirm()

  const columns = useMemo<ColumnDef<Department>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "name", header: "Name" },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActions
            label={row.original.name}
            onEdit={() => openEdit(row.original)}
            onDelete={() =>
              confirm({
                title: "Delete department?",
                description: `"${row.original.name}" will be permanently deleted. A department that still has students or teachers can't be deleted.`,
                onConfirm: () => remove(row.original.id),
              })
            }
          />
        ),
      },
    ],
    [openEdit, confirm, remove],
  )

  return (
    <CrudPage
      title="Departments"
      description="Manage the college's departments."
      addLabel="Add department"
      onAdd={dialog.openCreate}
      search={list.search}
      onSearchChange={list.setSearch}
      searchPlaceholder="Search departments..."
    >
      <DataTable
        columns={columns}
        data={data?.data ?? []}
        total={data?.meta.total ?? 0}
        pageCount={data?.meta.totalPages ?? 0}
        pagination={list.pagination}
        onPaginationChange={list.setPagination}
        isLoading={isLoading}
        isError={isError}
      />
      <DepartmentFormDialog key={dialog.key} open={dialog.open} onOpenChange={dialog.setOpen} department={dialog.item} />
    </CrudPage>
  )
}
