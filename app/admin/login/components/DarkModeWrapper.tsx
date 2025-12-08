"use client"

/**
 * Wrapper para forzar modo oscuro en la página de login
 */

import { useEffect } from "react"

export function DarkModeWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Forzar modo oscuro agregando la clase 'dark' al html
    document.documentElement.classList.add("dark")
    
    return () => {
      // Opcional: remover la clase al desmontar (si quieres)
      // document.documentElement.classList.remove("dark")
    }
  }, [])

  return <>{children}</>
}

