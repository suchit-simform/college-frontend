import axios, { isAxiosError } from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
})

type ApiErrorBody = {
  error?: string
  details?: { path: string; message: string }[]
}

// Turns the backend's { error, details } body into one readable message
export function getErrorMessage(error: unknown) {
  if (isAxiosError<ApiErrorBody>(error)) {
    const body = error.response?.data
    if (body?.details?.length) {
      return body.details.map((d) => (d.path ? `${d.path}: ${d.message}` : d.message)).join(", ")
    }
    if (body?.error) return body.error
  }
  return error instanceof Error ? error.message : "Something went wrong"
}
