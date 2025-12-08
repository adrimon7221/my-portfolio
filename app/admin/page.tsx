/**
 * Panel Administrativo
 * 
 * Redirige a la primera sección disponible (Proyectos)
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"

export default async function AdminPage() {
  // Verificar si el usuario está autenticado
  const session = await auth()

  // Si no hay sesión, redirigir al login
  if (!session?.user) {
    redirect("/admin/login")
  }

  // Redirigir a Proyectos como página principal
  redirect("/admin/proyectos")
}

