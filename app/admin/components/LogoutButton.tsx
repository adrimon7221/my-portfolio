"use client"

/**
 * Botón de Cerrar Sesión
 * 
 * Componente para cerrar sesión usando NextAuth signOut
 */

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useState } from "react"

export function LogoutButton() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/admin/login"
      })
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Error al cerrar sesión:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      onClick={handleLogout}
      disabled={loading}
      className="gap-2"
    >
      <LogOut className="h-4 w-4" />
      {loading ? "Cerrando sesión..." : "Cerrar sesión"}
    </Button>
  )
}

