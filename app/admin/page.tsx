/**
 * Panel Administrativo - Dashboard
 * 
 * Página principal del panel administrativo con resumen y estadísticas.
 */

import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { AdminLayout } from "./components/AdminLayout"

export default async function AdminPage() {
  // Verificar si el usuario está autenticado
  const session = await auth()

  // Si no hay sesión, redirigir al login
  if (!session?.user) {
    redirect("/admin/login")
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-[#3D3D3D] rounded-2xl p-8 border border-white/10">
          <h1 className="text-3xl font-semibold text-white">
            Dashboard
          </h1>
        </div>
        <div className="bg-[#3D3D3D] rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white">Resumen</h2>
        </div>
        <div className="bg-[#3D3D3D] rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-semibold text-white">Estadísticas</h2>
        </div>
      </div>
    </AdminLayout>
  )
}

