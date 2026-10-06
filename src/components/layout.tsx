import { useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { MoonIcon, SchoolIcon, SunIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, isDepartmentFeatureEnable } from "@/lib/utils";
import { useThemeStore } from "@/store/theme";

const navItems = [
  { to: "/", label: "Home" },
  ...(isDepartmentFeatureEnable()
    ? [{ to: "/department", label: "Departments" }]
    : []),
  { to: "/student", label: "Student" },
  { to: "/teacher", label: "Teacher" },
];

export function Layout() {
  const { theme, toggleTheme } = useThemeStore();

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <div className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <NavLink to="/" className="flex items-center gap-2 font-semibold">
            <SchoolIcon className="size-5" />
            <span className="hidden sm:inline">College</span>
          </NavLink>
          <nav
            className="flex flex-1 items-center gap-1 overflow-x-auto"
            aria-label="Main"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "rounded-md px-3 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground",
                    isActive && "bg-muted text-foreground",
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </Button>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
