import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { teacherApi } from "@/api/teachers"
import { useConfirm } from "@/components/confirm-dialog"
import { CrudPage } from "@/components/crud-page"
import { DataTable } from "@/components/data-table"
import { DepartmentBadges } from "@/components/department-badges"
import { RowActions } from "@/components/row-actions"
import { useFormDialog } from "@/hooks/use-form-dialog"
import { useListState } from "@/hooks/use-list-state"
import type { Teacher } from "@/types"
import { TeacherFormDialog } from "./teacher-form-dialog"

const fullName = (t: Teacher) => `${t.user.firstName} ${t.user.lastName}`

export function TeachersPage() {
  const list = useListState()
  const { data, isLoading, isError } = teacherApi.useList(list.params)
  const { mutateAsync: remove } = teacherApi.useDelete()
  const dialog = useFormDialog<Teacher>()
  const { openEdit } = dialog
  const confirm = useConfirm()

  const columns = useMemo<ColumnDef<Teacher>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { id: "name", header: "Name", accessorFn: fullName },
      { accessorKey: "designation", header: "Designation" },
      { accessorKey: "expertise", header: "Expertise" },
      {
        id: "departments",
        header: "Departments",
        cell: ({ row }) => <DepartmentBadges departments={row.original.departments} />,
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Actions</span>,
        cell: ({ row }) => (
          <RowActions
            label={fullName(row.original)}
            onEdit={() => openEdit(row.original)}
            onDelete={() =>
              confirm({
                title: "Delete teacher?",
                description: `${fullName(row.original)} will be permanently deleted.`,
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
      title="Teachers"
      description="Manage the faculty and their departments."
      addLabel="Add teacher"
      onAdd={dialog.openCreate}
      search={list.search}
      onSearchChange={list.setSearch}
      searchPlaceholder="Search teachers by name..."
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
      <TeacherFormDialog key={dialog.key} open={dialog.open} onOpenChange={dialog.setOpen} teacher={dialog.item} />
    </CrudPage>
  )
}
