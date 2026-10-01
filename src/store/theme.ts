import { create } from "zustand"
import { persist } from "zustand/middleware"

type Theme = "light" | "dark"

type ThemeState = {
  theme: Theme
  toggleTheme: () => void
}

// Global, persisted UI preference shared by the header toggle and the toaster
export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: "light",
      toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
    }),
    { name: "college-theme" },
  ),
)
