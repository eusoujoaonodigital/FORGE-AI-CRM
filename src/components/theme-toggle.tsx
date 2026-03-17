"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  // Evita erro de hidratação no Next.js
  React.useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-3 rounded-full border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:scale-110 transition-all shadow-xl"
    >
      {theme === "dark" ? (
        <Sun className="h-6 w-6 text-yellow-400" />
      ) : (
        <Moon className="h-6 w-6 text-slate-700" />
      )}
      <span className="sr-only">Trocar Tema</span>
    </button>
  )
}