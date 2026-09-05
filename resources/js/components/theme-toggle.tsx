import React from "react"
import { Button } from "@/components/ui/button"

export function ThemeToggle({ className }: { className?: string }) {
  const [isDark, setIsDark] = React.useState(false)

  React.useEffect(() => {
    // Cek kondisi awal saat komponen dimuat
    const root = document.documentElement
    const isDarkModeActive = root.classList.contains("dark")
    setIsDark(isDarkModeActive)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle("dark")

    // Perbarui state berdasarkan keberadaan class "dark" saat ini
    const active = root.classList.contains("dark")
    setIsDark(active)

    // Opsional: Simpan preferensi ke localStorage agar tidak reset saat refresh
    localStorage.setItem("theme", active ? "dark" : "light")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className={className}
      aria-label="Toggle theme"
    >
      {isDark ? "🌞 Light" : "🌙 Dark"}
    </Button>
  )
}
