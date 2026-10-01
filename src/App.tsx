import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter } from "react-router"
import { RouterProvider } from "react-router/dom"
import { ConfirmProvider } from "@/components/confirm-dialog"
import { Layout } from "@/components/layout"
import { Toaster } from "@/components/ui/sonner"
import { DepartmentsPage } from "@/pages/departments/departments-page"
import { HomePage } from "@/pages/home-page"
import { NotFoundPage } from "@/pages/not-found-page"
import { StudentsPage } from "@/pages/students/students-page"
import { TeachersPage } from "@/pages/teachers/teachers-page"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
})

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "department", element: <DepartmentsPage /> },
      { path: "student", element: <StudentsPage /> },
      { path: "teacher", element: <TeachersPage /> },
      { path: "*", element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfirmProvider>
        <RouterProvider router={router} />
      </ConfirmProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  )
}
