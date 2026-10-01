import { useMemo } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { studentApi } from "@/api/students"
import { useConfirm } from "@/components/confirm-dialog"
import { CrudPage } from "@/components/crud-page"
import { DataTable } from "@/components/data-table"
import { DepartmentBadges } from "@/components/department-badges"
import { RowActions } from "@/components/row-actions"
import { useFormDialog } from "@/hooks/use-form-dialog"
import { useListState } from "@/hooks/use-list-state"
import type { Student } from "@/types"
import { StudentFormDialog } from "./student-form-dialog"

const fullName = (s: Student) => `${s.user.firstName} ${s.user.lastName}`

export function StudentsPage() {
  const list = useListState()
  const { data, isLoading, isError } = studentApi.useList(list.params)
  const { mutateAsync: remove } = studentApi.useDelete()
  const dialog = useFormDialog<Student>()
  const { openEdit } = dialog
  const confirm = useConfirm()

  const columns = useMemo<ColumnDef<Student>[]>(
    () => [
      { accessorKey: "id", header: "ID" },
      { id: "name", header: "Name", accessorFn: fullName },
      { accessorKey: "enrollmentNumber", header: "Enrollment no." },
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
                title: "Delete student?",
                description: `${fullName(row.original)} (${row.original.enrollmentNumber}) will be permanently deleted.`,
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
      title="Students"
      description="Manage enrolled students and their departments."
      addLabel="Add student"
      onAdd={dialog.openCreate}
      search={list.search}
      onSearchChange={list.setSearch}
      searchPlaceholder="Search students by name..."
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
      <StudentFormDialog key={dialog.key} open={dialog.open} onOpenChange={dialog.setOpen} student={dialog.item} />
    </CrudPage>
  )
}
